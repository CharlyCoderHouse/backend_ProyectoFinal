import { Router } from 'express';
import { passportCall } from '../utils.js';
import { responseMessages } from '../helpers/proyect.helpers.js';

const router = Router();

// //Acceso público y privado
//Acceso público y privado
const publicAccess = (req, res, next) => {
    console.log(req.user);
    if(req.user) return res.redirect('/');
    next();
};

const privateAccess = (req, res, next) => {
    console.log(req.user);
    if(!req.user) return res.redirect('/login.hbs');
    next();
};

router.route('/register')
    .get( (req, res) => {
        res.render('register.hbs');
    });

router.route('/login')
    .get( (req, res) => {
        res.render('login.hbs');
    });
    
router.route('/')
    .get(passportCall('jwt'), privateAccess, (req, res) => {
        res.render('home.hbs', {
            user: req.user
        });
    });

router.route('/profile')
    .get(passportCall('jwt'), privateAccess, (req, res) => {
        res.render('profile.hbs', {
            user: req.user,
        });
    });

export default router;