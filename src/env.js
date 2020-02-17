export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT) || 3000;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
export const MONGODB_NAME =process.env.MONGODB_NAME || 'uwaappone-test';

const env = {
    NODE_ENV, PORT, MONGODB_URI, MONGODB_NAME
};

export default env;