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

    addProductInCart = async (cartId,productId) => {
        try {
            // Traigo los Carritos
            const carts = await this.getCarts();
            // Busco el indice del ID a actualizar
            const codeIndex = carts.findIndex(carrito => carrito.id === cartId);
            
            //Valido si el item esta en el carrito
            const isInCart = (id) => {
                return (
                    carts[codeIndex].products.some(item => item.product === id)
                )
            }

            if  (isInCart(productId)){
                const productIndex = carts[codeIndex].products.findIndex(prod => prod.product === productId);
                console.log(productIndex);
                carts[codeIndex].products[productIndex].quantity++
                console.log('esta en el carro');
            }else{
                //creo arreglo para el nuevo producto
                const newProduct = {
                    product: productId,
                    quantity: 1
                };
                carts[codeIndex].products.push(newProduct);
                console.log('NO esta en el carro');
            }
            // Agrego y escribo el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return carts;

        } catch (error){
            console.log(error);
        }
    }    
};