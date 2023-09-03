import { cartsRepository, ticketsRepository } from '../repositories/index.js';

const postCart = async (cart) => {
    const result = await cartsRepository.addCart(cart);
    return result;
}; 

const getCartById = async (cartId) => {
    const cart = await cartsRepository.getCartById(cartId);
    return cart;
};

const deleteCartById = async (cartId) => {
    const cart = await cartsRepository.deleteCartById(cartId);
    return cart;
};

const putCartById = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteAllProductsInCart = async (id) => {
    const result = await cartsRepository.deleteAllProductsInCart(id);
    return result;
};

const putProductInCart = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteProductInCart = async (cartId,productId) => {
    const result = await cartsRepository.deleteProductInCart(cartId,productId);
    return result;
};

const postPurchase = async (cart, userMail) => {
    
    //suma precio
    const sum = cart.reduce((acc, prev) => {
        acc += prev.price * prev.quantity;
        return acc;
    }, 0);

    const code = Date.now() + Math.floor(Math.random() * 100000 + 1);
    const newCart= []
    cart.forEach( (product) => {
        const prodData = {
            name: product.title,
            prices: product.price,
            quantitys: product.quantity
        }
        newCart.push(prodData)
    })

    const ticket = {
        code: code,
        purchase_datetime: new Date(),
        amount: sum,
        purchaser: userMail,
        productBuy: newCart
    };

    const result = await ticketsRepository.createTicket(ticket);
    
    return result;
};

const getTicketById = async (ticketId) => {
    const result = await ticketsRepository.getTicketsById(ticketId);
    return result;
};

export {
    postCart,
    getCartById,
    deleteCartById,
    putCartById,
    deleteAllProductsInCart, 
    putProductInCart,
    deleteProductInCart,
    postPurchase,
    getTicketById   
}