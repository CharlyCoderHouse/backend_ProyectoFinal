import { Router } from 'express';
import { postCart, getCartById, putCartById, deleteAllProductsInCart, putProductInCart,deleteProductInCart, getCartUser } from '../controllers/carts.controller.js';
import { authorization, passportCall } from '../utils.js';

//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .get(passportCall('jwt'), getCartUser)
    .post(postCart);

router.route('/:cid')
    .get(getCartById)
    .put(passportCall('jwt'), authorization('user'), putCartById)
    .delete(passportCall('jwt'), authorization('user'), deleteAllProductsInCart);

router.route('/:cid/product/:pid')
    .put(passportCall('jwt'), authorization('user'), putProductInCart)
    .delete(passportCall('jwt'), authorization('user'), deleteProductInCart);    

export default router;