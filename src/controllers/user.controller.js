import { getUser as getUserService, addUser as addUserService } from '../services/user.service.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { generateToken, createHash, isValidPassword } from '../utils.js';
import { PRIVATE_COOKIE } from '../helpers/proyect.constants.js';
import UsersDto from '../dao/DTOs/users.dto.js';
import { postCart } from '../services/carts.service.js';

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await getUserService({ email });
        
        if (exists) return res.status(400).send({ status: 'error', error: responseMessages.user_exists });

        const cartId = await postCart();

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cartId
        }

        await addUserService(user);

        const accessToken = generateToken(user);

        res.send({ status: 'success', message: responseMessages.user_register_ok, access_token: accessToken })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
}; 

const loginUser =  async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserService({ email });

        console.log(user);
        if (!user) return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: 'error', error: responseMessages.incorrect_password })

        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age, 
            role: "user",
            cartId: user.cart._id
        }
        // console.log(req.user);
        if(user.email === 'adminCoder@coder.com') {
            //&& password === 'adminCod3r123'
            req.user.role = "admin";
        }

        const accessToken = generateToken(user);

        res.cookie(
            PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).send({ status: 'success', message: responseMessages.login_ok });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie(PRIVATE_COOKIE);
    res.redirect('/login')
};

const gitUser = async (req, res) => {
    res.redirect('/');
    //res.send({ status: "success", mesage: responseMessages.user_register_ok})
};

const gitCallbackUser = async (req, res) => {
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
    const accessToken = generateToken(req.user);

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    )
    
    res.redirect('/');
};

const currentUser = (req, res) => {
    const user = new UsersDto(req.user);
    //console.log(user);
    //const user = req.user;
    res.send({ status: 'success', payload: user });
};

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    gitUser, 
    gitCallbackUser, 
    currentUser 
}