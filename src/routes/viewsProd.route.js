import { Router } from 'express'
import productManager from '../manager/productManager.js';

//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase
const ProductManager = new productManager('./src/files/product.json');

router.route('/')
    .get(async (req, res) => { 
        const products = await ProductManager.getProducts();
        res.render('realTimeProducts', { products });
});

export default router;