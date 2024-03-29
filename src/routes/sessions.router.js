import { Router } from 'express';
import { registerUser, loginUser, logoutUser, passLink, linkPass, putPass, 
    gitUser, gitCallbackUser, currentUser, changeRol } from "../controllers/user.controller.js"
import { authTokenPass, passportCall } from '../utils/utils.js';

const router = Router();

router.route('/register')
    .post(registerUser);

router.route('/login')
    .post(loginUser);

router.route('/logout')
    .get(passportCall('jwt'), logoutUser);

router.route('/password_link')
    .post(passLink);

router.route('/linkPassword')
    .get(authTokenPass, linkPass)

router.route('/changePassword')
    .post(passportCall('jwt'), putPass);

router.route('/github')
    .get(passportCall('github', { scope: ['user:email'] }), gitUser);

router.route('/github-callback')
    .get(passportCall('github', { failureRedirect: '/login' }), gitCallbackUser);

router.route('/current')
    .get(passportCall('jwt'), currentUser);

export default router;