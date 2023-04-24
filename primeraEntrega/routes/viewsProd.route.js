import { Router } from 'express'
import productManager from '../manager/productManager.js';

//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase
const ProductManager = new productManager('./primeraEntrega/files/product.json');

router.get('/', async (req, res) => { 
    res.render('realTimeProducts', { products: ProductManager.getProducts() });
});

export default router;