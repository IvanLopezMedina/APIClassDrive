const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const users = require('./routes/users')
const country = require('./routes/countries')
const cors = require('cors')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api', users)
app.use('/country', country)

app.use(cors())
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Origin', '*')
})


module.exports = app
