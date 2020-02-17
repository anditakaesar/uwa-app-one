import 'dotenv/config';

import app from './app';
import env from './env';
import logger from './logger';
import { keys } from './auth/signopt';

app.listen(env.PORT, () => {
    logger.info(`app started at port: ${env.PORT}`);
});