// Singleton PrismaClient pour eviter d'instancier plusieurs connexions
// pool a chaque hot-reload en dev (cf. doc Prisma "Best practice").

import { PrismaClient } from '@prisma/client';
import { env, isProd } from './env.js';

declare global {
   
  var __prisma__: PrismaClient | undefined;
}

export const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log: env.LOG_LEVEL === 'debug' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (!isProd) {
  global.__prisma__ = prisma;
}
