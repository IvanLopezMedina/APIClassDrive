const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const users = require('./routes/users')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false}))
app.use('/api', users)

module.exports = app