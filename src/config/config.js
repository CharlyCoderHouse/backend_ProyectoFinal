import dotenv from 'dotenv';

dotenv.config();

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    port: process.env.PORT,
    gitClienteID: process.env.GITCLIENTID,
    gitClientSecret: process.env.GITCLIENTSECRET,
    gitCallbackURL: process.env.GITCALLBACKURL
}