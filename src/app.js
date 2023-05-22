import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import { join } from 'path';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import raizRouter from './routes/raiz.route.js';
import productsRouter from './routes/products.route.js';
import cartsRouter from './routes/cart.route.js';
import viewsProdRouter from './routes/viewsProd.route.js';
//fileSystem
//import productManager from './dao/manager/productManager.js';
import viewsMessage from "./routes/viewsMessage.router.js"
//MongoDB
import productManager from './dao/dbManager/productManager.js';
import messageManager from './dao/dbManager/messageManager.js';
import mongoose from 'mongoose';

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
app.use("/api/carts", cartsRouter);
// Carga de productos
app.use('/realtimeproducts', viewsProdRouter)
// Page Chat
app.use('/chat', viewsMessage)

// Conecto a MongoDB Atlas
try {
    await mongoose.connect('mongodb+srv://carlosdiblasi:pC37lOviWb5KklvJ@codercluster39760.0wyns7x.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('DB Connect');
} catch (error) {
    console.log(error);
};

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

//Creamos la instancia de la clase FILESYTEM
//const ProductManager = new productManager('./src/files/product.json');

//Creamos la instancia de la clase MONGODB
const ProductManager = new productManager();
const MessageManager = new messageManager();

const messages = [];

io.on('connection', async socket => {
     console.log('Nuevo cliente conectado');
     const products = await ProductManager.getProducts()
     //console.log(JSON.stringify(products, null, '\t'));
     io.emit("showProducts", products.docs);

     socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
        
        // Persistir en MONGO el chat
        try {
            const messageUser = MessageManager.addMessage(data);
        } catch (error) {
            console.log("Error",error);
        }

    });

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});

