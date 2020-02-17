import { Router } from 'express';
import passport, { strategy } from './passport';
import jwt from 'jsonwebtoken';
import env from '../env';
import { keys } from './signopt';
import { dbconn } from '../dbconn';

const router = Router();
let error = new Error();

function genToken(payload) {
    let signOptions = {
        expiresIn: "12h",
        algorithm: "HS256"
    }

    let token = jwt.sign(payload, keys.public, signOptions);
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
                res.status(200).json({
                    success: true,
                    message: `User success signup and loggedin`,
                    user: userPayload,
                    token: genToken(userPayload)
                });
            });
        }
    })(req, res, next);
});

router.post('/login', (req, res, next) => {
    passport.authenticate(strategy.LOCAL_LOGIN, 
    (err, user, info) => { // user -> found user, correct password
        if (err) next(err);
        if (!user) {
            next({ message: info.message });
        } else { // user found
            req.login(user, err => {
                if (err) next(err);
                let userPayload = genPayload(user);
                res.status(200).json({
                    success: true,
                    message: `User success login`,
                    user: userPayload,
                    token: genToken(userPayload)
                });
            });
        }
        
    })(req, res, next);
});

router.get('/verify', passport.authenticate(strategy.JWT_LOGIN, {
    successRedirect: 'verify/success',
    failureRedirect: 'verify/fail'
}));

router.get('/verify/success', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'token verified',
        verified: true
    });
});

router.get('/verify/fail', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'token expired',
        verified: false
    });
});

export default router;