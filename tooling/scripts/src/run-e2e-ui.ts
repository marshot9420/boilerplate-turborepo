import { spawnSync } from "node:child_process";

const [app, ...playwrightArgs] = process.argv.slice(2);

if (app === "--help") {
  console.info("Usage: pnpm test:e2e:ui <web|admin> [Playwright options]");
  process.exit(0);
}

if (app !== "web" && app !== "admin") {
  console.error("Choose one app: pnpm test:e2e:ui <web|admin> [Playwright options]");
  process.exit(1);
}

for (const args of [
  ["db:e2e:push"],
  ["db:e2e:seed"],
  ["--filter", app, "test:e2e:ui", ...playwrightArgs],
]) {
  const result = spawnSync("pnpm", args, { stdio: "inherit" });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    break;
  }
}
