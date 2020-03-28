import fs from 'fs'

const privateKey = fs.readFileSync(`${__dirname}/../../private.key`, 'utf8')
const publicKey = fs.readFileSync(`${__dirname}/../../public.key`, 'utf8')

export const keys = {
  private: privateKey,
  public: publicKey,
}

export default keys
