import { productModel } from '../models/product.Model.js';

export default class productManager {

    constructor() {
        console.log('Working products with DB');
    };
    
    getProducts = async (limit, page, query, sort) => {
        //armo una variable con los parámetros del paginate
        let querys = {}
        if (query) { querys = query };
        let options = {
            limit: limit,
            page: page,
            sort: sort,
            lean: true
        };
        //Si no hay limite no hago el paginate
        if (!limit) options = { pagination: false };
        //Leo de la base devolviendo los productos
        //console.log(querys,options);
        const products = await productModel.paginate(querys, options)
        //console.log("1" + JSON.stringify(products, null, '\t'));
        return products; 
    };

    getProductById = async (id) => {
        //Leo de la base devolviendo los productos
        const product = await productModel.find({_id: id}).lean();
        return product         
    };

    addProduct = async (product) => {
        const result = await productModel.create(product);
        return result;
    };

    updateProduct = async (id, product) => {
        const result = await productModel.updateOne({_id: id}, {$set: product});
        return result;
    };

    deleteProductById = async (id) => {
        const result = await productModel.deleteOne({_id: id});
        return result;
    };

    stockProduct = async (id) => {
         //Intento incrementar la cantidad si se encuentra el producto en el carrito
         const result = await cartModel.updateOne({_id: cartId, "products.product": productId },
         {$inc: {"products.$.quantity": quantity}});
         //console.log("result:" + JSON.stringify(result, null, '\t'));
         //Pregunto si pudo modificar, sino pudo es que no existe y lo agrego
         if (result.acknowledged & result.modifiedCount === 0){
             //creo arreglo para el nuevo producto con sus datos
             const newProduct = {
                 product: productId,
                 quantity: quantity
                 };
             const result = await cartModel.updateOne({_id: cartId}, {$push: { products: newProduct}});
             return result;
         };
         return result;
    }
};

