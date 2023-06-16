import passport from 'passport';
import jwt from 'passport-jwt';
//import local from 'passport-local';
import userModel from '../dao/models/users.Model.js';
//import { generateToken, createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import { PRIVATE_KEY } from '../helpers/proyect.constants.js';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
//const LocalStrategy = local.Strategy;

const initializePassport = () => {
        passport.use('jwt', new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload.user);
            } catch (error) {
                return done(error);
            }
        }));

        passport.use('github', new GitHubStrategy({
            clientID: "Iv1.75093c0202663bd3",
            clientSecret: "ec3751326a13c2b9e8c6466dc0754bbc53dc42ef",
            callbackURL: "http://localhost:8080/api/sessions/github-callback",
            scope: ['user:email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const user = await userModel.findOne({ email });
                if (!user) {
                    const newUser = {
                        first_name: profile._json.name,
                        last_name: ' - GitHub',
                        email,
                        age: 18,
                        password: ''
                    }
        
                    done(null, result);
                    
                } else {
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }));
};

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
}

export default initializePassport;

//Se comenta la estrategia Local para implementar JWT
/* const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, //permite acceder al objeto request como cualquier otro middleware,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await userModel.findOne({ email: username });

            if (user) {
                return done(null, false, {message: 'User exists'})
            }

            const userToSave = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
    
            const result = await userModel.create(userToSave);
            return done(null, result)

        } catch (error) {
            return done(`Error al obtener el usario: ${error}`)
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username});

            if (!user) {
                return done(null, false, { message: 'Incorrect username' } )
            }

            if (!isValidPassword(user, password)) return done(null, false,  { message: 'Incorrect password' })

            return done(null, user)
            //req.user

        } catch (error) {
            return done(`Error al obtener el usario: ${error}`)
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.75093c0202663bd3",
        clientSecret: "ec3751326a13c2b9e8c6466dc0754bbc53dc42ef",
        callbackURL: "http://localhost:8080/api/sessions/github-callback",
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const user = await userModel.findOne({ email });
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: ' - GitHub',
                    email,
                    age: 18,
                    password: ''
                }

                const result = await userModel.create(newUser);

                done(null, result);
                
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport; */