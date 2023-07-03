import { 
    getProducts as getProductsService, 
    postProduct as postProductService,
    getProductById as getProductByIdService, 
    putProductById as putProductByIdService,
    deleteProductById as deleteProductByIdService  
} from '../services/products.service.js'

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
        //console.log(query);
        const products = await getProductsService(limit, page, query1, sort1);
        products.prevLink = products.hasPrevPage?`http://localhost:8080/api/products?page=${products.prevPage}&query=${query2}&sort=${sort2}`:'';
        products.nextLink = products.hasNextPage?`http://localhost:8080/api/products?page=${products.nextPage}&query=${query2}&sort=${sort2}`:'';
        products.isValid= !(page<=0||page>products.totalPages)
        //Postman
         //res.send({ status: "success", payload: products}); 
        //Render page
        res.render("products.hbs", products );
    } catch (error) {
        res.status(500).send({ status: "error", error });
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
        return res.status(400).send({error:'Hay campos que faltan completar!'});
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
        //Postman
        //res.status(200).json(response);
        //redirijo a la misma página de carga y no muestro el resultado ya que se actualiza la lista
        res.redirect("/realTimeProducts");
    } catch (error) {
        const response = { status: "NOT FOUND", payload: `Ya existe el producto que desea crear!` };
        //Postman
        res.status(404).json(response);
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
        // res.status(200).json(response);
        //Render page
        res.render("products.hbs", { productById });
    } catch (error) {
        const response = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
        //Postman
        res.status(404).json(response);
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
        return res.status(404).json({ status: "NOT FOUND", data: "Error no se puede modificar el id"});
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
            //muestro resultado error
            res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
        };
        
    } catch (error) {
        const reserror = { status: "NOT FOUND", payload: `El producto con ID ${id} NO existe!` };
        res.status(404).send(reserror);
    };
};

const deleteProductById = async(req,res)=>{
    //Leo el ID por parametros
    const id = String(req.params.pid);
    //MongoDB
    try {
        const result = await deleteProductByIdService(id);

        //Valido el resultado de la búsqueda
        if (result.acknowledged & result.deletedCount!==0) {
            const io = req.app.get('socketio');
            io.emit("showProducts", await getProductsService());
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
};

const realTimeProducts = async (req, res) => { 
    try {
       const products = await getProductsService();
       res.render('realTimeProducts', { products });    
    } catch (error) {
        res.status(500).send({ status: "error", error });
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
