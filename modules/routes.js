module.exports = (app) => {

    app.use('/api', [
        require('../modules/firmware/firmware.route')
    ])
 
}