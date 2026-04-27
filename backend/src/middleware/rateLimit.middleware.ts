// Rate limiters pre-configures pour les zones sensibles.
// Cf. GDD section 8.5 : auth 10/15min, save 30/min, global 300/min, claims 20/min.

import rateLimit from 'express-rate-limit';

const standardOptions = {
  standardHeaders: 'draft-7' as const,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Trop de requetes, reessaie dans un moment.' },
  },
};

export const authRateLimit = rateLimit({
  ...standardOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
});

export const saveRateLimit = rateLimit({
  ...standardOptions,
  windowMs: 60 * 1000,
  limit: 30,
});

export const globalRateLimit = rateLimit({
  ...standardOptions,
  windowMs: 60 * 1000,
  limit: 300,
});

export const claimRateLimit = rateLimit({
  ...standardOptions,
  windowMs: 60 * 1000,
  limit: 20,
});
