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
    describe('## Function getFiles', function () {
        it('should get all the files', function () {
            request(app).get('/api/getfiles/lis').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function getFiles', function () {
        it('should get an error because the name doesnt exist', function () {
            request(app).get('/api/getfiles/groupnameinvented').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
    describe('## Function getFile', function () {
        it('should get the file by the fileId', function () {
            request(app).get('/api/getfile/5cb848ef2ecdb21e6463bf67').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function getFile', function () {
        it('should get an error because the id doesnt exist', function () {
            request(app).get('/api/getfile/noexisteix').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 404)
            })
        })
    })
    describe('## Function addFile', function () {
        it('should add a file', function () {
            request(app).post('/api/addFile/lis').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Function deleteFile', function () {
        it('should delete a file', function () {
            request(app).put('/api/deleteFile/lis').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(404)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})
