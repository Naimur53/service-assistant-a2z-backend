var express = require('express')
var router = express.Router()

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
})
// define the home page route
router.get('/', function (req, res) {
    res.send('Server is running ')
})
// define the about route
router.get('/about', function (req, res) {
    res.send('About birds')
})

module.exports = router