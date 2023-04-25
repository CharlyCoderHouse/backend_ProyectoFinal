import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import { join } from 'path';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import raizRouter from './routes/raiz.route.js';
import productsRouter from './routes/products.route.js';
import cartsRouter from './routes/cart.route.js';
import viewsProdRouter from './routes/viewsProd.route.js';


//Creo el Servidor Express
const app = express();
// app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(`${__dirname}/public`))
app.use(json());
app.use(urlencoded({extended: true}));

//middleware Log conexiones
app.use((req, res, next) => {
    console.log(`Nueva ${req.method} - ${req.path}`);
    next();
});

// Creo Plantilla Handlebars
app.engine('hbs', engine({
    extname: ".hbs",
    defaultLayout: join(__dirname, "/views/layouts/main.hbs"),
    layoutsDir: join(__dirname, "/views/layouts"),
}))
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'hbs')

//Routes
//inicio /
app.use("/", raizRouter);
// Productos
app.use("/api/products", productsRouter);
// Carrito
app.use("/api/cart", cartsRouter);
// Carga de productos
app.use('/realtimeproducts', viewsProdRouter)

//Escuchando puerto 8080 con log de errores
const server = app.listen(8080, (error) => {
    if(error){
        console.log('Error al iniciar la APP', error);
    }else{
        console.log('Servidor escuchando el puerto 8080');
    }
});

// Conecto server socket.io
const io = new Server(server);
app.set('socketio',io);

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');
    //const io = req.app.get('socketio');
    io.emit("showProducts");
})