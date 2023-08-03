import { Router } from 'express';
import { passportCall } from '../utils.js';
import { iniRaiz, loginRaiz, resetRaiz, profileRaiz, regRaiz } from '../controllers/raiz.controller.js';

const router = Router();

router.route('/register')
    .get(regRaiz);

router.route('/login')
    .get(loginRaiz);

router.route('/resetPassword')
    .get(resetRaiz);    
    
router.route('/')
    .get(passportCall('jwt'), iniRaiz);

router.route('/profile')
    .get(passportCall('jwt'), profileRaiz);

export default router;