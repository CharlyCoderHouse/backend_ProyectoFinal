import cartManager from "./dbManager/cart.Manager.js";
import productManager from './dbManager/product.Manager.js';

//Creamos la instancia de la clase Cart
const CartManager = new cartManager();
//Creamos la instancia de la clase Product
const ProductManager = new productManager();

export const CARTDAO = CartManager;
export const PRODUCTDAO = ProductManager;
