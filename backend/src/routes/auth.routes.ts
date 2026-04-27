// Routes /api/auth : register, login, refresh, logout, me.

import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimit, validate(registerSchema), ctrl.register);
authRouter.post('/login', authRateLimit, validate(loginSchema), ctrl.login);
authRouter.post('/refresh', ctrl.refresh);
authRouter.post('/logout', ctrl.logout);
authRouter.get('/me', requireAuth, ctrl.me);
