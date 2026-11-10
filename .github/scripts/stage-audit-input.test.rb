require "fileutils"
require "json"
require "open3"
require "rbconfig"
require "tmpdir"
require "yaml"

STAGE_SCRIPT = File.expand_path("stage-audit-input.rb", __dir__)
GIT_IDENTITY = {
  "GIT_AUTHOR_NAME" => "Fixture",
  "GIT_AUTHOR_EMAIL" => "fixture@example.test",
  "GIT_COMMITTER_NAME" => "Fixture",
  "GIT_COMMITTER_EMAIL" => "fixture@example.test"
}.freeze
LOCKFILE = {
  "lockfileVersion" => "9.0",
  "settings" => { "autoInstallPeers" => true, "excludeLinksFromLockfile" => false },
  "catalogs" => { "default" => { "is-number" => { "specifier" => "^7.0.0", "version" => "7.0.0" } } },
  "importers" => {
    "." => { "devDependencies" => { "is-number" => { "specifier" => "catalog:", "version" => "7.0.0" } } },
    "apps/web" => {
      "dependencies" => { "@repo/demo" => { "specifier" => "workspace:*", "version" => "link:../../packages/demo" } }
    },
    "packages/demo" => { "dependencies" => { "is-number" => { "specifier" => "^7.0.0", "version" => "7.0.0" } } },
    "tooling/scripts" => {}
  },
  "packages" => { "is-number@7.0.0" => { "resolution" => { "integrity" => "sha512-YQ==" } } },
  "snapshots" => { "is-number@7.0.0" => {} }
}.freeze
WORKSPACE = {
  "packages" => %w[apps/* packages/* tooling/*],
  "autoInstallPeers" => true,
  "catalog" => { "is-number" => "^7.0.0" }
}.freeze

def git(directory, *arguments)
  stdout, stderr, status = Open3.capture3(GIT_IDENTITY, "git", *arguments, chdir: directory)
  raise stderr unless status.success?

  stdout.strip
end

def write_manifest(directory, importer, manifest)
  parent = File.join(directory, importer)
  FileUtils.mkdir_p(parent)
  File.write(File.join(parent, "package.json"), JSON.generate(manifest))
end

def run_fixture(name, error = nil)
  Dir.mktmpdir("audit-stage-test-") do |directory|
    repo = File.join(directory, "repo")
    Dir.mkdir(repo)
    git(repo, "init", "--quiet")
    lockfile = File.join(repo, "pnpm-lock.yaml")
    File.write(lockfile, LOCKFILE.to_yaml.delete_prefix("---\n"))
    File.write(File.join(repo, "pnpm-workspace.yaml"), WORKSPACE.to_yaml)
    marker = File.join(directory, "executed")
    write_manifest(repo, ".", {
      "name" => "fixture",
      "devDependencies" => { "is-number" => "catalog:" },
      "scripts" => { "preinstall" => "touch #{marker}" },
      "packageManager" => "pnpm@0.0.0"
    })
    write_manifest(repo, "apps/web", { "name" => "web", "dependencies" => { "@repo/demo" => "workspace:*" } })
    write_manifest(repo, "packages/demo", { "name" => "@repo/demo", "dependencies" => { "is-number" => "^7.0.0" } })
    write_manifest(repo, "tooling/scripts", { "name" => "@repo/scripts" })
    yield repo, lockfile, marker if block_given?

    git(repo, "add", "--all")
    tree = git(repo, "write-tree")
    revision = git(repo, "commit-tree", tree, "-m", "Audit candidate fixture")
    output = File.join(directory, "input")
    stdout, stderr, status = Open3.capture3(RbConfig.ruby, STAGE_SCRIPT, revision, output, chdir: repo)

    raise "#{name}: candidate script was executed" if File.exist?(marker)
    if error
      unless !status.success? && stderr.include?(error) && !File.exist?(output)
        raise "#{name}: expected #{error.inspect}, got #{[status.exitstatus, stdout, stderr].inspect}"
      end
    else
      unless status.success? && Dir.children(output) == ["pnpm-lock.yaml"] &&
             File.binread(File.join(output, "pnpm-lock.yaml")) == File.binread(lockfile)
        raise "#{name}: did not stage the original lockfile: #{[stdout, stderr].inspect}"
      end
    end
    puts "PASS #{name}"
  end
end

run_fixture("stages only the lockfile without using candidate scripts or packageManager")

run_fixture("rejects a stale workspace manifest", "ERR_PNPM_OUTDATED_LOCKFILE") do |repo|
  write_manifest(repo, "packages/demo", { "name" => "@repo/demo", "dependencies" => { "is-number" => "^6.0.0" } })
end

run_fixture("rejects injected workspace dependency metadata", "Unsupported package manager configuration") do |repo|
  write_manifest(repo, "apps/web", {
    "name" => "web",
    "dependencies" => { "@repo/demo" => "workspace:*" },
    "dependenciesMeta" => { "@repo/demo" => { "injected" => true } }
  })
end

run_fixture("rejects an alternate published directory", "Unsupported package manager configuration") do |repo|
  write_manifest(repo, "packages/demo", {
    "name" => "@repo/demo",
    "dependencies" => { "is-number" => "^7.0.0" },
    "publishConfig" => { "directory" => "dist" }
  })
end

run_fixture("rejects managed runtime metadata", "Unsupported package manager configuration") do |repo|
  write_manifest(repo, "packages/demo", {
    "name" => "@repo/demo",
    "dependencies" => { "is-number" => "^7.0.0" },
    "devEngines" => { "runtime" => { "name" => "node", "version" => "24.16.0" } }
  })
end

run_fixture("rejects a local file dependency", "Dependency specifier is outside") do |repo|
  write_manifest(repo, "packages/demo", { "name" => "@repo/demo", "dependencies" => { "is-number" => "file:../../archive.tgz" } })
end

run_fixture("rejects a stale workspace catalog", "ERR_PNPM_LOCKFILE_CONFIG_MISMATCH") do |repo|
  File.write(File.join(repo, "pnpm-workspace.yaml"), WORKSPACE.merge("catalog" => { "is-number" => "^6.0.0" }).to_yaml)
end

run_fixture("rejects an unrecorded override", "ERR_PNPM_LOCKFILE_CONFIG_MISMATCH") do |repo|
  File.write(File.join(repo, "pnpm-workspace.yaml"), WORKSPACE.merge("overrides" => { "is-number" => "6.0.0" }).to_yaml)
end

run_fixture("rejects a candidate hook", "configuration and hooks") do |repo, _lockfile, marker|
  File.write(File.join(repo, ".pnpmfile.cjs"), "require('fs').writeFileSync(#{marker.to_json}, '')")
end

run_fixture("rejects package-local resolver configuration", "configuration and hooks") do |repo|
  File.write(File.join(repo, "apps/web/.npmrc"), "lockfile=false\n")
end

run_fixture("rejects an alternate workspace manifest format", "configuration and hooks") do |repo|
  File.write(File.join(repo, "apps/web/package.yaml"), "name: web\n")
end

run_fixture("rejects a symlinked lockfile", "must be a regular tracked file") do |_repo, lockfile|
  File.rename(lockfile, "#{lockfile}.target")
  File.symlink("#{lockfile}.target", lockfile)
end

run_fixture("rejects an environment lockfile document", "must contain one YAML document") do |_repo, lockfile|
  File.write(lockfile, LOCKFILE.to_yaml * 2)
end

run_fixture("rejects duplicate YAML keys", "invalid or duplicate YAML keys") do |_repo, lockfile|
  File.open(lockfile, "a") { |file| file.puts("snapshots: {}") }
end

run_fixture("rejects a missing registry snapshot", "missing registry snapshot") do |_repo, lockfile|
  File.write(lockfile, LOCKFILE.merge("snapshots" => {}).to_yaml)
end

run_fixture("rejects a non-registry tarball", "only supports registry packages") do |_repo, lockfile|
  packages = { "is-number@7.0.0" => { "resolution" => { "tarball" => "https://example.test/archive.tgz" } } }
  File.write(lockfile, LOCKFILE.merge("packages" => packages).to_yaml)
end
