/* eslint-disable no-undef */
const app = require('../app')
const chai = require('chai')
const request = require('supertest')
const expect = chai.expect

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

describe('API Tests', function () { 
    var user = { name: 'Ivan', lastname: 'Lopez', email: 'ivan.lopez.medina.ilm@gmail.com', password: 'classdrive', displayname: 'WTF', country: 'Spain' }
    describe('# Get all tasks', function () {
        it('should get all the users', function (done) {
            request(app).get('/api/users').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                expect(res.statusCode).to.equal(200)
                expect(res.body).to.be.an('array')
                done()
            })
        })
    })

    describe('## Create User ', function () { 
        it('should create a user', function (done) { 
            request(app).post('/api/signup').send(user).end(function (err, res) { 
                if (err) expect(res.statusCode).to.equal(500)
                expect(res.statusCode).to.equal(200)
                user = res.body
                done()
            })
        })
    })
})
