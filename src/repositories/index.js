import { Carts, Products, Users, Tickets, Messages } from '../dao/factory.js';
import CartsRepository from '../repositories/carts.repository.js';
import ProductRepository from '../repositories/products.repository.js';
import UsersRepository from '../repositories/users.repository.js';
import TicketsRepository from '../repositories/ticket.repository.js';
import MessagesRepository from '../repositories/messages.repository.js';

const cartsRepository = new CartsRepository(new Carts());
const productsRepository = new ProductRepository(new Products());
const usersRepository = new UsersRepository(new Users());
const ticketsRepository = new TicketsRepository(new Tickets());
const messagesRepository = new MessagesRepository(new Messages());

export {
    cartsRepository,
    productsRepository,
    usersRepository,
    ticketsRepository,
    messagesRepository
}