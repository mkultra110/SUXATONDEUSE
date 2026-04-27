// Routes /api/auth/invite : issue (bot), redeem (public), status (public).

import { Router } from 'express';
import * as ctrl from '../controllers/invite.controller.js';
import { requireBotKey } from '../middleware/botKey.middleware.js';

export const inviteRouter = Router();

inviteRouter.post('/issue', requireBotKey, ctrl.issue);
inviteRouter.post('/redeem', ctrl.redeem);
inviteRouter.get('/status', ctrl.status);
