const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const users = require('./routes/users')
const country = require('./routes/countries')
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', users)
app.use('/api', country)

app.use(cors())

app.all('/api/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With')
    res.header('Access-Control-Allow-Methods", "GET, PUT, POST')
    return next()
})

module.exports = app
