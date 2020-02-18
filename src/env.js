export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
export const MONGODB_NAME = process.env.MONGODB_NAME || 'uwaappone-test';
export const JWT_EXPSEC = parseInt(process.env.JWT_EXPSEC) || 120;
export const SESSION_NAME = process.env.SESSION_NAME || 'session-name';
export const COOKIES_SECRET = process.env.COOKIES_SECRET || 'secret';
export const COOKIES_AGESEC = parseInt(process.env.COOKIES_AGESEC) || 86400;
export const COOKIES_SECURE = process.env.COOKIES_SECURE || false;
export const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN || '';
export const LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN || '';
export const LOGGLY_TAG = process.env.LOGGLY_TAG || '';

const env = {
    NODE_ENV, PORT, MONGODB_URI, MONGODB_NAME, JWT_EXPSEC,
    SESSION_NAME, COOKIES_SECRET, COOKIES_AGESEC, COOKIES_SECURE,
    LOGGLY_TOKEN, LOGGLY_SUBDOMAIN, LOGGLY_TAG
};

export default env;