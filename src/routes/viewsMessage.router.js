import { Router } from 'express';
import { chatRoute } from '../controllers/message.controller.js';

const router = Router();

router.get('/', chatRoute);

export default router;