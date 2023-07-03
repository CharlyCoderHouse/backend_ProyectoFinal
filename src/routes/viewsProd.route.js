import { Router } from 'express';
import { realTimeProducts } from '../controllers/products.controller.js';

//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .get(realTimeProducts);

export default router;