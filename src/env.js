export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
export const MONGODB_NAME = process.env.MONGODB_NAME || 'uwaappone-test';
export const JWT_SECRET = process.env.JWT_SECRET || 'this-is-a-secret';
export const JWT_EXPSEC = parseInt(process.env.JWT_EXPSEC) || '12h';

const env = {
    NODE_ENV, PORT, MONGODB_URI, MONGODB_NAME, JWT_EXPSEC, JWT_SECRET
};

export default env;