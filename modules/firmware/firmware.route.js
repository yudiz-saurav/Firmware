const router = require('express').Router()
const multer = require('multer')
const {status, jsonStatus, messages} = require('../../helper/api.responses')
const {pick,upload, removeNull,catchError} = require('../../helper/utilities.services')
const { Firmware } = require('../../models')
const {exists} = require('fs')
const fs = require('fs')
const { Op } = require("sequelize")


router.post('/firmware/addFirmware', upload.single('filePath'),async (req,res,next)=>{
    try{
        req.body = pick(req.body, ['version','releaseNote','filePath', 'states'])
        removeNull(req.body)
        const {states, version} = req.body
        req.body.filePath = req.file.originalname
        req.body.states = states.toUpperCase()
        const firmwareExist = await Firmware.findOne({where:{ version}})
        if (firmwareExist) return res.status(status.ResourceExist).json({ status: jsonStatus.ResourceExist, message: messages.English.exist.replace('##', messages.English.version) })
        const firmware = await Firmware.create(req.body,{ raw :true})
        return res.status(status.OK).json({ status: jsonStatus.OK, message: messages.English.add_success.replace('##', firmware.dataValues.version), data: { firmware } })
    }catch(error){
        catchError('firmware.addFirmware', error, req, res)
    }
})

router.get('/firmware/downloadFirmware',async (req,res,next)=>{
    try{

        const {fileName} = req.query
        var filePath = `./uploads/${fileName}`
        fs.exists(filePath,function(isExist){
            if(isExist){
                var fileNames = `${fileName}`
                res.download(filePath, fileNames);
            }
            else{
                return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages.English.not_exist.replace('##', messages.English.file) })
            }
        })
    }catch(error){
        catchError('firmware.downloadFirmware', error, req, res)
    }
})


router.get('/firmware/getFirmware',async(req,res,next)=>{
    try{
      const { page = 1, pageSize = 10,search, fromDate, toDate } = req.query
      let whereQuery = {
        
      }
      if(search){
        whereQuery[Op.or] = {
            version:{
                [Op.iLike] : `%${search}%`
            },
            releaseNote:{
                [Op.iLike] : `%${search}%`
            }
        }
      }

      if(fromDate && toDate){
        whereQuery[Op.and] = {
            createdAt:{
                [Op.gte]: fromDate,
                [Op.lte]: toDate
            }
        }
      }
      offset = (page-1)*pageSize
      limit = pageSize
    const data = await Firmware.findAndCountAll({limit, offset,order:[["createdAt","DESC"]],where:whereQuery})
    if(!data || data.count===0) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages.English.not_found})
    console.log(data)
    return res.status(status.OK).json({ status: jsonStatus.OK, message: messages.English.fetch_success, data })
    }catch(error){
        catchError('firmware.getFirmware', error, req, res)
    }
})
module.exports = router