import CartsRepository from '../repositories/carts.repository.js';
import ProductsRepository from '../repositories/products.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';

const cartsRepository = new CartsRepository();
const productsRepository = new ProductsRepository();
const ticketRepository = new TicketRepository();

const postCart = async (cart) => {
    const result = await cartsRepository.addCart(cart);
    return result;
}; 

const getCartById = async (cartId) => {
    const cart = await cartsRepository.getCartById(cartId);
    return cart;
};

const putCartById = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteAllProductsInCart = async (id) => {
    const result = await cartsRepository.deleteAllProductsInCart(id);
    return result;
};

const putProductInCart = async (cartId, productId, quantity) => {
    const result = await cartsRepository.addProductInCart(cartId, productId, quantity);
    return result;
};

const deleteProductInCart = async (cartId,productId) => {
    const result = await cartsRepository.deleteProductInCart(cartId,productId);
    return result;
};

const postPurchase = async (cart, userMail) => {
    //verifico que el Stock a actualizar 
    const currentProducts = business.products.filter((product) => 
        products.includes(product.id)
    );

    const sum = currentProducts.reduce((acc, prev) => {
        acc += prev.price;
        return acc;
    }, 0);

    const orderNumber = Date.now() + Math.floor(Math.random() * 100000 + 1);

    const order = {
        number: orderNumber,
        business: business._id,
        user: user._id,
        status: 'pending',
        products: currentProducts.map((product) => product.id),
        total_price: sum
    };

    console.log(order);

    const result = await ticketRepository.createTicket(cartId,productId);
    return result;
};


export {
    postCart,
    getCartById,
    putCartById,
    deleteAllProductsInCart, 
    putProductInCart,
    deleteProductInCart,
    postPurchase   
}