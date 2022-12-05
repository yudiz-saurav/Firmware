const { pick, removeNull, isValidEmail, isValidPassword, isValidName, isValidMobile, catchError } = require('../../helper/utilities.services')
const { status, messages, jsonStatus } = require('../../helper/api.responses')
const {Firmware} = require('../../models/firmware')

const validators = {}

validators.addAdmin = (req, res, next) => {
  try {
    req.body = pick(req.body, ['version','releaseNote'])
    removeNull(req.body)
    const { sName, sEmail, sPassword, sUsername, sMobNum } = req.body
    console.log({ ...req.body })
    if (!sEmail && !sName && !sPassword && !sMobNum && !sUsername) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.all_fields) })
    if (!sEmail) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.email) })
    if (!isValidEmail(sEmail)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.email) })
    if (!sPassword) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.password) })
    if (!isValidPassword(sPassword)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.password) })
    if (!sName) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.name) })
    if (!isValidName(sName)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.name) })
    if (!sMobNum) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.mobileNumber) })
    if (!isValidMobile(sMobNum)) return res.status(status.BadRequest).json({ message: messages.English.invalid.replace('##', messages.English.mobileNumber) })
    if (!sUsername) return res.status(status.BadRequest).json({ message: messages.English.required.replace('##', messages.English.username) })
    console.log('hey')
    next()
  } catch (error) {
    return catchError('InternalServerError', error, req, res)
  }
}


module.exports = validators
