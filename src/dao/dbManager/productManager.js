import { productModel } from '../models/productModel.js';

export default class productManager {

    constructor() {
        console.log('Working products with DB');
    };
    
    getProducts = async (limit) => {
        //Leo de la base devolviendo los productos
        if (limit){
            const products = await productModel.find().skip(0).limit(limit).lean();
            return products;
        } else {
            const products = await productModel.find().lean();
            return products;
        };
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
};

