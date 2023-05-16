import { cartModel } from "../models/cartModel.js"

export default class cartManager {

    constructor(path) {
        console.log('Working carts with DB');
    };

    getCarts = async () => {
        const carts = await cartModel.find().lean();
        return carts;
    };

    addCart = async (cart) => {
        const result = await cartModel.create(cart);
        return result;
    };    

    getCartById = async (id) => {
        const cart = await cartModel.find({_id:id}).lean();
        return cart;    
    };

    addProductInCart = async (cartId,productId) => {
/* 
        //Valido si el item esta en el carrito
        const isInCart = async (cartId, productId) => {
            return (
                await cartModel.find({$and:[{_id: {cartId}},{procuct: {productId}}] })
            )
        };

        if (isInCart(cartId, productId)) { */
            const result = await cartModel.updateOne({$and:[{_id: {cartId}},{procuct: {productId}}] },{$set: {quantity: quantity++} },{$upsert: {_id: cartId}, productId});
            return result;
        /* }else{
            const result = await cartModel.updateOne({_id: cartId}, productId);
            return result;
        }
 */      
    }    
};