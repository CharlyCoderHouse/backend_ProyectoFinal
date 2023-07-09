import { Carts, Products, Users } from '../dao/factory.js';
import CartsRepository from '../repositories/carts.repository.js';
import ProductRepository from '../repositories/products.repository.js';
import UsersRepository from '../repositories/users.repository.js';

const cartsRepository = new CartsRepository(new Carts());
const productsRepository = new ProductRepository(new Products());
const usersRepository = new UsersRepository(new Users());

export {
    cartsRepository,
    productsRepository,
    usersRepository
}