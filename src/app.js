import express, { json, urlencoded } from 'express';
import { __dirname } from './utils/utils.js';
import { join } from 'path';
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import raizRouter from './routes/raiz.router.js';
import homeRouter from './routes/home.route.js';
import productsRouter from './routes/products.route.js';
import cartsRouter from './routes/cart.route.js';
import viewsProdRouter from './routes/viewsProd.route.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import mockingproducts from './routes/mockingproducts.route.js';
import loggerTest from './routes/loggerTest.route.js';
import './dao/dbManager/dbConfig.js'
import config from './config/config.js';
import viewsMessage from "./routes/viewsMessage.router.js"
//import productManager from './dao/dbManager/product.Manager.js';
//import messageManager from './dao/dbManager/message.Manager.js';
import { productsRepository, messagesRepository } from './repositories/index.js';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import { addLogger } from './utils/logger.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

//Creo el Servidor Express
const app = express();
app.use(express.static(`${__dirname}/public`))
app.use(json());
app.use(urlencoded({extended: true}));

//Para documentación del Proyecto con Swagger 
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto Joyería Puga - ecommerce',
            description: 'API pensada para venta de artículos de Joyería y Relojería. Proyecto para comisión 39760 CoderHouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Middleware para cookies
app.use(cookieParser());

// Middleware para logger 
app.use(addLogger);

//middleware Log conexiones
app.use((req, res, next) => {
    console.log(`Nueva ${req.method} - ${req.path}`);
    next();
});

//PASSPORT Se utiliza JWT para sesiones
initializePassport();
app.use(passport.initialize());

// Creo Plantilla Handlebars
app.engine('hbs', engine({
    extname: ".hbs",
    defaultLayout: join(__dirname, "/views/layouts/main.hbs"),
    layoutsDir: join(__dirname, "/views/layouts"),
}))
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'hbs')

//Routes
//inicio login /
app.use("/", raizRouter);
//Sesión Login y register
app.use('/api/sessions', sessionsRouter);
//inicio despues del logueo /
app.use("/home", homeRouter);
// Productos
app.use("/api/products", productsRouter);
// Carrito
app.use("/api/carts", cartsRouter);
// MANEJO DE USUARIOS
app.use('/api/users', usersRouter);
// Carga de productos
app.use('/realtimeproducts', viewsProdRouter)
// Page Chat
app.use('/chat', viewsMessage)
// MONCKING
app.use('/mockingproducts', mockingproducts);
// TEST LOGGER
app.use('/loggerTest', loggerTest);

//Escuchando puerto con log de errores
const server = app.listen(config.port, (error) => {
    if(error){
        console.log('Error al iniciar la APP', error);
    }else{
        console.log(`Servidor escuchando el puerto ${config.port}`);
    }
});

// Conecto server socket.io
const io = new Server(server);
app.set('socketio',io);

const messages = [];

io.on('connection', async socket => {
     console.log('Nuevo cliente conectado');
     const products = await productsRepository.getProducts()
     
     io.emit("showProducts", products.docs);

     socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
        
        // Persistir en MONGO el chat
        try {
            const messageUser = messagesRepository.addMessage(data);
        } catch (error) {
            console.log("Error",error);
        }

    });

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});

