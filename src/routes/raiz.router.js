import { Router } from 'express';

const router = Router();

//Acceso público y privado
const publicAccess = (req, res, next) => {
    if(req.session.user) return res.redirect('/');
    next();
};

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
};

router.route('/register')
    .get(publicAccess, (req, res) => {
        res.render('register');
    });

router.route('/login')
    .get(publicAccess, (req, res) => {
        res.render('login');
    });

router.route('/logout')
    .get((req, res) => {
        req.session.destroy(err => {
            if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
            res.redirect('/')
        })
    });
    
router.route('/')
    .get(privateAccess, (req, res) => {
        res.render('home', {
            user: req.session.user
        });
    });

router.route('/profile')
    .get(privateAccess, (req, res) => {
        res.render('profile', {
            user: req.session.user
        });
    });

export default router;