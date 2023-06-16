import { Router } from 'express';
import { passportCall } from '../utils.js';

const router = Router();

router.route('/register')
    .get( (req, res) => {
        res.render('register.hbs');
    });

router.route('/login')
    .get( (req, res) => {
        res.render('login.hbs');
    });
    
router.route('/')
    .get(passportCall('jwt'), (req, res) => {
        res.render('home.hbs', {
            user: req.user
        });
    });

router.route('/profile')
    .get(passportCall('jwt'), (req, res) => {
        res.render('profile.hbs', {
            user: req.user,
        });
    });

export default router;