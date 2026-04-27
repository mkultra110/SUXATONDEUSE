// Routes /api/auth : register, login, refresh, logout, me.
// register/login sont gates par requireInvite : il faut un cookie d'invite
// valide (donne via /suxa_tondeuse sur Discord) pour pouvoir creer un compte
// ou se connecter. Le refresh n'est pas gate, sinon les sessions existantes
// expireraient des que le lien d'invite expire.

import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireInvite } from '../middleware/invite.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  authRateLimit,
  requireInvite,
  validate(registerSchema),
  ctrl.register,
);
authRouter.post('/login', authRateLimit, requireInvite, validate(loginSchema), ctrl.login);
authRouter.post('/refresh', ctrl.refresh);
authRouter.post('/logout', ctrl.logout);
authRouter.get('/me', requireAuth, ctrl.me);
