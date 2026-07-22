import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";
import { seedRbacDefaults, seedSiteDefaults } from "./lib/seed";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

seedRbacDefaults().catch((err) => {
  logger.error({ err }, "Failed to seed RBAC defaults");
});

seedSiteDefaults().catch((err) => {
  logger.error({ err }, "Failed to seed site defaults");
});

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
