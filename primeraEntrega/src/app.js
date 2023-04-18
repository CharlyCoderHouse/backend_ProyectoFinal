import express, { json, urlencoded } from 'express';
import raizRouter from '../routes/raiz.route.js';
import productsRouter from '../routes/products.route.js';
import cartsRouter from '../routes/cart.route.js';

//Creo el Servidor Express
const app = express();
app.use(json());
app.use(urlencoded({extended: true}));

//middleware Log conexiones
app.use((req, res, next) => {
    console.log(`Nueva ${req.method} - ${req.path}`);
    next();
});

//Routes
//inicio /
app.use("/", raizRouter);
// Productos
app.use("/api/products", productsRouter);
// Carrito
app.use("/api/cart", cartsRouter);

//Escuchando puerto 8080 con log de errores
app.listen(8080, (error) => {
    if(error){
        console.log('Error al iniciar la APP', error);
    }else{
        console.log('Servidor escuchando el puerto 8080');
    }
})