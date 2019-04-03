const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const users = require('./routes/users')
const groups = require('./routes/groups')
const forums = require('./routes/forums')
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use('/api', users)
app.use('/api', groups)
app.use('/api', forums)

module.exports = app
