import { Router } from 'express';
import passport from 'passport';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { authToken, authorization, generateToken, passportCall, createHash, isValidPassword } from '../utils.js';
import userModel from "../dao/models/users.Model.js";

const router = Router();

router.route('/register')
    .post(async (req, res) => {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            const exists = await userModel.findOne({ email });
            
            if (exists) return res.status(400).send({ status: 'error', error: 'User already exists' });

            const user = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            await userModel.create(user);

            const accessToken = generateToken(user);

            res.send({ status: 'success', message: 'User registered', access_token: accessToken })
        } catch (error) {
            res.status(500).send({ status: 'error', error: error.message });
        }
    });

router.route('/login')
    .post(async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email });

            console.log(user);
            if (!user) return res.status(400).send({ status: 'error', error: 'Incorrect credentials' });

            if (!isValidPassword(user, password)) return res.status(401).send({ status: 'error', error: 'Incorrect password' })

            req.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age, 
                role: "user"
            }

            if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                req.user.role = "admin";
            }

            const accessToken = generateToken(user);

            res.cookie(
                'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
            ).send({ status: 'success', message: 'Login success' });
        } catch (error) {
            res.status(500).send({ status: 'error', error });
        }
    });

router.route('/logout')
    .get((req, res) => {
        res.clearCookie('coderCookieToken');
        res.redirect('/login')
    });

router.route('/github')
    .get(passport.authenticate('github', { scope: ['user:email']}), async (req, res) => {
        res.send({ status: "success", mesage: responseMessages.user_register_ok})
});

router.route('/github-callback')
    .get(passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email, 
        role: "user", 
    };

    if(req.user.email === 'adminCoder@coder.com' ) {
        req.user.role = "admin";
    }
    const accessToken = generateToken(user);

    res.cookie(
        'coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    ).send({ status: 'success', message: 'Login success' });
    
    res.redirect('/');
});    

router.route('/current')
    .get(passportCall('jwt'), (req, res) => {
        res.send({ status: 'success', payload: req.user });
});

//se comenta el código por implementar PASSPORT
/* router.route('/register')
    .post(async (req, res) => {
        try {
            const { first_name, last_name, email, age, password } = req.body;
            const exists = await userModel.findOne({ email });
            
            if (exists) return res.status(400).send({ status: 'error', error: 'User already exists' });

            const user = {
                first_name,
                last_name,
                email,
                age,
                password
            }

            await userModel.create(user);
            res.send({ status: 'success', message: 'User registered' })
        } catch (error) {
            res.status(500).send({ status: 'error', error });
        }
    });

router.route('/login')
    .post(async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email, password });

            if (!user) return res.status(400).send({ status: 'error', error: 'Incorrect credentials' });

            req.session.user = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age, 
                role: "user"
            }

            if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                req.session.user.role = "admin";
            }

            res.send({ status: 'success', message: 'Login success' });

        } catch (error) {
            res.status(500).send({ status: 'error', error });
        }
    });
 */

export default router;