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
    var user = { name: 'Ivan', lastname: 'Lopez', email: 'abc@gmail.com', password: 'classdrive', displayname: 'WTF', country: 'Spain' }
    var groupPublic = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'public' }
    var groupPrivate = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'private', password: '12345678' }
    var groupPrivateWithoutPass = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'private' }
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
    describe('# Get all groups', function () {
        it('should get all the groups', function (done) {
            request(app).get('/api/groups').end(function (err, res) {
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
    describe('## Create GroupPublic ', function () {
        it('should create a public group', function (done) {
            request(app).post('/api/groups').send(groupPublic).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                expect(res.statusCode).to.equal(200)
                groupPublic = res.body
                done()
            })
        })
    })
    describe('## Create GroupPrivate without password ', function () {
        it('should send error 403', function (done) {
            request(app).post('/api/groups').send(groupPrivateWithoutPass).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                expect(res.statusCode).to.equal(403)
                groupPrivateWithoutPass = res.body
                done()
            })
        })
    })
    describe('## Create GroupPrivate ', function () {
        it('should create a private group', function (done) {
            request(app).post('/api/groups').send(groupPrivate).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                expect(res.statusCode).to.equal(200)
                groupPrivate = res.body
                done()
            })
        })
    })
})
