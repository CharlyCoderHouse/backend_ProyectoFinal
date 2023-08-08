import { Router } from "express";
import { getProducts, postProduct, getProductById, putProductById, deleteProductById } from '../controllers/products.controller.js'
import { authorization, passportCall } from '../utils.js';

const router = Router();

//Ruta /products + query limits
router.route('/')
    .get(getProducts)
    .post(passportCall('jwt'), authorization(['admin', 'premium']), postProduct);

//Ruta /products/:id Busco producto por ID 
router.route('/:pid')
    .get(getProductById)
    .put(passportCall('jwt'), authorization(['admin', 'premium']), putProductById)
    .delete(passportCall('jwt'), authorization(['admin', 'premium']), deleteProductById);

export default router;