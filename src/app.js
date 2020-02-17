import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import logger from './logger';

const app = express();

// middlewares
app.use(json());
app.use(compression());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(helmet());

// dbconn
import './dbconn';

app.use('/', (req, res, next) => {
    let err = new Error();
    err.message = `For outside message`;
    err.intmsg = `Some internal message`;
    err.status = 404;

    throw err;
});

// end point for error handling
app.use('/', (err, req, res, next) => {
    logger.error(err.message, {
        method: req.method,
        url: req.url,
        intmsg: err.intmsg
    });
    
    res.status(err.status).json({
        message: err.message
    });
});

export default app;