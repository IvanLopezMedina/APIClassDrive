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
