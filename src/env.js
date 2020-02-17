export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
export const MONGODB_NAME = process.env.MONGODB_NAME || 'uwaappone-test';
export const JWT_SECRET = process.env.JWT_SECRET || 'this-is-a-secret';
export const JWT_EXPSEC = process.env.JWT_EXPSEC || '12h';
export const SESSION_NAME = process.env.SESSION_NAME || 'session-name';
export const COOKIES_SECRET = process.env.COOKIES_SECRET || 'secret';
export const COOKIES_AGESEC = parseInt(process.env.COOKIES_AGESEC) || 86400;
export const COOKIES_SECURE = process.env.COOKIES_SECURE || false;

const env = {
    NODE_ENV, PORT, MONGODB_URI, MONGODB_NAME, JWT_EXPSEC, JWT_SECRET,
    SESSION_NAME, COOKIES_SECRET, COOKIES_AGESEC, COOKIES_SECURE
};

export default env;