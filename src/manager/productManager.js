import fs from 'fs';

export default class productManager {

    constructor(path) {
        this.path = path;
        this.products = [];
    };
    
    getProducts = async () => {
        try {
            //Verifico que exista el archivo para leerlo
            if (fs.existsSync(this.path)) {
                //Leo el archivo devolviendo los productos
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const product = JSON.parse(data);
                return product;
            }else {
                // Devuelvo los productos vacio
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    };

    getProductById = async (id) => {
        try {
            // Traigo los productos
            const products = await this.getProducts();
            // Busco el indice del ID a consultar
            const codeIndex = products.findIndex(producto => producto.id === id);

            // Valido que exista y retorno el resultado
            if (codeIndex===-1) {
                return codeIndex         
            } else {
                return products[codeIndex]
            }
        }catch (error){
            console.log(error);
        }
    };

    addProduct = async (product) => {
        try {
            // Traigo los productos
            const products = await this.getProducts();
            // Busco el indice del producto por su CODE a consultar
            const codeIndex = products.findIndex(producto => producto.code === product.code);
            // VALIDO NO EXISTA EL PRODUCTO POR EL CAMPO DE VALIDACION CODE
            if (codeIndex!=-1) {
                return -1;        
            }

            // ASIGNO ID
            if (products.length === 0) {
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }

            // Agrego y escribo el archivo
            products.push(product);   
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return product;

        } catch (error){
            console.log(error);
        }
    };

    updateProduct = async (id, data) => {
        try {
            // Traigo los productos
            const products = await this.getProducts();
            
            // Busco el indice del ID a actualizar
            const codeIndex = products.findIndex(producto => producto.id === id);
            
            // Valido que exista     
            if (codeIndex === -1) {
                return codeIndex  
            };
            
            // Reemplazo los datos de las propiedades del objeto que recibo en el indice antes buscado
            for (const propiedad in data){
                products[codeIndex][propiedad] = data[propiedad];
            };
            
            //Escribo el archivo con los datos modificados
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return products;

        }catch (error){
            console.log(error);
        }
    };

    deleteProductById = async (id) => {
        try {
            // Traigo los productos
            const products = await this.getProducts();
            // Busco el indice del ID a actualizar
            const codeIndex = products.findIndex(producto => producto.id === id);
            
            // Valido que exista 
            if (codeIndex===-1) {
                return codeIndex;
            } 
            
            //Elimino el producto del indice antes buscado
            products.splice(codeIndex,1);

            //Escribo el archivo con los datos modificados
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return products;

        }catch (error){
            console.log(error);
        }
    };
};

