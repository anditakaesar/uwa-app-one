import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import logger from './logger';
import session from 'express-session';
import { dbconn } from './dbconn';
import env from './env';

// dbconn
import './dbconn';

const app = express();

// middlewares
app.use(json());
app.use(compression());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(helmet());

// session
const MongoStore = require('connect-mongo')(session);
app.use(session({
    name: env.SESSION_NAME,
    secret: env.COOKIES_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: env.COOKIES_AGESEC * 1000, secure: env.COOKIES_SECURE },
    store: new MongoStore({ mongooseConnection: dbconn })
}));

// router
app.use('/auth', require('./auth/authRouter').default);

// end point for error handling
app.use((err, req, res, next) => {
    if (err) {
        if (!err.status) err.status = 500;

        logger.error(err.message, {
            request: `${req.method} ${req.originalUrl}`,
            intmsg: err.intmsg
        });
        
        res.status(err.status).json({
            message: err.message
        });
    }
});

export default app;