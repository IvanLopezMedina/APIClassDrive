/* eslint-disable no-undef */
const app = require('../app')
const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
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

describe('LimitValuesGroups', function () {
    var grup7 = { name: 'grup', password: '1234567', visibility: 'private', user: '5ca1e17220754057bc6c00e5' }
    var grup8 = { name: 'grup', password: '12345678', visibility: 'private', user: '5ca1e17220754057bc6c00e5' }
    var grup9 = { name: 'grup', password: '123456789', visibility: 'private', user: '5ca1e17220754057bc6c00e5' }
    describe('## Function creategrup', function () {
        it('should send an error because the password has 7 characters', function () {
            request(app).get('/api/groups').send(grup7).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
    describe('## Function creategrup', function () {
        it('should create a group', function () {
            request(app).get('/api/groups').send(grup8).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function creategrup', function () {
        it('should create a group', function () {
            request(app).get('/api/groups').send(grup9).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})

describe('LimitValuesUser', function () {
    var user7 = { name: 'grup', password: '1234567', displayname: 'jo', email: 'jp@gmail.com', lastname: 'abracadabra' }
    var user8 = { name: 'goaasfa', password: '12345678', displayname: 'johanrr', email: 'rofsfl@gmail.com', lastname: 'joauq' }
    var user9 = { name: 'jopa', password: '123456789', displayname: 'johanson', email: 'ca@gmail.com', lastname: 'magoocor' }
    describe('## Function signup', function () {
        it('should send an error because the password has 7 characters', function () {
            request(app).post('/api/signup').send(user7).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function signup', function () {
        it('should create a user', function () {
            request(app).post('/api/signup').send(user8).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function signup', function () {
        it('should create a user', function () {
            request(app).post('/api/signup').send(user9).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})
describe('Atributs Required User', function () {
    var withoutname = { password: '1234567', displayname: 'jo', email: 'jp@gmail.com', lastname: 'abracadabra' }
    var withoutpassword = { name: 'goaasfa', displayname: 'johanrr', email: 'rofsfl@gmail.com', lastname: 'joauq' }
    var withoutdisplay = { name: 'jopa', password: '123456789', email: 'ca@gmail.com', lastname: 'magoocor' }
    var withoutemail = { name: 'jopa', password: '123456789', displayname: 'johanson', lastname: 'magoocor' }
    var withoutlastname = { name: 'jopa', password: '123456789', displayname: 'johanson', email: 'ca@gmail.com' }
    describe('## Function signup', function () {
        it('should send an error because the lastname', function () {
            request(app).post('/api/signup').send(withoutlastname).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function signup', function () {
        it('should send an error because the displayname', function () {
            request(app).post('/api/signup').send(withoutdisplay).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function signup', function () {
        it('should send an error because the name', function () {
            request(app).post('/api/signup').send(withoutname).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function signup', function () {
        it('should send an error because the email', function () {
            request(app).post('/api/signup').send(withoutemail).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function signup', function () {
        it('should send an error because the password', function () {
            request(app).post('/api/signup').send(withoutpassword).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
})
describe('Atributs Required Group', function () {
    var withoutname = { password: '1234567', visibility: 'private', user: '5ca1e17220754057bc6c00e5' }
    var withoutuser = { name: 'grup', password: '1234567', visibility: 'private' }
    var withoutvisibility = { name: 'grup', password: '12345678', user: '5ca1e17220754057bc6c00e5' }
    describe('## Function creategroup', function () {
        it('should send an error because the lastname', function () {
            request(app).post('/api/groups').send(withoutname).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## Function creategroup', function () {
        it('should send an error because the displayname', function () {
            request(app).post('/api/groups').send(withoutuser).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## Function creategroup', function () {
        it('should send an error because the name', function () {
            request(app).post('/api/groups').send(withoutvisibility).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
})
