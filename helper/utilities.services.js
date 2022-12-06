const { status, jsonStatus } = require('./api.responses')
const multer = require('multer')
const path = require('path')
const nameRegex = /^[A-Za-z ]+$/
const emailRegex = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'
const mobileRegex = /^[0-9]{10}$/
const passwordRegex = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/

//storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${path.join(__dirname, '../uploads')}`)
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, file.originalname)
  }
})
//multer filter
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.split('/')[1] === 'csv') {
//     cb(null, true)
//   } else {
//     cb(null, false)
//     return new Error('Only CSV file supported')
//   }
// }
// call multer function
const upload = multer({
  storage
  // fileFilter
})

const encodeToken = (data, validity) => {
  const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: validity })
  return token
}

const decodeToken = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    return err ? err.message : decode
  })
}

const catchError = (name, error, req, res) => {
  handleCatchError(error)
  return res.status(status.InternalServerError).json({
    status: jsonStatus.InternalServerError
    //   message: messages[req.userLanguage].error
  })
}

const handleCatchError = (error) => {
  if (process.env.NODE_ENV === 'production') Sentry.captureMessage(error)
  console.log('**********ERROR***********', error)
}

const removeNull = (obj) => {
  for (const objProp in obj) {
    if (obj[objProp] === null || obj[objProp] === undefined || obj[objProp] === '') {
      delete obj[objProp]
    }
  }
}

const isValidStatus = (stats) => {
  if (data.userStatus.includes(stats)) { return true } else { return false }
}

const createRandomId = (length = 7) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

const validMongoId = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) { return true }
  }
  return false
}

const hash = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(10)
  const Hash = await bcrypt.hash(plainTextPassword, salt)
  return Hash
}

const slug = (sName) => {
  const name = sName.trim().toUpperCase().replace(/\s+/g, ' ').split(' ').join('_')
  return name
}
const isValidName = (sName) => {
  return new RegExp(nameRegex).test(sName)
}

const isValidEmail = (sEmail) => {
  return new RegExp(emailRegex).test(sEmail)
}

const isValidMobile = (sMobNum) => {
  return new RegExp(mobileRegex).test(sMobNum)
}

const isValidPassword = (sPassword) => {
  return new RegExp(passwordRegex).test(sPassword)
}

module.exports = { removeNull, pick, upload,slug, catchError, handleCatchError, encodeToken, decodeToken, isValidName, isValidStatus, isValidEmail, isValidMobile, isValidPassword, validMongoId, hash, createRandomId }
