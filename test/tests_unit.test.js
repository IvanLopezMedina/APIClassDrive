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
    var test2 = { name: 'Test1', user: 'cris', groupName: 'Cristina' }
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
            request(app).post('/api/tests/addtest').send(test2).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 409)
            })
        })
    })
})
