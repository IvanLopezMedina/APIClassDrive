/* eslint-disable no-undef */
const app = require('../app')
const request = require('supertest')
const mongoose = require('mongoose')
const config = require('../config')
const assert = require('assert')

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

describe('API Tests', function () {
    describe('# Get all users', function () {
        it('should get all the users', function (done) {
            request(app).get('/api/users').end(function (err, res) {
                if (err) assert.strictEqual(500, res.statusCode)
                assert.strictEqual(200, res.statusCode)
                done()
            })
        })
    })
    var user = { name: 'Ivan', lastname: 'Lopez', email: 'ivancidtofdff@gmail.com', password: 'classdrive', displayname: 'WedffdfffF', country: 'Spain' }
    describe('## Create User ', function () {
        it('should create a user', function (done) {
            request(app).post('/api/signup').send(user).end(function (err, res) {
                if (err) assert.strictEqual(500, res.statusCode)
                assert.strictEqual(200, res.statusCode)
                assert.strictEqual(res.body.user.name, 'Ivan')
                done()
            })
        })
    })
    describe('## Get group by name', function () {
        it('should find the  group', function (done) {
            request(app).get('/api/groupsname/olaf').end(function (err, res) {
                if (err) assert.strictEqual(500, res.statusCode)
                assert.strictEqual(200, res.statusCode)
                done()
            })
        })
    })
    describe('## Create group by name ', function () {
        it('should send and error, the name doesnt exist', function (done) {
            request(app).get('/api/groupname/noexisteix').end(function (err, res) {
                if (err) assert.strictEqual(200, res.statusCode)
                assert.strictEqual(404, res.statusCode)
                done()
            })
        })
    })
})
