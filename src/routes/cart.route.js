import { Router } from 'express';
import { postCart, getCartById, putCartById, deleteAllProductsInCart, 
    putProductInCart, deleteProductInCart, postPurchase, deleteCartById, 
    getPurchase, getAllPurchase } from '../controllers/carts.controller.js';
import { authorization, passportCall } from '../utils/utils.js';

//INICIALIZO ROUTER
const router = Router();

router.route('/')
    .post(postCart);

router.route('/:cid')
    .get(passportCall('jwt'), getCartById)
    .put(passportCall('jwt'), authorization(['User', 'Premium']), putCartById)
    .delete(passportCall('jwt'), authorization(['User']), deleteAllProductsInCart);

router.route('/delete/:cid')
    .delete(deleteCartById)
    
router.route('/:cid/product/:pid')
    .put(passportCall('jwt'), authorization(['User', 'Premium']), putProductInCart)
    .delete(passportCall('jwt'), authorization(['User']), deleteProductInCart);    

router.route('/:cid/purchase')
    .post(passportCall('jwt'), postPurchase); 

router.route('/mypurchase/all')
    .get(passportCall('jwt'), getAllPurchase); 

router.route('/purchase/:tid')
    .get(getPurchase); 

export default router;