import { 
    postCart as postCartService,
    getCartById as getCartByIdService, 
    putCartById as putCartByIdService,
    deleteAllProductsInCart as deleteAllProductsInCartService,  
    putProductInCart as putProductInCartService,
    deleteProductInCart as deleteProductInCartService 
} from '../services/carts.service.js';
import { 
    getProductById as getProductByIdService, 
} from "../services/products.service.js";

const postCart = async(req, res) => {
    // Inicializo el carrito sin productos
    const cart = {
        products: []
    };
    try {
        const result = await postCartService(cart);
        res.send({ status: "success", payload: result})
    } catch (error) {
        res.status(500).send({ status: "error", error });
    };
};

const getCartById = async(req, res) => {
    //Leo el ID por parametros
    let cartId = String(req.params.cid);
    try {
        const cart = await getCartByIdService(cartId);
        const response ={ status: "Success", payload: cart};
        cart[0].isValid= cart[0].products.length > 0
        //muestro resultado postman
        //res.status(200).json(response);
        //REnderizo vista
        res.render("carts.hbs", cart[0] );
    } catch (error) {
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const putCartById = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const { productId, quantity } = req.body;
    // Primero Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        await getCartByIdService(cartId);
    } catch (error) {
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    }
    // Segundo Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base
        await getProductByIdService(productId);
    } catch (error) {
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(404).json(response);
    }
    // Una vez validado llamar al metodo addProductInCart en Service
    try {
        const result = await putCartByIdService(cartId, productId, quantity);
        console.log("router: " + JSON.stringify(result, null, '\t'));
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se agrego correctamente el producto al carrito' })
        };
    } catch (error) {
        res.status(404).send({ status: "NOT FOUND", payload: `No se pudo agregar el Producto al carrito!` });
    };
};

const deleteAllProductsInCart = async(req, res) => {
    const cartId = String(req.params.cid);
    try {
        const cart = await deleteAllProductsInCartService(cartId);
        const response ={ status: "Success", payload: cart};
        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const putProductInCart = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const productId = String(req.params.pid);
    const { quantity } = req.body;
    //console.log("PASE POR CONTROLLER");
    // Primero Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        await getCartByIdService(cartId);
        //console.log("Valide carrito" + cartId);
    } catch (error) {
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        //console.log("Valide carrito" + cartId);
        return res.status(404).json(response);
    };
    // Segundo Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base
        await getProductByIdService(productId);
        //console.log("Valide producto" + productId);
    } catch (error) {
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(404).json(response);
    };
    // Una vez validado llamar al metodo addProductInCart en service
    try {
        //console.log("Intento insertar");
        const result = await putProductInCartService(cartId, productId, quantity);
        //console.log("router: " + JSON.stringify(result, null, '\t'));
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se actualizo correctamente el producto al carrito' })
        };
    } catch (error) {
        res.status(404).send({ status: "NOT FOUND", payload: `No se pudo actualizar el Producto al carrito!` });
    };
};

const deleteProductInCart = async(req, res) => {
    const cartId = String(req.params.cid);
    const productId = String(req.params.pid);
    try { 
        const cart = await deleteProductInCartService(cartId,productId);
        const response ={ status: "Success", payload: cart};
        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

export {
    postCart, 
    getCartById, 
    putCartById, 
    deleteAllProductsInCart,
    putProductInCart,
    deleteProductInCart
}
