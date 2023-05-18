import { productModel } from '../models/productModel.js';

export default class productManager {

    constructor() {
        console.log('Working products with DB');
    };
    
    getProducts = async (limit, page, query, sort) => {
        //Leo de la base devolviendo los productos
        const products = await productModel.paginate({}, {limit: limit, page: page, lean:true})
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
};

