require "fileutils"
require "json"
require "open3"
require "pathname"
require "tmpdir"
require "yaml"

WORKSPACE_ROOTS = %w[apps packages tooling].freeze
DEPENDENCY_FIELDS = %w[dependencies devDependencies optionalDependencies].freeze
MANIFEST_FIELDS = (DEPENDENCY_FIELDS + %w[name version peerDependencies peerDependenciesMeta]).freeze
AUDITED_SETTINGS = %w[packages catalog catalogs overrides autoInstallPeers].freeze
INSTALL_ONLY_SETTINGS = %w[allowBuilds engineStrict minimumReleaseAgeExclude strictPeerDependencies].freeze
REGULAR_MODES = %w[100644 100755].freeze
RESERVED_KEYS = %w[__proto__ constructor prototype <<].freeze
RESOLVER_FILES = %w[.npmrc .pnpmfile.cjs .pnpmfile.mjs package.json5 package.yaml].freeze
MAX_BLOB_BYTES = 8 * 1024 * 1024
PACKAGE_NAME = %r{(?:@[a-zA-Z0-9_.-]+/)?[a-zA-Z0-9_.-]+}
REGISTRY_PACKAGE = /\A#{PACKAGE_NAME}@\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?(?:\+[a-zA-Z0-9.-]+)?\z/
VERSION_RANGE = /[0-9a-zA-Z*^~<>=.|+ -]+/
REGISTRY_SPECIFIER = /\A#{VERSION_RANGE}\z/
NPM_ALIAS = /\Anpm:#{PACKAGE_NAME}(?:@#{VERSION_RANGE})?\z/
INTEGRITY = /\Asha(?:1|256|384|512)-[a-zA-Z0-9+\/]+={0,2}\z/

class UniqueJsonKeys < Hash
  def []=(key, value)
    raise ArgumentError, "Duplicate or reserved JSON key" if key?(key) || RESERVED_KEYS.include?(key)

    super
  end
end

def git(*args)
  output, _error, status = Open3.capture3("git", "--no-replace-objects", *args, binmode: true)
  raise ArgumentError, "Could not read the candidate Git object" unless status.success?

  output
end

def tree_entries(object, *names)
  git("ls-tree", "-z", object, "--", *names).split("\0").to_h do |entry|
    metadata, name = entry.split("\t", 2)
    mode, type, oid = metadata.split(" ")
    [name, [mode, type, oid]]
  end
end

def blob(entry, name)
  mode, type, oid = entry
  unless REGULAR_MODES.include?(mode) && type == "blob"
    raise ArgumentError, "#{name} must be a regular tracked file"
  end
  raise ArgumentError, "#{name} exceeds the audit input size limit" if git("cat-file", "-s", oid).to_i > MAX_BLOB_BYTES

  git("cat-file", "blob", oid)
end

def mapping(value, label)
  raise ArgumentError, "#{label} must be an object with string keys" unless value.is_a?(Hash) && value.keys.all? { |key| key.is_a?(String) }

  value
end

def yaml_mapping(source, label)
  documents = YAML.parse_stream(source).children
  raise ArgumentError, "#{label} must contain one YAML document" unless documents.length == 1

  nodes = documents.dup
  until nodes.empty?
    node = nodes.pop
    if node.tag || node.is_a?(Psych::Nodes::Alias)
      raise ArgumentError, "#{label} contains an explicit YAML tag or alias"
    end
    if node.is_a?(Psych::Nodes::Mapping)
      keys = node.children.each_slice(2).map(&:first)
      unless keys.all? { |key| key.is_a?(Psych::Nodes::Scalar) && !RESERVED_KEYS.include?(key.value) } &&
             keys.map(&:value).uniq.size == keys.size
        raise ArgumentError, "#{label} contains invalid or duplicate YAML keys"
      end
    end
    nodes.concat(node.children || [])
  end

  mapping(YAML.safe_load(source, aliases: false), label)
rescue Psych::Exception
  raise ArgumentError, "#{label} is not supported YAML"
end

def manifest(entry, path)
  raw = mapping(JSON.parse(blob(entry, path), object_class: UniqueJsonKeys), path)
  publish = mapping(raw.fetch("publishConfig", {}), "Package publishConfig")
  engines = mapping(raw.fetch("engines", {}), "Package engines")
  dev_engines = mapping(raw.fetch("devEngines", {}), "Package devEngines")
  if raw.key?("pnpm") || raw.key?("dependenciesMeta") ||
     publish.key?("directory") || publish.key?("linkDirectory") ||
     engines.key?("runtime") || dev_engines.key?("runtime")
    raise ArgumentError, "Unsupported package manager configuration in #{path}"
  end

  (DEPENDENCY_FIELDS + ["peerDependencies"]).each do |field|
    check_specifiers(raw.fetch(field, {}), allow_workspace: true)
  end
  raw.select { |name, _value| MANIFEST_FIELDS.include?(name) }
rescue JSON::ParserError
  raise ArgumentError, "#{path} is not valid JSON"
end

def reject_resolver_files(entries, names)
  if names.any? { |name| entries.key?(name) }
    raise ArgumentError, "Candidate package manager configuration and hooks are outside the protected audit model"
  end
end

def workspace_manifests(root)
  manifests = { "." => manifest(root["package.json"], "package.json") }
  WORKSPACE_ROOTS.each do |workspace|
    _mode, type, oid = root[workspace]
    raise ArgumentError, "#{workspace} must be a Git directory" unless type == "tree"

    tree_entries(oid).each do |name, (mode, kind, child)|
      if %w[120000 160000].include?(mode)
        raise ArgumentError, "#{workspace} cannot contain a workspace symlink or submodule"
      end
      next unless kind == "tree"

      raise ArgumentError, "Unsupported workspace directory name" unless name.match?(/\A[a-zA-Z0-9][a-zA-Z0-9._-]*\z/)

      importer = "#{workspace}/#{name}"
      unsupported = RESOLVER_FILES + %w[pnpm-workspace.yaml pnpm-lock.yaml]
      entries = tree_entries(child, "package.json", *unsupported)
      reject_resolver_files(entries, unsupported)
      entry = entries["package.json"]
      manifests[importer] = manifest(entry, "#{importer}/package.json") if entry
    end
  end
  manifests
end

def workspace_settings(source)
  config = yaml_mapping(source, "pnpm-workspace.yaml")
  unless config["packages"] == WORKSPACE_ROOTS.map { |name| "#{name}/*" }
    raise ArgumentError, "Unsupported workspace package patterns"
  end
  unless (config.keys - AUDITED_SETTINGS - INSTALL_ONLY_SETTINGS).empty?
    raise ArgumentError, "Workspace contains settings outside the protected audit model"
  end

  check_specifiers(config.fetch("catalog", {}))
  mapping(config.fetch("catalogs", {}), "Workspace catalogs").each_value { |catalog| check_specifiers(catalog) }
  check_specifiers(config.fetch("overrides", {}), allow_reference: true)
  config.select { |name, _value| AUDITED_SETTINGS.include?(name) }
end

def check_specifiers(specifiers, allow_workspace: false, allow_reference: false)
  mapping(specifiers, "Dependency specifiers").each_value do |specifier|
    if specifier.is_a?(String)
      next if REGISTRY_SPECIFIER.match?(specifier) && specifier != "." && specifier != ".."
      next if NPM_ALIAS.match?(specifier)
      if allow_workspace
        next if specifier.match?(/\Acatalog:[a-zA-Z0-9_.-]*\z/)
        if specifier.start_with?("workspace:")
          range = specifier.delete_prefix("workspace:")
          next if REGISTRY_SPECIFIER.match?(range) && range != "." && range != ".."
        end
      end
      next if allow_reference && specifier.match?(/\A\$#{PACKAGE_NAME}\z/)
    end
    raise ArgumentError, "Dependency specifier is outside the protected audit model"
  end
end

def check_registry_reference(name, version, snapshots)
  unless version.is_a?(String) && (snapshots.key?("#{name}@#{version}") || snapshots.key?(version))
    raise ArgumentError, "Lockfile dependency refers to a missing registry snapshot"
  end
end

def check_lockfile(source, manifests)
  lock = yaml_mapping(source, "pnpm-lock.yaml")
  raise ArgumentError, "Unsupported lockfile version" unless lock["lockfileVersion"] == "9.0"

  importers = mapping(lock["importers"], "Lockfile importers")
  packages = mapping(lock["packages"], "Lockfile packages")
  snapshots = mapping(lock["snapshots"], "Lockfile snapshots")
  raise ArgumentError, "Lockfile importers do not match candidate workspace manifests" unless importers.keys.sort == manifests.keys.sort

  snapshots.each do |key, snapshot|
    package_id = key.split("(", 2).first
    raise ArgumentError, "Lockfile snapshot is not a registry package" unless REGISTRY_PACKAGE.match?(package_id)

    package = mapping(packages[package_id], "Lockfile snapshot package")
    resolution = mapping(package["resolution"], "Lockfile package resolution")
    integrity = resolution["integrity"]
    unless resolution.keys == ["integrity"] && integrity.is_a?(String) && INTEGRITY.match?(integrity)
      raise ArgumentError, "Audit only supports registry packages with integrity metadata"
    end
    %w[dependencies optionalDependencies].each do |field|
      mapping(mapping(snapshot, "Lockfile snapshot").fetch(field, {}), field).each do |name, version|
        check_registry_reference(name, version, snapshots)
      end
    end
  end

  importers.each do |importer, record|
    DEPENDENCY_FIELDS.each do |field|
      mapping(mapping(record, "Lockfile importer").fetch(field, {}), field).each do |name, dependency|
        entry = mapping(dependency, "Locked dependency")
        version = entry["version"]
        if version.is_a?(String) && version.start_with?("link:")
          target = Pathname.new(importer).join(version.delete_prefix("link:")).cleanpath.to_s
          unless entry["specifier"].is_a?(String) && entry["specifier"].start_with?("workspace:") && manifests.dig(target, "name") == name
            raise ArgumentError, "Lockfile link does not resolve to the declared workspace package"
          end
        else
          check_registry_reference(name, version, snapshots)
        end
      end
    end
  end
end

def verify_frozen_lockfile(manifests, settings, lockfile)
  Dir.mktmpdir("audit-frozen-") do |directory|
    manifests.each do |importer, content|
      FileUtils.mkdir_p(File.join(directory, importer))
      File.write(File.join(directory, importer, "package.json"), JSON.generate(content))
    end
    File.write(File.join(directory, "pnpm-workspace.yaml"), YAML.dump(settings))
    File.binwrite(File.join(directory, "pnpm-lock.yaml"), lockfile)

    env = { "PATH" => ENV.fetch("PATH"), "HOME" => directory, "CI" => "true" }
    # This offline step checks manifest consistency. The audit and regular frozen install run separately.
    stdout, stderr, status = Open3.capture3(
      env, "pnpm", "install", "--offline", "--lockfile-only", "--frozen-lockfile",
      "--ignore-scripts", "--ignore-pnpmfile", "--trust-lockfile",
      chdir: directory, unsetenv_others: true
    )
    next if status.success?

    code = "#{stdout}\n#{stderr}"[/ERR_PNPM_[A-Z_]+/]
    raise ArgumentError, "Candidate lockfile failed frozen manifest validation#{": #{code}" if code}"
  end
end

begin
  commit, output_dir = ARGV
  unless ARGV.length == 2 && commit.match?(/\A[0-9a-f]{40}\z/) && git("cat-file", "-t", commit).strip == "commit"
    raise ArgumentError, "Usage: stage-audit-input.rb <candidate-commit-sha> <new-output-dir>"
  end
  root = tree_entries(commit)
  reject_resolver_files(root, RESOLVER_FILES)

  manifests = workspace_manifests(root)
  settings = workspace_settings(blob(root["pnpm-workspace.yaml"], "pnpm-workspace.yaml"))
  lockfile = blob(root["pnpm-lock.yaml"], "pnpm-lock.yaml")
  check_lockfile(lockfile, manifests)
  verify_frozen_lockfile(manifests, settings, lockfile)
  Dir.mkdir(output_dir, 0o700)
  File.binwrite(File.join(output_dir, "pnpm-lock.yaml"), lockfile)
rescue ArgumentError, SystemCallError => error
  abort "Audit input rejected: #{error.message}"
end
