export const genError = (message, intmsg, status = 500) => {
    let newError = new Error(message);
    newError.intmsg = intmsg;
    newError.status = status;

    return newError;
}