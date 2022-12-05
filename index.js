const express = require('express')
const bodyParser = require('body-parser')
const app  = express()
const cors = require('cors')
const models = require('./models/index')
require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

require('./modules/routes')(app)

app.listen(3000,()=>{
    console.log('server started')
})