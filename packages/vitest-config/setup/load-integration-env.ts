import "./load-test-env";

function testDatabaseName(key: "DATABASE_URL" | "DIRECT_URL"): string {
  try {
    const url = new URL(process.env[key] ?? "");
    const pathName = url.pathname.slice(1);
    const name = decodeURIComponent(pathName);
    if (
      ["postgres:", "postgresql:"].includes(url.protocol) &&
      url.hostname &&
      name === decodeURI(pathName) &&
      !name.includes("/") &&
      !name.includes("\0") &&
      name.endsWith("_test")
    ) {
      return name;
    }
  } catch {
    // Avoid including the connection string in validation errors.
  }

  throw new Error(`${key} must point to a PostgreSQL database ending in _test.`);
}

if (testDatabaseName("DATABASE_URL") !== testDatabaseName("DIRECT_URL")) {
  throw new Error("DATABASE_URL and DIRECT_URL must name the same integration test database.");
}
