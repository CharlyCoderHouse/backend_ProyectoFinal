import CartsRepository from '../repositories/carts.repository.js';

const cartsRepository = new CartsRepository();

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

export {
    postCart,
    getCartById,
    putCartById,
    deleteAllProductsInCart, 
    putProductInCart,
    deleteProductInCart   
}