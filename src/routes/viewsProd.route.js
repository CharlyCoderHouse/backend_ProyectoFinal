import { Router } from 'express'
//FileSystem
//import productManager from '../dao/manager/productManager.js';
//MongoDB
import productManager from "../dao/dbManager/product.Manager.js"
//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase FILESYSTEM
// const ProductManager = new productManager('./src/files/product.json');

//Creamos la instancia de la clase MONGODB
const ProductManager = new productManager();

router.route('/')
    .get(async (req, res) => { 
        try {
           const products = await ProductManager.getProducts();
           res.render('realTimeProducts', { products });    
        } catch (error) {
            res.status(500).send({ status: "error", error });
        }
});

export default router;