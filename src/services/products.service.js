import ProductsRepository from '../repositories/products.repository.js';

const productsRepository = new ProductsRepository();

const getProducts = async (limit, page, query1, sort1) => {
        const products = await productsRepository.getProducts(limit, page, query1, sort1);
        return products;
};

const postProduct = async (product) => {
    const result = await productsRepository.addProduct(product);
    return result;
};

const getProductById = async (id) => {
    const product = await productsRepository.getProductById(id);
    return product;
};

const putProductById = async (id, product) => {
    const result = await productsRepository.updateProduct(id, product);
    return result;
};

const deleteProductById = async (id) => {
    const result = await productsRepository.deleteProductById(id);
    return result;
};

const stockProduct = async (id, stock) => {
    const result = await productsRepository.stockProduct(id, stock);
    return result;
}

export {
    getProducts,
    postProduct,
    getProductById,
    putProductById,
    deleteProductById,
    stockProduct
}