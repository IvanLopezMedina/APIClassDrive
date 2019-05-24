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

describe('API Tests', function () {
    var nameinvented = 'noexisteix'
    var namegroup = 'fsaaa'
    var search = ' hola'
    var bodyincorrect = { groupId: '8b2116', userId: '5ca241' }
    var subscribe = { groupId: '5c98b2116c3e6d3eac21142d', userId: '5cdd480f3a8345585817b7e7', name: 'polla' }
    var userId = '5ca2432f8414b839dc090e63'
    var usereliminate = '5cc04781247a55910c601e99'
    var groupPublic = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'public' }
    var groupPrivate = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'private', password: '12345678' }
    var groupPrivateWithoutPass = { name: 'lis', center: 'uab', tags: 'informàtica', visibility: 'private' }
    describe('## Function createGroup ', function () {
        it('should create a public group', function () {
            request(app).post('/api/groups').send(groupPublic).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
                groupPublic = res.body
            })
        })
    })
    describe('## Function createGroup', function () {
        it('should send error 403 because we dont send the password', function () {
            request(app).post('/api/groups').send(groupPrivateWithoutPass).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 403)
                groupPrivateWithoutPass = res.body
            })
        })
    })
    describe('## Function createGroup ', function () {
        it('should create a private group', function () {
            request(app).post('/api/groups').send(groupPrivate).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
                groupPrivate = res.body
            })
        })
    })
    describe('# Function getGroup ( POST )', function () {
        it('should get an empty array', function () {
            request(app).post('/api/getgroups').send(userId).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('# Function SearchGroup', function () {
        it('should send an error because we dont send search', function () {
            request(app).post('/api/getgroups').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('# Function SearchGroup', function () {
        it('should get the array with the tags', function () {
            request(app).post('/api/getgroups').send(search).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('# Function getGroupwithSearch', function () {
        it('should send an error because we dont send search', function () {
            request(app).post('/api/getgroupswithsearch').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('# Function getGroupwithSearch', function () {
        it('should get the array with the tags', function () {
            request(app).post('/api/getgroupswithsearch').send(search).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    // Aquesta funcio diu si admin si existeix el grup, sino diu no Admin, no te molt de sentit crec
    // crec que lo del asssert del missatge no ho agafa be.
    describe('# Function isAdmin', function () {
        it('should send a message : Not admin', function () {
            request(app).post('/api/isadmin/nom_no_existeix').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
                assert.strictEqual(res.body.message, 'Not Admin')
            })
        })
    })
    describe('# Function isAdmin', function () {
        it('should send a message :  Admin', function () {
            request(app).post('/api/isadmin/fsaaa').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
                assert.strictEqual(res.body.message, 'Admin')
            })
        })
    })
    describe('# Function getGroups', function () {
        it('should get all the groups', function () {
            request(app).get('/api/groups').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
                expect(res.body).to.be.an('array')
            })
        })
    })
    describe('# Function getGroups ( GET )', function () {
        it('should get all the groups', function () {
            request(app).get('/api/groups').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
                expect(res.body).to.be.an('array')
            })
        })
    })
    describe('## Function GetGroup', function () {
        it('should give and error because the id doesnt exist', function () {
            request(app).get('/api/groups/hola').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
    describe('## Function DeleteGroup ', function () {
        it('should delete a private group', function () {
            request(app).delete('/api/groups/5cacc71a752a0156c0178e07').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function DeleteGroup ', function () {
        it('should send an error because the id doesnt exist', function () {
            request(app).delete('/api/groups/idnoexisteixi').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## Function getGroupName ', function () {
        it('should send and error because doesnt exist a group with that name', function () {
            request(app).get('/api/groupsname').send(nameinvented).end(function (err, res) {
                if (err) expect(es.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
    describe('## Function getGroupName ', function () {
        it('should send the group', function () {
            request(app).get('/api/groupsname').send(namegroup).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function getUsers ', function () {
        it('should send all the users of a group', function () {
            request(app).get('/api/groupusers/5c98b2116c3e6d3eac21142d').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
                expect(res.body).to.be.an('array')
            })
        })
    })
    describe('## Function getUsers ', function () {
        it('should send an error because the group doesnt exist', function () {
            request(app).get('/api/groupsusers/idnoexisteix').send(namegroup).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
    // No se perque falla perque el postman funciona
    describe('## Function Subscribe  ', function () {
        it('should subscribe ', function () {
            request(app).put('/api/subscribe').send(subscribe).end(function (err, res) {
                if (err) assert.strictEqual(404, res.statusCode)
                assert.strictEqual(200, res.statusCode)
            })
        })
    })
    describe('## Function Subscribe ', function () {
        it('should send an error because the body is incorrect', function (done) {
            request(app).put('/api/subscribe').send(bodyincorrect).end(function (err, res) {
                if (err) assert.strictEqual(200, res.statusCode)
                assert.strictEqual(409, res.statusCode)
                done()
            })
        })
    })
    describe('## Function UnSubscribe ', function () {
        it('should send an error because the body is incorrect', function (done) {
            request(app).put('/api/unsubscribe/dfadf65').send(bodyincorrect).end(function (err, res) {
                if (err) assert.strictEqual(200, res.statusCode)
                assert.strictEqual(409, res.statusCode)
                done()
            })
        })
    })
    describe('## Function UnSubscribe ', function () {
        it('should eliminate a user', function () {
            request(app).put('/api/unsubscribe/5c98b2116c3e6d3eac21142d').send(usereliminate).end(function (err, res) {
                if (err) assert.strictEqual(404, res.statusCode)
                assert.strictEqual(200, res.statusCode)
                done()
            })
        })
    })
})
