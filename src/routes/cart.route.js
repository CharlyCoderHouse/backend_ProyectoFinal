import { Router } from 'express';
import { postCart, getCartById, putCartById, deleteAllProductsInCart, putProductInCart, deleteProductInCart, postPurchase } from '../controllers/carts.controller.js';
import { authorization, passportCall } from '../utils.js';

//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .post(postCart);

router.route('/:cid')
    .get(passportCall('jwt'), getCartById)
    .put(passportCall('jwt'), authorization('user'), putCartById)
    .delete(passportCall('jwt'), authorization('user'), deleteAllProductsInCart);

router.route('/:cid/product/:pid')
    .put(passportCall('jwt'), authorization('user'), putProductInCart)
    .delete(passportCall('jwt'), authorization('user'), deleteProductInCart);    

router.route('/:cid/purchase')
//    .put(passportCall('jwt'), postPurchase); PARA CUANDO TENGA LA VISTA para comprar y validar usuario
    .put(postPurchase);


export default router;