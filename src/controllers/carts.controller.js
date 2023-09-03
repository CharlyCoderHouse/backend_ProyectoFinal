import { 
    postCart as postCartService,
    getCartById as getCartByIdService, 
    putCartById as putCartByIdService,
    deleteAllProductsInCart as deleteAllProductsInCartService,  
    putProductInCart as putProductInCartService,
    deleteProductInCart as deleteProductInCartService, 
    postPurchase as postPurchaseService,
    deleteCartById as deleteCartByIdService,
    getTicketById as getTicketByIdService
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
        req.logger.error('Error postCart ' + error.message);
        res.status(500).send({ status: "error", error });
    };
};

const getCartById = async(req, res) => {
    //Leo el ID por parametros
    let cartId = String(req.params.cid);
    const newCart = [];
    try {
        const cart = await getCartByIdService(cartId);
        const response ={ status: "Success", payload: cart};
        // Valido que el carrito tenga productos
        cart[0].isValid= cart[0].products.length > 0
        // Guardo el ID del carrito para el uso en el front
        cart[0].cartId = cartId
        // Calculo cantidad de Artículos y el total de la compra.
        cart[0].products.forEach( (product) => {
            const prodData = {
                price: product.product.price,
                quantity: product.quantity
            }
            newCart.push(prodData)
        });
        // Calculo el total Precio
        const sumPrice = newCart.reduce((acc, prev) => {
            acc += prev.price * prev.quantity;
            return acc;
        }, 0);
        cart[0].totalPrice = sumPrice
        // Calculo la cantida de productos
        const sumCant = newCart.reduce((acc, prev) => {
            acc += prev.quantity;
            return acc;
        }, 0);
        cart[0].cantProd = sumCant
        //muestro resultado postman
        //res.status(200).json(response);
        //REnderizo vista
        res.render("carts.hbs", cart[0] );
    } catch (error) {
        req.logger.error(`getCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const deleteCartById = async(req, res) => {
    //Leo el ID por parametros
    let cartId = String(req.params.cid);
    try {
        const cart = await deleteCartByIdService(cartId);
        const response ={ status: "Success", payload: cart};
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`deleteCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(500).send(response);
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
        req.logger.error(`putCartById = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    }
    // Segundo Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base
        const product = await getProductByIdService(productId);
        
        // Premium no puede cargar sus propios productos
        if (req.user.role==="Premium" & product[0].owner===req.user.email) {
            req.logger.error(`putCartById = El Producto con ID ${productId} NO puede agregarse!`);
            const response = { status: "Error", payload: `El Producto con ID ${productId} NO puede agregarse por ser del mismo usuario!` };
            return res.status(401).json(response);
        }
    } catch (error) {
        req.logger.error(`putCartById = El Producto con ID ${productId} NO existe!`);
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(402).json(response);
    }
    // Una vez validado llamar al metodo addProductInCart en Service
    try {
        const result = await putCartByIdService(cartId, productId, quantity);
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se agrego correctamente el producto al carrito' })
        };
    } catch (error) {
        req.logger.error(`putCartById = No se pudo agregar el Producto al carrito!` + error.message);
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
        req.logger.error(`deleteAllProductsInCart = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const putProductInCart = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const productId = String(req.params.pid);
    const { quantity } = req.body;
    
    // Primero Valido que exista el carrito 
    try {
        // OBTENGO el carrito QUE HAY EN la BASE
        await getCartByIdService(cartId);
    } catch (error) {
        req.logger.error(`putProductInCart = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "Error", payload: `El carrito con ID ${cartId} NO existe!` };
        return res.status(404).json(response);
    };
    // Segundo Valido que exista el producto
    try {
        // OBTENGO el producto QUE HAY EN la Base y comparo el role si corresponde agregar
        const product = await getProductByIdService(productId);
        
        // Premium no puede cargar sus propios productos
        if (req.user.role==="Premium" & product[0].owner===req.user.email) {
            
            req.logger.error(`putProductInCart = El Producto con ID ${productId} NO puede agregarse!`);
            const response = { status: "Error", payload: `El Producto con ID ${productId} NO puede agregarse por ser del mismo usuario!` };
            return res.status(401).json(response);
        }

    } catch (error) {
        req.logger.error(`putProductInCart = El Producto con ID ${productId} NO existe!`);
        const response = { status: "Error", payload: `El Producto con ID ${productId} NO existe!` };
        return res.status(402).json(response);
    };
    // Una vez validado llamar al metodo addProductInCart en service
    try {
        const result = await putProductInCartService(cartId, productId, quantity);
        if(result.acknowledged) {
            res.status(200).send({ status: 'success', payload: 'Se actualizo correctamente el producto al carrito' })
        };
    } catch (error) {
        req.logger.error(`putProductInCart = No se pudo actualizar el Producto al carrito!`);
        res.status(500).send({ status: "NOT FOUND", payload: `No se pudo actualizar el Producto al carrito!` });
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
        req.logger.error(`deleteProductInCart = El carrito con ID ${cartId} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El carrito con ID ${cartId} NO existe!` };
        res.status(404).send(response);
    };
};

const postPurchase = async(req, res) => {
    //Leo el ID del carrito y producto por parametros 
    const cartId = String(req.params.cid);
    const userMail = req.user.email;
    const name = `${req.user.first_name}, ${req.user.last_name}`
    // Primero Valido que exista el carrito 
    try {
        const newCart = [];
        const noStockCart = [];
        // OBTENGO el carrito QUE HAY EN la BASE
        const cartPuchase = await getCartByIdService(cartId);
        cartPuchase[0].products.forEach( (product) => {
            if (product.product.stock > product.quantity) {
                const resultStock = stockProductService(product.product._id, product.quantity*-1)
                const prodData = {
                    title: product.product.title,
                    price: product.product.price,
                    quantity: product.quantity
                }
                newCart.push(prodData)
                const resultDelete = deleteProductInCartService(cartPuchase[0]._id,product.product._id);
            }else {
                const prodData = {
                    id: product._id
                };
                noStockCart.push(prodData);
            }
        });
        
        if (newCart.length > 0){
            const result = await postPurchaseService(newCart, userMail);
            result.userMail = userMail;
            result.name = name;
            result.products = [];
            result.products.push(newCart);
            console.log(result);
            if (noStockCart.length > 0) {
                req.logger.info(`postPurchase = Se genero correctamente la compra con el ID ${result.code}  y no pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}`);
                //res.status(200).send({ status: 'success with error', payload: `Se genero correctamente la compra con el ID ${result.code}  y no pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}`  })
                result.sinStock = true;
                res.status(200).send({status:200, ticketId: `${result._id}`})
            } else {
                req.logger.info(`postPurchase = Se genero correctamente la compra con el ID ${result.code}`);
                result.sinStock = false;
                console.log("estoy OK");
                res.status(200).send({status:200, ticketId: `${result._id}`})
                
            }    
        } else {
            if (noStockCart.length > 0) {
                req.logger.info(`postPurchase = No pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}`);
                res.status(404).send({ status: "NOT FOUND", payload: `No pudieron procesarse por falta de stock ${JSON.stringify(noStockCart, null)}` });
            } else {
                req.logger.info(`postPurchase = No hay productos en el carrito!`);
                res.status(404).send({ status: "NOT FOUND", payload: `No hay productos en el carrito!` });
            }
        } 
    } catch (error) {
        req.logger.error(`postPurchase = ` + error.message);
        const response = { status: "Error", payload: error };
        return res.status(500).json(response);
    };
    
};

const getPurchase = async(req, res) => {
    const ticketId = String(req.params.tid);
    try {
        const ticket = await getTicketByIdService({_id: ticketId}) 
        console.log(ticket);
       res.render("ticketCart.hbs", ticket);  
    //    const response ={ status: "Success", payload: ticket};
    //    //muestro resultado
    //    res.status(200).json(response);     
    }
    catch (error) {
        req.logger.error(`getPurchase = ` + error.message);
        const response = { status: "Error", payload: error };
        return res.status(500).json(response);
    }
        
}

export {
    postCart, 
    getCartById, 
    deleteCartById, 
    putCartById, 
    deleteAllProductsInCart,
    putProductInCart,
    deleteProductInCart,
    postPurchase,
    getPurchase
}
