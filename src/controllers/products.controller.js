import { 
    getProducts as getProductsService, 
    postProduct as postProductService,
    getProductById as getProductByIdService, 
    putProductById as putProductByIdService,
    deleteProductById as deleteProductByIdService  
} from '../services/products.service.js';
import { sendEmail } from "../services/mail.js";
import { deleteNotification } from '../utils/custom-html-delete.js';
import { getUser as getUserService} from '../services/user.service.js';
import config from "../config/config.js";

const getProducts = async (req, res) => {
    //leo el parametro por req.query
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    let query = req.query.query; 
    let sort  = req.query.sort;
    try {
        let sort1= "";
        let sort2= "";
        let query1= "";
        let query2= "";
        if (query) {
            query2= query; 
            query1= {category: query};
        }
        if (sort) {
            sort2=sort;
            sort1= {price: sort};
        }
        const products = await getProductsService(limit, page, query1, sort1);
        products.prevLink = products.hasPrevPage?`http://${config.url_base}/api/products?page=${products.prevPage}&query=${query2}&sort=${sort2}`:'';
        products.nextLink = products.hasNextPage?`http://${config.url_base}/api/products?page=${products.nextPage}&query=${query2}&sort=${sort2}`:'';
        products.isValid= !(page<=0||page>products.totalPages)
        //Postman
        // res.send({ status: "success", payload: products}); 
        //Render page
        res.render("products.hbs", products );
    } catch (error) {
        req.logger.error(`getProducts = ` + error.message);
        return res.status(500).send({ status: "error", error });
    }
};

const postProduct = async (req, res) => {
    //Leo producto por body
    const product = req.body;
    //pongo el status en true por defecto
    if (!product.status){
        product.status = true
    }
    //Valido que los campos estén completos
    if(!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category){
        req.logger.warning(`postProduct = Hay campos que faltan completar!`);
        return res.status(400).send({error:'Hay campos que faltan completar!'});
    };
    if (!product.owner){
        product.owner=req.user.email;
    };
    //MongoDB
    try {
        const result = await postProductService(product);
        
         //Valido el resultado de la creacion del producto
        if (result.acknowledged) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await getProductsService());
        };
          
        const response = { status: "Success", payload: result};

        //muestro resultado
        res.status(200).json(response);
    } catch (error) {
        req.logger.error(`postProduct = Ya existe el producto que desea crear!`);
        const response = { status: "NOT FOUND", payload: `Ya existe el producto que desea crear!` };
        //Postman
        return res.status(501).json(response);
    }
};

const getProductById = async (req,res) => {
    // MOngoDB
    //Leo el ID del parametro 
    const id = String(req.params.pid);
    // BUsco el ID 
    try {
        const productById = await getProductByIdService(id);
        const response = { status: "OK", payload: productById} 
        //muestro resultado
        //Postman
        res.status(200).json(response);
        //Render page
        // res.render("products.hbs", { productById } );
    } catch (error) {
        req.logger.error(`getProductById = El producto con ID ${id} NO existe!`);
        const response = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
        //Postman
        return res.status(404).json(response);
    };
};

const putProductById = async(req,res) =>{
    // llamar al metodo updateProduct para actualizar sin modificar el id
    //Leo el ID por parametros
    const id = String(req.params.pid);
    //Leo del body los campos a actualizar
    const product = req.body;
    //Valido que el campo ID no venga para actualizar
    if("id" in product){
        req.logger.warning(`putProductById = Error no se puede modificar el id`);
        return res.status(401).json({ status: "NOT FOUND", data: "Error no se puede modificar el id"});
    };

    //MongoDB
    try {
        const result = await putProductByIdService(id, product);
        //Valido que se realizo el UPDATE
        if (result.acknowledged & result.modifiedCount!==0) {
            const response = { status: "Success", payload: `El producto con ID ${id} fue actualizado con éxito!`};       
            //muestro resultado
            res.status(200).json(response);
        } else {
            req.logger.error(`putProductById = Error no se pudo actualizar el producto, verifique los datos ingresados`);
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
        };
        
    } catch (error) {
        req.logger.error(`putProductById = El producto con ID ${id} NO existe!`);
        const reserror = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
        return res.status(500).send(reserror);
    };
};

const deleteProductById = async(req,res)=>{
    //Leo el ID por parametros
    const id = String(req.params.pid);
    const email=req.user.email;
    const role=req.user.role;
    //MongoDB
    try {
        
        const productById = await getProductByIdService(id)

        if (role==="Premium" & productById[0].owner!==email){
           
            req.logger.error(`Error deleteProductById: NO tiene permiso para eliminar este producto!`);
            const response = { status: "NOT PERMISION", payload: `NO tiene permiso para eliminar este producto!`}; 
            return res.status(403).json(response);
        };
        
        const result = await deleteProductByIdService(id);

        // si el producto es de user premium debo notificarle por email que se elimino el producto
        if (productById[0].owner){

            const user = await getUserService({ email: productById[0].owner });

            if (user.role==="Premium"){
                // Envío mail de aviso
                const type = "Producto"
                const detail = `producto codigo: ${productById[0].title}`
                const reason = "El articulo fue eliminado por el Administrador, ya que fue discontinuado."
                const mail = { 
                    to: productById[0].owner,
                    subject: 'Eliminación de Producto',
                    html: deleteNotification(type, detail, reason)
                }
                await sendEmail(mail);
            };
        };

        //Valido el resultado de la búsqueda
        if (result.acknowledged & result.deletedCount!==0) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await getProductsService());
            const response = { status: "Success", payload: `El producto con ID ${id} fue eliminado!`}; 
            //muestro resultado
            res.status(200).json(response);
        }else{
            req.logger.error(`deleteProductById = NO existe el producto que desea eliminar!`);
            const response = { status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!`}; 
            //muestro resultado
            res.status(404).json(response);
        };
    } catch (error) {
        req.logger.error(`deleteProductById = NO existe el producto que desea eliminar!`);
        return res.status(500).json({ status: "NOT FOUND", payload: `NO existe el producto que desea eliminar!` });
    };
};

const realTimeProducts = async (req, res) => { 
    try {
       const products = await getProductsService();
       res.render('realTimeProducts', { products });    
    } catch (error) {
        req.logger.error(`realTimeProducts = ` + error.message);
        return res.status(500).send({ status: "error", error });
    }
};

export {
    getProducts,
    postProduct,
    getProductById,
    putProductById,
    deleteProductById,
    realTimeProducts
}
