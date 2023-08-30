export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCarts = async () => {
        const result = await this.dao.getCarts();
        return result;
    }

    getCartById = async (cartId) => {
        const result = await this.dao.getCartById(cartId);
        return result;
    }

    deleteCartById = async (cartId) => {
        const result = await this.dao.deleteCartById(cartId);
        return result;
    }
    
    addCart = async (cart) => {
        const result = await this.dao.addCart(cart);
        return result;
    }

    addProductInCart = async (cartId,productId,quantity) => {
        const result = await this.dao.addProductInCart(cartId,productId,quantity);
        return result;
    }

    deleteProductInCart = async (cartId,productId) => {
        const result = await this.dao.deleteProductInCart(cartId,productId);
        return result;
    }

    deleteAllProductsInCart = async (cartId) => {
        const result = await this.dao.deleteAllProductsInCart(cartId);
        return result;
    }
}