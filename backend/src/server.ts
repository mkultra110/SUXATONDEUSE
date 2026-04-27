// Bootstrap : demarre le serveur HTTP et gere l'arret propre.

import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Backend ROBOMOW TYCOON ecoute sur http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  logger.info(`Signal ${signal} recu, arret en cours...`);
  server.close(() => {
    logger.info('Serveur HTTP ferme.');
  });
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'unhandledRejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaughtException');
  process.exit(1);
});
