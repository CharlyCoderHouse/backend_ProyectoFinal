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
    console.log(authToken);
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
                //return res.status(401).send({error: info.messages ? info.messages : info.toString()})
            }
            //console.log(user);
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
    console.log(authToken);
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
        cb(null, `${__dirname}/public/data/profiles`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err);
        next();
    }
});

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
    uploader
}