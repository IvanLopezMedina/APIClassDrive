/* eslint-disable no-undef */
const app = require('../app')
const request = require('supertest')
const assert = require('assert')
const mongoose = require('mongoose')
const config = require('../config')
const User = require('../models/user')

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
    var modificacio = { lastname: 'lop' }
    describe('## Function getUsers', function () {
        it('should get all the users', function () {
            request(app).get('/api/users').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Functions getUser', function () {
        it('should get the user by the userId', function () {
            request(app).get('api/users/5ca241ee7f2cea0c10ab6af9').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })

    describe('## Functions getImage', function () {
        it('should get the image', function () {
            request(app).get('api/users/getimage/filename').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Functions updateUser', function () {
        it('should update the user', function () {
            request(app).put('api/users/5ca241ee7f2cea0c10ab6af9').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Functions updateAvatar', function () {
        it('should update the avatar', function () {
            request(app).put('api/users/updateavatar/lopeeez').send(modificacio).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## Functions deleteUser', function () {
        it('should delete the user', function () {
            request(app).delete('api/users/5ca241ee7f2cea0c10ab6af9').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(409)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})

describe('User Tests', function () {
    describe('## Create User ', function () {
        var user = { name: 'Ivan', lastname: 'Lopez', email: 'delete@classdrive.com', password: 'classdrive', displayname: 'deleted', country: 'Spain' }
        it('should create a user', function (done) {
            request(app).post('/api/signup').send(user).end(function (err, res) {
                if (err) {
                    assert.strictEqual(res.statusCode, 409)
                } else {
                    assert.strictEqual(res.statusCode, 200)
                    user = res.body
                    done()
                    User.findOne({ email: 'delete@classdrive.com' }, (err, user) => {
                        if (err) assert.strictEqual(res.statusCode, 409)
                        console.log(user)
                        var userupdated = { name: 'Ivan' }
                        describe('## Edit User ', function () {
                            it('should edit a user', function (done) {
                                request(app).put(`/api/users/${user._id}`).send(userupdated).end(function (err, res) {
                                    if (err) {
                                        assert.strictEqual(res.statusCode, 409)
                                    } else assert.strictEqual(res.statusCode, 200)
                                    done()
                                })
                            })
                        })
                        describe('## Delete User ', function () {
                            it('should delete a user', function (done) {
                                request(app).delete(`/api/users/${user._id}`).send().end(function (err, res) {
                                    if (err) {
                                        assert.strictEqual(res.statusCode, 409)
                                    } else assert.strictEqual(res.statusCode, 200)
                                    done()
                                })
                            })
                        })
                    })
                }
            })
        })
    })
})
