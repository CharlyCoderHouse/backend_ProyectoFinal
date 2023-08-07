import { getUser as getUserService, addUser as addUserService, updateUserPass as updateUserPassService } from '../services/user.service.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { generateToken, generateTokenResetPass, createHash, isValidPassword } from '../utils.js';
import { PRIVATE_COOKIE } from '../helpers/proyect.constants.js';
import UsersDto from '../dao/DTOs/users.dto.js';
import { postCart } from '../services/carts.service.js';
import { loginNotification } from '../utils/custom-html.js';
import { sendEmail } from "../services/mail.js";

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await getUserService({ email });
        
        if (exists) {
            req.logger.warning(`registerUser = ` + responseMessages.user_exists); 
            return res.status(400).send({ status: 'error', error: responseMessages.user_exists });
        }    

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
        req.logger.error(`registerUser = ` + error.message); 
        res.status(500).send({ status: 'error', error: error.message });
    }
}; 

const loginUser =  async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserService({ email });

        if (!user) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_user); 
            return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });
        }
        if (!isValidPassword(user, password)) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_password); 
            return res.status(401).send({ status: 'error', error: responseMessages.incorrect_password })
        }
        req.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age, 
            role: "user",
            cartId: user.cart._id
        }
        
        if(user.email === 'adminCoder@coder.com') {
            //&& password === 'adminCod3r123'
            req.user.role = "admin";
        }

        const accessToken = generateToken(user);

        res.cookie(
            PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
        ).send({ status: 'success', message: responseMessages.login_ok });
    } catch (error) {
        req.logger.error(`loginUser = ` + error.message);
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
    res.send({ status: 'success', payload: user });
};

const passLink = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await getUserService({ email });

        if (!user) {
            req.logger.warning(`loginUser = ` + responseMessages.incorrect_user); 
            return res.status(400).send({ status: 'error', error: responseMessages.incorrect_user });
        }

        const accessToken = generateTokenResetPass(user);

        const link = `http://localhost:8080/api/sessions/linkPassword?token=${accessToken}`
        const mail = {
            to: user.email,
            subject: 'Reseteo de Contraseña',
            html: loginNotification(link)
        }
        
        await sendEmail(mail);

        res.send({ status: 'success', message: 'link OK', access_token: accessToken });
    } catch (error) {
        res.status(500).send({ status: 'error', error });
    }

};

const linkPass = (req, res) => {
    
    const accessToken = req.query.token;

    res.cookie(
        PRIVATE_COOKIE, accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }
    );

    res.render('linkPassword.hbs');

};

const putPass = async (req, res) =>{
    try {
        const { password } = req.body;
        const email = req.user.email;
        const user = await getUserService({ email });

        if (isValidPassword(user, password)) {
            req.logger.warning(`2 User = ` + responseMessages.invalid_password); 
            return res.status(401).send({ status: 'error', error: responseMessages.invalid_password })
        } else {
            const id = String(user._id)
            const newPass =  createHash(password)
    
            const result = await updateUserPassService(id, newPass);
            
            //Valido que se realizo el UPDATE
            if (result.acknowledged & result.modifiedCount!==0) {
                const response = { status: "Success", payload: `La contraseña fue cambiada con exito!`};       
                //muestro resultado y elimino la cookie
                res.clearCookie(PRIVATE_COOKIE);
                res.status(200).json(response);
            } else {
                req.logger.error(`putPass = Error no se pudo actualizar el producto, verifique los datos ingresados`);
                //muestro resultado error
                res.status(404).json({ status: "NOT FOUND", data: "Error no se pudo actualizar el producto, verifique los datos ingresados"});
            };   
        }
    } catch(error) {
        res.status(500).send({ status: 'error', error });
    }
};

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    passLink,
    linkPass,
    putPass,
    gitUser, 
    gitCallbackUser, 
    currentUser 
}