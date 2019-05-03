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
    var BodyPost = { posts: 'Examen', title: 'Examen1', date: '27/04/19', author: 'Joan', likes: '4', dislikes: '0' }
    var update = { groupName: 'groupnou' }
    var forum = { forumId: '5cc098f0d6cd2827a0761eee' }
    describe('## Function getPosts', function () {
        it('should get all the posts', function () {
            request(app).get('/api/posts/5cc0499588a9b75c64985136').end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
                expect(res.body).to.be.an('array')
            })
        })
    })
    describe('## getPost', function () {
        it('should send an error because the id doesnt exist', function () {
            request(app).post('api/post/5cc0499588a9b75c64985136').send(forum).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(200)
                assert.strictEqual(res.statusCode, 500)
            })
        })
    })
    describe('## deleteForum', function () {
        it('should delete a forum', function () {
            request(app).delete('/api/deleteForumElement/5cc0499588a9b75c64985136').send(BodyPost).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## updateForum', function () {
        it('should update a forum', function () {
            request(app).put('/api/updateForum/5cc098f0d6cd2827a0761eee').send(update).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
    describe('## AddPost', function () {
        it('should add a post', function () {
            request(app).post('/api/addPost/5cc0499588a9b75c64985136').send(BodyPost).end(function (err, res) {
                if (err) expect(res.statusCode).to.equal(500)
                assert.strictEqual(res.statusCode, 200)
            })
        })
    })
})
