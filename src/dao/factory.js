import config from "../config/config.js";

let Carts;
let Products;
let Users;
let Tickets;
let Messages;
const persistence = config.persistence;

switch(persistence) {
    case 'MONGO':
        console.log('Trabajando con BDD');
        const mongoose = await import("mongoose");
        await mongoose.connect(config.mongoUrl);
        const { default: CartsMongo } = await import('./dbManager/cart.Manager.js');
        const { default: ProductsMongo } = await import('./dbManager/product.Manager.js');
        const { default: UsersMongo } = await import('./dbManager/user.Manager.js');
        const { default: TicketsMongo } = await import('./dbManager/ticket.Manager.js');
        const { default: MessagesMongo } = await import('./dbManager/message.Manager.js');
        Carts = CartsMongo;
        Products = ProductsMongo;
        Users = UsersMongo;
        Tickets = TicketsMongo;
        Messages = MessagesMongo;
        break;
    case 'FILES':
        console.log('Trabajando con FS');
        const { default: CartsFiles } = await import('./manager/cartManager.js');
        const { default: ProductsFiles } = await import('./manager/productManager.js');
        Carts = CartsFiles;
        Products = ProductsFiles;
        break;
}

export {
    Carts,
    Products,
    Users,
    Tickets,
    Messages
}