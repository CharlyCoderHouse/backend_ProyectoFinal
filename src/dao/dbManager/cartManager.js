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

        const cart = await cartModel.find({_id: id}).lean();
        console.log(cart);
        return cart;    
    };

    addProductInCart = async (cartId,productId) => {
        //Intento incrementar la cantidad si se encuentra el producto en el carrito
        const result = await cartModel.updateOne({_id: cartId, "products.product": productId},{$inc: {"products.$.quantity": 1}});
        // console.log("result:" + result.modifiedCount);
        //Pregunto si pudo modificar, sino pudo es que no existe y lo agrego
        if (result.acknowledged & result.modifiedCount === 0){
            //creo arreglo para el nuevo producto con sus datos
            const newProduct = {
                product: productId,
                quantity: 1
                };
            const result = await cartModel.updateOne({_id: cartId}, {$push: { products: newProduct}});
            return result
        };
        return result
    }    
};