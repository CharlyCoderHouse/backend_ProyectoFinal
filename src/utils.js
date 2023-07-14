import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from './helpers/proyect.constants.js';
import { responseMessages } from './helpers/proyect.helpers.js';
import { fakerES as faker } from '@faker-js/faker';

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
}

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
        if(req.user.role != role) return res.status(403).send({error: responseMessages.not_permissions});
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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    passportCall,
    authToken,
    authorization,
    generateProduct
}