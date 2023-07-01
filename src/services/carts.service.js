import { CARTDAO } from "../dao/index.js";

const postCart = async (cart) => {
    const result = await CARTDAO.addCart(cart);
    return result;
}; 

const getCartById = async (id) => {
    const cart = await CARTDAO.getCartById(id);
    return cart;
};

const putCartById = async (cartId, productId, quantity) => {
    const result = await CARTDAO.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteAllProductsInCart = async (id) => {
    const result = await CARTDAO.deleteAllProductsInCart(id);
    return result;
};

const putProductInCart = async (cartId, productId, quantity) => {
    const result = await CARTDAO.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteProductInCart = async (cartId,productId) => {
    const result = await CARTDAO.deleteProductInCart(cartId,productId);
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