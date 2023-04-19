import { Router } from "express";
import productManager from '../manager/productManager.js';

//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase
const ProductManager = new productManager('./primeraEntrega/files/product.json');

//Ruta /products + query limits
router.route('/')
    .get(async (req, res) => {
        // OBTENGO TODOS LOS PRODUCTOS QUE HAY EN EL ARCHIVO
        const products = await ProductManager.getProducts();
        //leo el parametro por req.query
        const { limit } = req.query;

        const nuevoArreglo = [];

        if (limit){
            for (let i=0; i<=limit-1 && i < products.length; i++) {
                    nuevoArreglo.push(products[i]) ;    
            }
            const response = {
                status: "Success",
                data: nuevoArreglo,
            };
    
            res.send(response);
        } else {
            const response = {
                status: "Success",
                data: products,
            };
            res.send(response)
        }
    })

    .post(async(req, res) => {
        //Leo producto por body
        const product = req.body;
        //pongo el status en true por defecto
        if (!product.status){
            product.status = true
        }
        if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
            return res.status(400).send({error:'Hay campos que faltan completar!'});
        }
        //llamar al metodo addProduct    
        const result = await ProductManager.addProduct(product);

        //Valido el resultado de la búsqueda
        const response = result !==-1 
        ? { status: "Success", data: result} 
        : { status: "NOT FOUND", data: `Ya existe el producto que desea crear!` };
        //Valido marco el estado según el resultado
        const statusCode = result!==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response);
});

//Ruta /products/:id Busco producto por ID 
router.route('/:pid')
    .get(async (req,res) => {
        //Leo el ID del parametro 
        const id = Number(req.params.id);
        // BUsco el ID en el arreglo
        const productById = await ProductManager.getProductById(id);
        
        //Valido el resultado de la búsqueda
        const response = productById!==-1 
            ? { status: "OK", data: productById} 
            : { status: "NOT FOUND", data: `El producto con ID ${id} NO existe!` };

        const statusCode = productById!==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response);
    })

    .put(async(req,res) =>{
        // llamar al metodo updateProduct para actualizar sin modificar el id
        const id = Number(req.params.id);
        const product = req.body;
        
        if(!product.title || !product.description || !product.code || !product.price || 
            !product.stock || !product.category || !product.status){
            return res.status(400).send({error:'Hay campos que faltan completar!'});
        }

        if("id" in product){
            return res.status(404).json({ status: "NOT FOUND", data: "Error no se puede modificar el id"});
        }

        //Intento actualizar los datos de productos
        const result = await ProductManager.updateProduct(id,product);

        // Valido el resultado del Update
        const response = result !==-1 
        ? { status: "Success", data: `El producto con ID ${id} fue actualizado con éxito!`} 
        : { status: "NOT FOUND", data: `El producto con ID ${id} NO existe!` };

        const statusCode = result !==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response); 
    })

    .delete(async(req,res)=>{
        const id = Number(req.params.id)
        //llamar al metodo deleteProduct pasandole como parametro id
        const result = await ProductManager.deleteProductById(id);

        const response = result !==-1 
        ? { status: "Success", data: `El producto fue ELIMINADO con éxito!`} 
        : { status: "NOT FOUND", data: `NO existe el producto que desea eliminar!` };
        //Valido marco el estado según el resultado
        const statusCode = result!==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response);

});

export default router;