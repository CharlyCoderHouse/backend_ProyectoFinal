import CartsRepository from '../repositories/carts.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';

const cartsRepository = new CartsRepository();
const ticketRepository = new TicketRepository();

const postCart = async (cart) => {
    const result = await cartsRepository.addCart(cart);
    return result;
}; 

const getCartById = async (cartId) => {
    const cart = await cartsRepository.getCartById(cartId);
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
    //console.log("1A Ingreso a service grabar ticket");
    const sum = cart.reduce((acc, prev) => {
        acc += prev.price * prev.quantity;
        return acc;
    }, 0);

    const code = Date.now() + Math.floor(Math.random() * 100000 + 1);

    const ticket = {
        code: code,
        purchase_datetime: new Date(),
        amount: sum,
        purchaser: userMail
    };

    //console.log(ticket);

    const result = await ticketRepository.createTicket(ticket);
    //console.log(result);
    return result;
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