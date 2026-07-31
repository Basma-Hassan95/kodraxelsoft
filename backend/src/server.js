import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

const server = app.listen(config.port, () => {
  logger.info(`Kodraxelsoft CMS API listening on port ${config.port}`, {
    env: config.env,
    cors: config.corsOrigin,
  });
});

function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason: String(reason) });
});
