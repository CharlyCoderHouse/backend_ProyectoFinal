import productManager from './dbManager/product.Manager.js'

const ProductManager = new productManager();

export const PRODUCTDAO = ProductManager;
