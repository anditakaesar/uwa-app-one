import { Router } from 'express';
import passport, { strategy } from './passport';
import jwt from 'jsonwebtoken';
import env from '../env';
import logger from '../logger';
import { keys } from './signopt';
import { dbconn } from '../dbconn';

const router = Router();
let error = new Error();

function genToken(payload) {
    let signOptions = {
        expiresIn: env.JWT_EXPSEC,
        algorithm: 'HS256'
    }

    let token = jwt.sign(payload, keys.private.trim(), signOptions);
    return token;
}

function genPayload(user) {
    let userPayload = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    return userPayload;
}

// initialize passport
router.use(passport.initialize());
router.use(passport.session());

// check db connection
router.use((req, res, next) => {
    if (dbconn.readyState) {
        next();
    } else {
        error.message = `Database not ready`;
        error.request = `${req.method} ${req.originalUrl}`;
        error.status = 500;
        next(error);
    }
});

router.post('/signup', 
// passport.authenticate(strategy.JWT_LOGIN), 
(req, res, next) => {
    passport.authenticate(strategy.LOCAL_SIGNUP, 
    (err, user, info) => { // user -> newUser created
        if (err) {
            error.message = `error while signing up`;
            error.status = 500;
            error.intmsg = err.message;

            next(err);
        }

        if (!user) {
            next({ message: info.message });
        } else { // successful created, try-login
            req.logIn(user, (err) => {
                if (err) {
                    error.message = `error while signing up`;
                    error.status = 500;
                    error.intmsg = err.message;

                    next(err);
                }

                let userPayload = genPayload(user);
                res.send({
                    success: true,
                    message: `User success signup and loggedin`,
                    user: userPayload,
                    token: genToken(userPayload)
                });
            });
        }
    })(req, res, next);
});

export default router;