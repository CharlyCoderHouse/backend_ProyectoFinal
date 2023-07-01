import passport from 'passport';
import jwt from 'passport-jwt';
import { getUser as getUserService, addUser as addUserService } from '../services/user.service.js';
import GitHubStrategy from 'passport-github2';
import { PRIVATE_COOKIE, PRIVATE_KEY } from '../helpers/proyect.constants.js';
import config from './config.js';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

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
            clientID: config.gitClienteID,
            clientSecret: config.gitClientSecret,
            callbackURL: config.gitCallbackURL,
            scope: ['user:email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const user = await getUserService({ email });
                if (!user) {
                    const newUser = {
                        first_name: ' - GitHub',
                        last_name: profile._json.name,
                        email,
                        age: 18,
                        password: ''
                    }
                    const result = await addUserService(newUser);
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
        token = req.cookies[PRIVATE_COOKIE];
    }
    return token;
}

export default initializePassport;
