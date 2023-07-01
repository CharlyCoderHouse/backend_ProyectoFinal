import { Router } from 'express';
import { postCart, getCartById, putCartById, deleteAllProductsInCart, putProductInCart,deleteProductInCart } from '../controllers/carts.controller.js';

//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .post(postCart);

router.route('/:cid')
    .get(getCartById)
    .put(putCartById)
    .delete(deleteAllProductsInCart);

router.route('/:cid/product/:pid')
    .put(putProductInCart)
    .delete(deleteProductInCart);    

export default router;