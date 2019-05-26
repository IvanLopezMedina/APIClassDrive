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
    var test = { name: 'Test1', user: 'cris', groupName: 'Cristina', question: 'ola k ase?', answer: 'answer', correctAnswer: 'answer' }
    var testNoQuestion = { name: 'Test1', user: 'cris', groupName: 'Cristina' }
    var testNoName = { user: 'cris', groupName: 'Cristina', question: 'ola k ase?', answer: 'answer', correctAnswer: 'answer' }
    var editTest = { name: 'testEdited', user: 'cris', groupName: 'Cristina', question: 'question edited', answer: 'answer edited', correctAnswer: 'answer edited' }

    // Add test
    describe('## Function addTest', function () {
        it('should add test', function () {
            request(app).post('/api/tests/addtest').send(test).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Function addTest', function () {
        it('should return error: question is required', function () {
            request(app).post('/api/tests/addtest').send(testNoQuestion).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    describe('## Function addTest', function () {
        it('should return error: name is required', function () {
            request(app).post('/api/tests/addtest').send(testNoName).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    // Get all Tests
    describe('## Function getAllTest', function () {
        it('should return all tests of a group', function () {
            request(app).get('/api/tests/alltests/Cristina').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Function getAllTest', function () {
        it('should return error: groupName is required', function () {
            request(app).get('/api/tests/alltests').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    describe('## Function getAllTest', function () {
        it('should return error: group does not exist', function () {
            request(app).get('/api/tests/alltests/hmnbnm').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    // Get Test
    describe('## Function getTest', function () {
        it('should return a test', function () {
            request(app).get('/api/tests/test/5cdd570c81f6d433b07ec92d').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Function getTest', function () {
        it('should return error: testId is required', function () {
            request(app).get('/api/tests/test').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    describe('## Function getTest', function () {
        it('should return error: test does not exist', function () {
            request(app).get('/api/tests/test/5cdd570c81f6d433b07ec911').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    // Edit test
    describe('## Function editTest', function () {
        it('should edit test', function () {
            request(app).put('/api/tests/edittest/5ce285c1a3374f15589415cb').send(editTest).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Function editTest', function () {
        it('should return error: testId is required', function () {
            request(app).put('/api/tests/edittest').send(editTest).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    describe('## Function editTest', function () {
        it('should return error: test does not exist', function () {
            request(app).put('/api/tests/edittest/dfsdfsdfsdf').send(editTest).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })

    // Delete test
    describe('## Function deleteTest', function () {
        it('should delete test', function () {
            request(app).delete('/api/tests/deletetest/5ce285c1a3374f15589415cb').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Function deleteTest', function () {
        it('should return error: testId is required', function () {
            request(app).put('/api/tests/deletetest').send(editTest).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })

    describe('## Function deleteTest', function () {
        it('should return error: test does not exist', function () {
            request(app).put('/api/tests/deletetest/dfsdfsdfsdf').send(editTest).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
})
