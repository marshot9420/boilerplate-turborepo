export function databaseName(key: "DATABASE_URL" | "DIRECT_URL"): string {
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
      name.length > 0
    ) {
      return name;
    }
  } catch {
    // URL parsing errors can expose credentials through their input field.
  }

  throw new Error(`${key} must be a valid PostgreSQL connection URL with a database name.`);
}
