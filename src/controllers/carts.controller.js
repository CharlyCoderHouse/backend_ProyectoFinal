import { 
    postCart as postCartService,
    getCartById as getCartByIdService, 
    putCartById as putCartByIdService,
    deleteAllProductsInCart as deleteAllProductsInCartService,  
    putProductInCart as putProductInCartService,
    deleteProductInCart as deleteProductInCartService, 
    postPurchase as postPurchaseService
} from '../services/carts.service.js';
import { 
    getProductById as getProductByIdService, 
    stockProduct as stockProductService
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

const postPurchase = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    console.log("1 INGRESO AL PROCESO DE COMPRA");
    const cartId = String(req.params.cid);
    //const userMail = req.user.email;
    const userMail = "cdiblasi@bykom.com";
    console.log("2 Leo parametros "  + cartId + " " + userMail);
    const newCart = [];
    // Primero Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        console.log("3 VALIDO CARRITO");
        const cartPuchase = await getCartByIdService(cartId);
        //console.log("3B " + JSON.stringify(data, null, '\t'));
        //cartPuchase.push(data)
        console.log("3C" + JSON.stringify(cartPuchase, null, '\t'));
        console.log("4 Empiezo a recorrer carrito");
        cartPuchase.products.forEach((product) => {
            console.log(product.stock);
            console.log(quantity);
            console.log("5 producto" + product.product);
            // if (product.stock > product.quantity) {
            //     const resultStock = await stockProductService(prodResult._id, product.quantity*-1)
            //     console.log("7 resultado de baja de stock" + resultStock);
            //     const prodData = {
            //         price: prodResult.price,
            //         quantity: product.quantity
            //     }
            //     newCart.push(prodData)
            //     console.log("8 nuevo carrito" + newCart);
            //     const resultDelete = await deleteProductInCartService(cartPuchase._id,prodResult._id);
            //     console.log("9 resultado de delete de cart" + resultDelete);
            // }
        });
    } catch (error) {
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    };
    //Recorro el carrito y verifico que el Stock sea correcto y genero el ticket
    try {
        if (newCart.length > 0){
            console.log("10 llamo a grabar ticket");
            const result = await postPurchaseService(newCart, userMail);
            //console.log("router: " + JSON.stringify(result, null, '\t'));
            if(result.acknowledged) {
                res.status(200).send({ status: 'success', payload: 'Se genero correctamente la compra' })
            };   
        } else {
            res.status(404).send({ status: "NOT FOUND", payload: `No hay productos disponible para la compra!` });
        }
    } catch (error) {
        const response = { status: "Error", payload: error };
        return res.status(404).json(response);
    }
};


export {
    postCart, 
    getCartById, 
    putCartById, 
    deleteAllProductsInCart,
    putProductInCart,
    deleteProductInCart,
    postPurchase
}
