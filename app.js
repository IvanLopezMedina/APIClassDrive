const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const users = require('./routes/users')
const country = require('./routes/countries')
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use('/api', users)
app.use('/api', country)

module.exports = app
