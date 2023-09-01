import { Router } from 'express';
import { chatRoute } from '../controllers/message.controller.js';
import { authorization, passportCall } from '../utils/utils.js';

const router = Router();

router.get('/', passportCall('jwt'), authorization(['User']), chatRoute);

export default router;