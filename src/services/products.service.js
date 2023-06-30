import { PRODUCTDAO } from "../dao/index.js";

const getProducts = async (limit, page, query1, sort1) => {
        const products = await PRODUCTDAO.getProducts(limit, page, query1, sort1);
        return products;
};

const postProduct = async (product) => {
    const result = await PRODUCTDAO.addProduct(product);
    return result;
};

const getProductById = async (id) => {
    const product = await PRODUCTDAO.getProductById(id);
    return product;
};

const putProductById = async (id, product) => {
    const result = await PRODUCTDAO.updateProduct(id, product);
    return result;
};

const deleteProductById = async (id) => {
    const result = await PRODUCTDAO.deleteProductById(id);
    return result;
};

export {
    getProducts,
    postProduct,
    getProductById,
    putProductById,
    deleteProductById
}