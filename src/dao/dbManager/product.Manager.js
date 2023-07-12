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

    stockProduct = async (id, stock) => {
        const result = await productModel.updateOne({_id: id}, {$inc: {stock: stock}});
        return result;
    }
};

