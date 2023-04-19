import fs from 'fs';

export default class cartManager {

    constructor(path) {
        this.path = path;
        this.carts = [];
    }

    getCarts = async () => {
        try {
            //Verifico que exista el archivo para leerlo
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const cart = JSON.parse(data);
                return cart;
            }else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

     addCart = async (cart) => {
        try {
            // Traigo los productos
            const carts = await this.getCarts();
            
            // ASIGNO ID
            if (carts.length === 0) {
                cart.id = 1;
            } else {
                cart.id = carts[carts.length - 1].id + 1;
            }

            // Agrego y escribo el archivo
            carts.push(cart);   
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return cart;

        } catch (error){
            console.log(error);
        }
    }    

    getCartById = async (id) => {
        try {
            // Traigo los productos
            const carts = await this.getCarts();
           
            // Busco el indice del ID a consultar
            const cartIndex = carts.findIndex(cart => cart.id === id);

            // Valido que exista y retorno el resultado
            if (cartIndex===-1) {
                return cartIndex         
            } else {
                return carts[cartIndex]
            }
        }catch (error){
            console.log("ERROR:",error);
        }
    }

    addProductInCart = async (cart,product) => {
        try {
            // Traigo los productos
            const carts = await this.getCarts();
            // Busco el indice del ID a actualizar
            const codeIndex = carts.findIndex(producto => producto.id === cart.id);

            //for (i,product.id )
            carts.splice(codeIndex, 1, product);
            // Agrego y escribo el archivo
            //carts.push(cart);   
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return cart;

        } catch (error){
            console.log(error);
        }
    }    
};