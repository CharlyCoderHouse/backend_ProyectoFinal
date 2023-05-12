import { Router } from 'express';
import cartManager from '../dao/manager/cartManager.js';
import productManager from '../dao/manager/productManager.js';

//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase Cart
const CartManager = new cartManager('./src/files/carrito.json');
//Creamos la instancia de la clase Product
const ProductManager = new productManager('./src/files/product.json');

router.route('/')
    .post(async(req, res) => {
        // Inicializo el carrito sin productos
        const cart = {
            products: []
        };

        //llamar al metodo addCart
        const result = await CartManager.addCart(cart);
        //Muestro resultado exitoso
        res.send({ status: 'Success', result });
});

router.route('/:id')
    .get(async(req, res) => {
        //Leo el ID por parametros
        const cartId = Number(req.params.id);
        // OBTENGO el carrito QUE HAY EN EL ARCHIVO
        const cart = await CartManager.getCartById(cartId);

        //Valido el resultado de la búsqueda
        const response = cart !==-1
            ? { status: "Success", data: cart} 
            : { status: "NOT FOUND", data: `El carrito con ID ${cartId} NO existe!` };

        const statusCode = cart !==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response);

});

router.route('/:cid/product/:pid')
    .post(async(req, res) => {
        // Primero Valido que exista el carrito 
        //Leo el ID del carrito por parametros 
        const cartId = Number(req.params.cid);
        // OBTENGO el carrito QUE HAY EN EL ARCHIVO
        const cart = await CartManager.getCartById(cartId);
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
        res.send({ status: 'success', result: 'Se agrego correctamente el producto al carrito' })
});    

export default router;