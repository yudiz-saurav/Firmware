const express = require('express')
const bodyParser = require('body-parser')
const app  = express()
const cors = require('cors')
const path = require('path')
const models = require('./models/index')
require('dotenv').config()
app.use('/static', express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

require('./modules/routes')(app)

app.listen(3000,()=>{
    console.log('server started')
})