import * as crypto from 'crypto'

const initVector = process.env.AFX_SHORT_CRYPT_VCT
const Securitykey = process.env.AFX_SHORT_CRYPT_KEY
const algorithm = 'aes-256-cbc'


export function shortEncrypt (text) {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector)

  let encryptedData = cipher.update(text, 'utf-8', 'hex')
  encryptedData += cipher.final('hex')

  return encryptedData
}


export function shortDecrypt (textEnc) {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector)
  let decryptedData = decipher.update(textEnc, 'hex', 'utf-8')
  decryptedData += decipher.final('utf8')

  return decryptedData
}

export function genRandomString (length) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length)
}


export function hashing (password, salt) {
  try {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(`${+process.env.AFX_EXTEND_CRYPTO_KEY}${password}`)
    let value = hash.digest('hex')

    return {
      salt: salt,
      hash: value
    }
  } catch (er) {
    return null
  }
}

export function encryptPassword (password) {
  let salt = genRandomString(+process.env.AFX_LENGTH_SALT)
  let saltHash = hashing(password, salt)
  return saltHash
}
