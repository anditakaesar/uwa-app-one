export const genError = (message, intmsg, status = 500) => {
  const newError = new Error(message)
  newError.intmsg = intmsg
  newError.status = status

  return newError
}

export const isBodyValid = (value) => {
  if (value === undefined || value === null || value === '') {
    return false
  }
  return true
}
