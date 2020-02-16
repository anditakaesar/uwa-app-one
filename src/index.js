import 'dotenv/config';

import app from './app';
import env from './env';
import logger from './logger';

app.listen(env.PORT, () => {
    logger.info(`app started at port: ${env.PORT}`);
});