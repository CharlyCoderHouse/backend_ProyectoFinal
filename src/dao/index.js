import cartManager from './dbManager/cart.Manager.js';
import productManager from './dbManager/product.Manager.js';
import userManager from './dbManager/user.Manager.js';

//Creamos la instancia de la clase Cart
const CartManager = new cartManager();
//Creamos la instancia de la clase Product
const ProductManager = new productManager();
//Creamos la instancia de la clase User
const UserManager = new userManager();

export const CARTDAO = CartManager;
export const PRODUCTDAO = ProductManager;
export const USERDAO = UserManager;
