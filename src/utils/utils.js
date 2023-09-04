import { fileURLToPath } from "url";
import path from "path";
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../helpers/proyect.constants.js';
import { responseMessages } from '../helpers/proyect.helpers.js';
import { fakerES as faker } from '@faker-js/faker';
import nodemailer from 'nodemailer';
import config from "../config/config.js"
import multer from "multer";
import { getUserById } from "../services/user.service.js";

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
const __dirname = path.join(dirname, '..')

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
    return token;
};

const authToken = (req, res, next) => {
    const authToken = req.headers.authorization;
    if(!authToken) return res.status(401).send({error: responseMessages.not_authenticated});

    const token = authToken.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: responseMessages.not_authorized});
        req.user = credentials.user;
        next();
    })
};

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err);
            if(!user) {
                return res.redirect('/login')
            }
            req.user = user;
            next();
        })(req, res, next)
    }
}

const authorization = (role) => {
    return async (req, res, next) => {
        let flag = false;
        const roleUser =req.user.role;
        role.forEach(element => {
            if (roleUser===element){
                flag=true;
            };
        });
        if(!flag) return res.status(403).send({error: responseMessages.not_permissions});
       
        next();
    }

}

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(10),
        stock: faker.string.numeric(1),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()]
    }
}

const generateTokenResetPass = (user) => {
    const tokenResetPass = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1h' });
    return tokenResetPass;
};

const authTokenPass = (req, res, next) => {
    const authToken = req.query.token
    if(!authToken) return res.redirect('/resetPasswordError');//res.status(401).send({error: responseMessages.not_authenticated});

    jwt.verify(authToken, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.redirect('/resetPasswordError'); //res.status(403).send({error: responseMessages.not_authorized});
        req.user = credentials.user;
        next();
    })
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.userNodemailer,
        pass: config.passNodemailer
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        switch (file.fieldname) {
            case "profiles":
                cb(null, `${__dirname}/public/data/profiles`);
                break;
            case "products":
                cb(null, `${__dirname}/public/data/products`);
                break;  
            default:
                cb(null, `${__dirname}/public/data/documents`);
                break;
        }  
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = (req, res, next) => {
    const upload = multer({storage, onError: (err, next) => {
                            console.log(err);
                            next();
                        }}).fields([{name: 'profiles', maxCount: 1}, 
                                {name: 'products', maxCount: 1},
                                {name: 'IDENTIFICATION', maxCount: 1},
                                {name: 'ADDRESS', maxCount: 1},
                                {name: 'ACCOUNT', maxCount: 1}])
                                  
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ status: "NOT FOUND", data: "Error al cargar el archivo, verifique el nombre del post"});
        } else if (err) {
            return res.status(401).json({ status: "NOT FOUND", data: `Error en el archivo ${err}`});
        } 
        next(); 
    })
    
};

const userComplete = async (req, res, next) => {
    const id = String(req.params.uid);
    let user;
    try {
        user = await getUserById(id);
    } catch (error) {
        return res.status(500).send({error: responseMessages.incorrect_user});
    }
    if(!user) return res.status(404).send({error: responseMessages.incorrect_user});
    if (user.role === "User"){
        let flagId, flagAddr, flagAcc;
        user.status.forEach(element => {
            switch (element) {
                case "IDENTIFICATION":
                    flagId=true;
                    break;
                case "ADDRESS":
                    flagAddr=true;
                    break;
                case "ACCOUNT":
                    flagAcc=true;
                    break;
                }
        });

        if (!(flagId && flagAddr && flagAcc)) return res.status(403).send({error: responseMessages. not_complete_user})     
    } 
    next();
};

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    passportCall,
    authToken,
    authTokenPass,
    authorization,
    generateProduct,
    generateTokenResetPass,
    transporter,
    uploader,
    userComplete
}