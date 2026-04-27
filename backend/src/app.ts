// Construction de l'application Express.
// Separation server.ts (bootstrap) / app.ts (instance) pour faciliter les tests.

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { globalRateLimit } from './middleware/rateLimit.middleware.js';
import { requestId } from './middleware/requestId.middleware.js';
import { authRouter } from './routes/auth.routes.js';
import { healthRouter } from './routes/health.routes.js';
import { leaderboardRouter } from './routes/leaderboard.routes.js';
import { saveRouter } from './routes/save.routes.js';
import { installBigIntJsonPatch } from './utils/bigint.js';

installBigIntJsonPatch();

export function createApp(): Express {
  const app = express();

  // Securite
  app.set('trust proxy', 1); // confiance dans Traefik/nginx en prod
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  );

  // Parsing
  app.use(express.json({ limit: '256kb' }));
  app.use(cookieParser());
  app.use(compression());

  // Observabilite
  app.use(requestId);

  // Rate limit global
  app.use(globalRateLimit);

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/save', saveRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/api', healthRouter);

  // 404 + error handler (toujours en dernier)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
