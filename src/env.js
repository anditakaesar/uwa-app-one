export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT) || 3000;

const env = {
    NODE_ENV, PORT
};

export default env;