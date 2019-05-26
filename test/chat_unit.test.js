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
    var message = { content: 'contingut', author: 'joan', likes: '0', dislikes: '0', type: 'answer', date: '4' }
    var content = { content: 'contingut del missatge' }
    describe('## Function addMessage', function () {
        it('should add a message', function () {
            request(app).post('/api/addMessage/lis').send(message).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function addMessage', function () {
        it('should get an error we dont sent the content', function () {
            request(app).post('/api/addMessage/lis').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## Function addMessage', function () {
        it('should get an error we dont sent the authot', function () {
            request(app).post('/api/addMessage/lis').send(content).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## Function getMessage', function () {
        it('should get all the messages', function () {
            request(app).get('/api/getMessages/lis').send(content).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})
