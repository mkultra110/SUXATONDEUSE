// Routes /api/save : load, persist, beacon.

import { Router } from 'express';
import * as ctrl from '../controllers/save.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { saveRateLimit } from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { saveRequestSchema } from '../schemas/save.schemas.js';

export const saveRouter = Router();

saveRouter.get('/', requireAuth, ctrl.getSave);
saveRouter.post('/', requireAuth, saveRateLimit, validate(saveRequestSchema), ctrl.postSave);
saveRouter.post('/beacon', requireAuth, ctrl.postSaveBeacon);
