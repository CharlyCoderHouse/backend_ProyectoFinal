import { Router } from "express";
//FileSystem
// import productManager from '../dao/manager/productManager.js';
//MongoDB
import productManager from "../dao/dbManager/productManager.js"
//INICIALIZO ROUTER
const router = Router();

//Creamos la instancia de la clase FileSystem
/* const ProductManager = new productManager('./src/files/product.json'); */

//Creamos la instancia de la clase MongoDB
const ProductManager = new productManager();

//Ruta /products + query limits
router.route('/')
    .get(async (req, res) => {
        //MongoDb
        //leo el parametro por req.query
        let { limit, page, query, sort } = req.query;
        try {
            if (!limit) limit=10;
            if (!page) page=1;
            if (query) query= {category: query};
            console.log(query);
            const products = await ProductManager.getProducts(limit, page, query, sort)
            products.prevLink = products.hasPrevPage?`http://localhost:8080/api/products?page=${products.prevPage}`:'';
            products.nextLink = products.hasNextPage?`http://localhost:8080/api/products?page=${products.nextPage}`:'';
            products.isValid= !(page<=0||page>products.totalPages)
            //Postman
            // res.send({ status: "success", payload: products}); 
            //Render page
            res.render("products.hbs", products );
        } catch (error) {
            res.status(500).send({ status: "error", error });
        }
        // FileSystem
/*         // OBTENGO TODOS LOS PRODUCTOS QUE HAY EN EL ARCHIVO
        const products = await ProductManager.getProducts();
        //leo el parametro por req.query
        const { limit } = req.query;
        // Nuevo arreglo para el limit
        const nuevoArreglo = [];

        if (limit){
            for (let i=0; i<=limit-1 && i < products.length; i++) {
                    nuevoArreglo.push(products[i]) ;    
            };
            const response = {
                status: "Success",
                data: nuevoArreglo,
            };
    
            //res.send(response);
            res.render("products.hbs", { nuevoArreglo });
        } else {
            const response = {
                status: "Success",
                data: products,
            };

            //res.send(response);
            res.render("products.hbs", { products });
        }; */

    })

    .post(async(req, res) => {
        //Leo producto por body
        const product = req.body;
        //pongo el status en true por defecto
        if (!product.status){
            product.status = true
        }
        //Valido que los campos estén completos
        if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
            return res.status(400).send({error:'Hay campos que faltan completar!'});
        };
        //MongoDB
        try {
            const result = await ProductManager.addProduct(product);
    
             //Valido el resultado de la creacion del producto
            if (result.acknowledged) {
                const io = req.app.get('socketio');
                io.emit("showProducts", await ProductManager.getProducts());
            };
              
            const response = { status: "Success", payload: result};
    
            //muestro resultado
            //Postman
            //res.status(200).json(response);
            //redirijo a la misma página de carga y no muestro el resultado ya que se actualiza la lista
            res.redirect("/realTimeProducts");
        } catch (error) {
            const response = { status: "NOT FOUND", payload: `Ya existe el producto que desea crear!` };
            //Postman
            res.status(404).json(response);
        }

        //FileSystem
 /*        //llamar al metodo addProduct    
        const result = await ProductManager.addProduct(product);

        //Valido el resultado de la búsqueda
        if (result !==-1 ) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await ProductManager.getProducts());
        };

        //Valido el resultado de la búsqueda
        const response = result !==-1 
        ? { status: "Success", data: result} 
        : { status: "NOT FOUND", data: `Ya existe el producto que desea crear!` };
        //Valido marco el estado según el resultado
        const statusCode = result!==-1 ? 200 : 404; 

        //muestro resultado 
        //res.status(statusCode).json(response);
        //redirijo a la misma página de carga y no muestro el resultado ya que se actualiza la lista
        res.redirect("/realTimeProducts"); */
});

//Ruta /products/:id Busco producto por ID 
router.route('/:pid')
    .get(async (req,res) => {
        // MOngoDB
        //Leo el ID del parametro 
        const id = String(req.params.pid);
        
        // BUsco el ID 
        try {
            const productById = await ProductManager.getProductById(id);
            const response = { status: "OK", payload: productById} 
            //muestro resultado
            //Postman
            // res.status(200).json(response);
            //Render page
            res.render("products.hbs", { productById });
        } catch (error) {
            const response = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
            //Postman
            res.status(404).json(response);
        };
        
        //FileSystem
   /*      //Leo el ID del parametro 
        const id = Number(req.params.pid);
        // BUsco el ID en el arreglo
        const productById = await ProductManager.getProductById(id);
        
        //Valido el resultado de la búsqueda
        const response = productById!==-1 
            ? { status: "OK", data: productById} 
            : { status: "NOT FOUND", data: `El producto con ID ${id} NO existe!` };

        const statusCode = productById!==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response); */
    })

    .put(async(req,res) =>{
        // llamar al metodo updateProduct para actualizar sin modificar el id
        //Leo el ID por parametros
        const id = String(req.params.pid);
        //Leo del body los campos a actualizar
        const product = req.body;
        
        //Valido que el campo ID no venga para actualizar
        if("id" in product){
            return res.status(404).json({ status: "NOT FOUND", data: "Error no se puede modificar el id"});
        };

        //MongoDB
        try {
            const result = await ProductManager.updateProduct(id, product);
            //Valido que se realizo el UPDATE
            if (result.acknowledged & result.modifiedCount!==0) {
                const response = { status: "Success", payload: `El producto con ID ${id} fue actualizado con éxito!`};       
                //muestro resultado
                res.status(200).json(response);
            } else {
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
            };
            
        } catch (error) {
            const reserror = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
            res.status(404).send(reserror);
        };
        //FileSystem
 /*        //Intento actualizar los datos de productos
        const result = await ProductManager.updateProduct(id,product);

        // Valido el resultado del Update
        const response = result !==-1 
        ? { status: "Success", data: `El producto con ID ${id} fue actualizado con éxito!`} 
        : { status: "NOT FOUND", data: `El producto con ID ${id} NO existe!` };

        const statusCode = result !==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response);  */
    })

    .delete(async(req,res)=>{
        //Leo el ID por parametros
        const id = String(req.params.pid);
        //MongoDB
        try {
            const result = await ProductManager.deleteProductById(id);
    
            //Valido el resultado de la búsqueda
            if (result.acknowledged & result.deletedCount!==0) {
                const io = req.app.get('socketio');
                io.emit("showProducts", await ProductManager.getProducts());
                const response = { status: "Success", payload: `El producto con ID ${id} fue eliminado!`}; 
                //muestro resultado
                res.status(200).json(response);
            }else{
                const response = { status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!`}; 
                //muestro resultado
                res.status(200).json(response);
            };
    
        } catch (error) {
            res.status(404).json({ status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!` });
        };
        //FileSystem
        /* 
        //llamar al metodo deleteProduct pasandole como parametro id
        const result = await ProductManager.deleteProductById(id);
        
        //Valido el resultado de la búsqueda
        if (result !==-1 ) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await ProductManager.getProducts());
        };

        // Valido el resultado del Delete
        const response = result !==-1 
        ? { status: "Success", data: `El producto fue ELIMINADO con éxito!`} 
        : { status: "NOT FOUND", data: `NO existe el producto que desea eliminar!` };
        //Valido marco el estado según el resultado
        const statusCode = result!==-1 ? 200 : 404;

        //muestro resultado
        res.status(statusCode).json(response); */
});

export default router;