import { Router } from 'express';
//FileSystem
// import cartManager from '../dao/manager/cartManager.js';
// import productManager from '../dao/manager/productManager.js';
// MongoDB
import productManager from "../dao/dbManager/productManager.js"
import cartManager from "../dao/dbManager/cartManager.js"


//INICIALIZO ROUTER
const router = Router();

//FileSystem
/* //Creamos la instancia de la clase Cart
const CartManager = new cartManager('./src/files/carrito.json');
//Creamos la instancia de la clase Product
const ProductManager = new productManager('./src/files/product.json'); */

//Creamos la instancia de la clase Cart
const CartManager = new cartManager();
//Creamos la instancia de la clase Product
const ProductManager = new productManager();

router.route('/')
    .post(async(req, res) => {
        // Inicializo el carrito sin productos
        const cart = {
            products: []
        };

        // MongoDB
        try {
            const result = await CartManager.addCart(cart);
            res.send({ status: "success", payload: result})
        } catch (error) {
            res.status(500).send({ status: "error", error });
        };

        //FileSystem
/*         //llamar al metodo addCart
        const result = await CartManager.addCart(cart);
        //Muestro resultado exitoso
        res.send({ status: 'Success', result }); */
});

router.route('/:cid')
    .get(async(req, res) => {
        //Leo el ID por parametros
        const cartId = String(req.params.cid);

        //MongoDB
        try {
            const cart = await CartManager.getCartById(cartId);
            const response ={ status: "Success", payload: cart};
            //muestro resultado
            res.status(200).json(response);
        } catch (error) {
            const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
            res.status(404).send(response);
        };

        //FileSystem
/*         // OBTENGO el carrito QUE HAY EN EL ARCHIVO
        const cart = await CartManager.getCartById(cartId);

        //Valido el resultado de la búsqueda
        const response = cart !==-1
            ? { status: "Success", data: cart} 
            : { status: "NOT FOUND", data: `El carrito con ID ${cartId} NO existe!` };

        const statusCode = cart !==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response); */
});

router.route('/:cid/product/:pid')
    .post(async(req, res) => {
        
        //Leo el ID del carrito y producto por parametros 
        const cartId = String(req.params.cid);
        const productId = String(req.params.pid);

        //MongoDB
        // Primero Valido que exista el carrito 
        try {
            // OBTENGO el carrito QUE HAY EN la BASE
            await CartManager.getCartById(cartId);
        } catch (error) {
            const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
            return res.status(404).json(response);
        }
        // Segundo Valido que exista el producto
        try {
            // OBTENGO el producto QUE HAY EN la Base
            await ProductManager.getProductById(productId);
        } catch (error) {
            const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
            return res.status(404).json(response);
        }

        // Una vez validado llamar al metodo addProductInCart
        try {
            const result = await CartManager.addProductInCart(cartId, productId);
            console.log("router: " + result);
            if(result.acknowledged) {
                res.status(200).send({ status: 'success', payload: 'Se agrego correctamente el producto al carrito' })
            };
        } catch (error) {
            res.status(404).send({ status: "NOT FOUND", payload: `No se pudo agregar el Producto al carrito!` });
        };

        // FileSystme OBTENGO el carrito QUE HAY EN EL ARCHIVO
/*         const cart = await CartManager.getCartById(cartId);
        //Valido el resultado de la búsqueda
        if (cart === -1){
            const response = { status: "Error", data: `El carrito con ID ${cartId} NO existe!` };
            //muestro resultado
            return res.status(404).json(response);
        };
        // Segundo Valido que exista el producto
        //Leo el ID de productos por parametros
        const productId = Number(req.params.pid);
        // OBTENGO el carrito QUE HAY EN EL ARCHIVO
        const product = await ProductManager.getProductById(productId);
        if (product === -1){
            const response = { status: "Error", data: `El Producto con ID ${productId} NO existe!` };
            //muestro resultado
            return res.status(404).json(response);
        };

        // Una vez validado llamar al metodo addProductInCart
        await CartManager.addProductInCart(cart.id, product.id);
        //Muestro resultado exitoso
        res.send({ status: 'success', result: 'Se agrego correctamente el producto al carrito' }) */
});    

export default router;