import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { keys } from './signopt';
import logger from '../logger';
import env from '../env';
import User from '../user/userModel';

export const strategy = {
    LOCAL_LOGIN: `local-login`,
    LOCAL_SIGNUP: `local-signup`,
    JWT_LOGIN: `jwt-login`
}

passport.serializeUser((user, next) => {
    next(null, user);
});

passport.deserializeUser((user, next) => {
    let newUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        password: 'gotcha'
    };

    next(null, newUser);
});

// STRATEGIES
passport.use(strategy.LOCAL_LOGIN,
new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, next) => {
        let message = `user not found or wrong password!`;

        process.nextTick(() => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    next(null, false, { message: err.message });
                }

                if (!user) {
                    next(null, false, { message: message });

                } else { // user found
                    if (user.active) { // check if user is active (not locked)
                        if (user.validPassword(password)) { // success password
                            user.lastLogin = Date.now();
                            user.lastLoginTry = 0;
                            user.save();
                            
                            logger.info(`success login`, { intmsg: strategy.LOCAL_LOGIN, request: `${req.method} ${req.originalUrl}`, username: user.username });
                            next(null, user);
                        } else { // wrong password
                            
                            next(null, false, { message: message });
                        }

                    } else { // user is locked
                        logger.error(`locked user access attempt`, { intmsg: strategy.LOCAL_LOGI, request: `${req.method} ${req.originalUrl}`, username: user.username });
                        next(null, false, { message: message });
                    }
                }

            });
        });
    }
)); // local-login

passport.use(strategy.LOCAL_SIGNUP, 
new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, next) => {

        process.nextTick(() => {
            User.findOne({ username: username }, (err, user) => {
                if (err) {
                    next(null, false, { message: err.message });
                }
                if (user) {
                    next(null, false, { message: `username already exists!`});
                } else {
                    let newUser = new User();
                    newUser.username = username;
                    newUser.email = req.body.email;
                    newUser.password = newUser.generateHash(password);
                    newUser.save((err) => {
                        if (err) {
                            next(null, false, { message: err.message });
                        } else {
                            logger.info(`new user created!`, { intmsg: strategy.LOCAL_SIGNUP, request: `${req.method} ${req.originalUrl}`, username: newUser.username});
                            next(null, newUser);
                        }
                    });
                }
            });
        }); // nextTick
        
    }
)); // local-signup

var jwtparams = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: keys.public
};

passport.use(strategy.JWT_LOGIN, 
new JwtStrategy(
    jwtparams,
    (jwtPayload, next) => {
        var user = {
            id: jwtPayload.id,
            username: jwtPayload.username,
            email: jwtPayload.email
        };

        next(null, user);
    }
));

export default passport;