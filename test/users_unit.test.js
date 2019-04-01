/* eslint-disable no-undef */
const app = require('../app')
const request = require('supertest')
const assert = require('assert')
const mongoose = require('mongoose')
const config = require('../config')

app.set('port', process.env.PORT || config.port)

mongoose.connect(config.db, (err, res) => {
    if (err) {
        return console.log(`Error connecting to the database: ${err}`)
    }
    console.log('Connection stablished to the database...')

    app.listen(app.get('port'), () => {
        console.log(`API REST running in http://localhost:${config.port}`)
    })
})

describe('## Create User ', function () {
    it('should create a user', function (done) {
        request(app).post('/api/signup').send(user).end(function (err, res) {
            if (err) assert.strictEqual(res.statusCode, 500)
            assert.strictEqual(res.statusCode, 200)
            user = res.body
            done()
        })
    })
})
