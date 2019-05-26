const Forum = require('../models/forum')
const User = require('../models/user')
const fs = require('fs')
const moment = require('moment')

const createForum = (groupName) => {
    if (groupName == null || groupName === '') {
        return ['Error, groupName is empty', 400, false]
    } else {
        var forum = new Forum.Forum()
        forum.groupName = groupName
        forum.save((err) => {
            if (err) return [`Error creating the forum: ${err} `, 500, false]
        })
        return ['', 200, true]
    }
}

const addPost = (req, cb) => {
    var valid = validPost(req)
    if (valid[1]) {
        let groupName = req.params.groupName
        Forum.Forum.findOne({ groupName: groupName }, (err, forum) => {
            if (err) cb(new Error(`Error retrieving data: ${err}`, false))
            if (!forum) cb(new Error(`Forum doesn't exist`, false))
            else {
                let post = new Forum.Post()
                post.content = req.body.content
                post.date = req.body.date
                post.author = req.body.author
                post.likes = req.body.likes
                post.dislikes = req.body.dislikes
                forum.posts.push(post)
                forum.save((err) => {
                    if (err) cb(new Error(`Error creating post: ${err}`, false))
                    cb(new Array('', true))
                })
            }
        })
    } else {
        cb(new Array(valid[0], false))
    }
}

const addAnswer = (req, cb) => {
    let answer = new Forum.Answer()
    let query
    answer.answer = req.body.content
    answer.author = req.body.author
    answer.date = req.body.date
    answer.likes = req.body.likes
    answer.dislikes = req.body.dislikes

    if (!req.body.postId) query = { groupName: req.params.groupName, 'posts.author': req.body.replies[0].author, 'posts.date': req.body.replies[0].date, 'posts.content': req.body.replies[0].reply }
    else query = { groupName: req.params.groupName, 'posts._id': req.body.postId }
    Forum.Forum.findOneAndUpdate(query, { $push: { 'posts.$.answers': answer } }, (err, forum) => {
        if (err) cb(new Error(`Error retrieving data: ${err}`, false))
        if (forum) cb(new Array('Answer added correctly', true))
    })
}

const addPostResp = (req, res) => { // Funcion para añadir preguntas a traves de Forum en vez de Chat (ruta sigue siendo la misma)
    addPost(req, function (correctAdded) {
        if (!correctAdded[1]) {
            return res.status(404).send({ message: correctAdded[0] })
        }
        return res.status(200).send({ message: 'Post created successfully' })
    })
}

const addAnswerResp = (req, res) => { // Funcion para añadir respuestas a una pregunta desde Forum en vez de Chat (ruta sigue siendo la misma)
    addAnswer(req, function (correctAdded) {
        if (!correctAdded[1]) {
            return res.status(404).send({ message: correctAdded[0] })
        }
        return res.status(200).send({ message: 'Answer created successfully' })
    })
}

const validPost = function (req) {
    let content = req.body.content
    let author = req.body.author
    if (content == null || content === '') return [`Error content is empty`, false]
    else if (author == null || author === '') return [`Error author is empty`, false]
    return ['', true]
}

const getPosts = (req, res) => {
    Forum.Forum.findOne({ groupName: req.params.groupName }, { _id: 0, 'posts._id': 1, 'posts.content': 1, 'posts.author': 1, 'posts.date': 1, 'posts.answers': 1 }, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        let usersDataUpdated = []
        let itemsProcessed = 0
        if(forum.posts.length !== 0) {
            let completed = new Promise((resolve, reject) => {
            forum.posts.forEach((value, index, array) => {
                new Promise((resolve, reject) => {
                    User.find({displayname: value.author}, {_id:0, avatar:1}, (err, userData) => {
                        if (err) return res.status(409).send({ msg: `Error retrieving data: ${err}` })
                        if (!userData) return res.status(404).send({ msg: `No users: ${err}` })
                        new Promise((resolve, reject) => {
                            let avatar = userData[0].avatar
                            let avatarSplitted = avatar.split("//")
                            if(avatarSplitted[0] === "https:") {
                                let valueUpdated = userData[0].toObject()
                                valueUpdated.type = "avt"
                                resolve(valueUpdated)
                            }
                            else {
                                fs.readFile('./profiles/' + userData[0].avatar, 'base64', (err, base64Image) => {
                                    if(err) return res.status(409).send({ msg: `Error retrieving data: ${err}` })
                                    let valueUpdated = userData[0].toObject()
                                    valueUpdated.avatar = `data:image/jpeg;base64, ${base64Image}`
                                    valueUpdated.type = "img"
                                    resolve(valueUpdated)
                                })
                            }
                        }).then(result => {
                            resolve(result)
                        })
                    })
                    }).then(result => {
                        itemsProcessed++
                        let valueUpdated = value.toObject()
                        valueUpdated.type = result.type
                        valueUpdated.avatar = result.avatar
                        usersDataUpdated.push(valueUpdated)
                        if(itemsProcessed === array.length) {
                            resolve(usersDataUpdated)
                        }
                    })
                })
            })
            completed.then( result => {
                
                result.sort((left, right) => {
                    return moment.utc(left.date, 'MMMM Do YYYY, h:mm:ss a').diff(moment.utc(right.date , 'MMMM Do YYYY, h:mm:ss a'))
                })
                return res.status(200).send(result)
            }) 
        } 
        else {
            return res.status(200).send(forum.posts)
        } 
    })
}

const getPost = (req, res) => {
    let gn = req.params.groupName
    let postId = req.body.postId
    Forum.Forum.findOne({ groupName: gn }, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        let post = forum['posts'].id(postId)
        if (post == null) {
            return res.status(404).send({ message: `Post doesn't exist` })
        } 
        let usersDataUpdated = []
        let itemsProcessed = 0
        if(post.answers.length !== 0) {
            let completed = new Promise((resolve, reject) => {
                    post.answers.forEach((value, index, array) => {
                    new Promise((resolve, reject) => {
                        User.find({displayname: value.author}, {_id:0, avatar:1}, (err, userData) => {
                            if (err) return res.status(409).send({ msg: `Error retrieving data: ${err}` })
                            if (!userData) return res.status(404).send({ msg: `No users: ${err}` })
                            new Promise((resolve, reject) => {
                                let avatar = userData[0].avatar
                                let avatarSplitted = avatar.split("//")
                                if(avatarSplitted[0] === "https:") {
                                    let valueUpdated = userData[0].toObject()
                                    valueUpdated.type = "avt"
                                    resolve(valueUpdated)
                                }
                                else {
                                    fs.readFile('./profiles/' + userData[0].avatar, 'base64', (err, base64Image) => {
                                        if(err) return res.status(409).send({ msg: `Error retrieving data: ${err}` })
                                        let valueUpdated = userData[0].toObject()
                                        valueUpdated.avatar = `data:image/jpeg;base64, ${base64Image}`
                                        valueUpdated.type = "img"
                                        resolve(valueUpdated)
                                    })
                                }
                            }).then(result => {
                                resolve(result)
                            })
                        })
                        }).then(result => {
                            itemsProcessed++
                            let valueUpdated = value.toObject()
                            valueUpdated.type = result.type
                            valueUpdated.avatar = result.avatar
                            usersDataUpdated.push(valueUpdated)
                            if(itemsProcessed === array.length) {
                                resolve(usersDataUpdated)
                            }
                        })
                    })
            })
            completed.then( result => {   
                result.sort((left, right) => {
                    return moment.utc(left.date, 'MMMM Do YYYY, h:mm:ss a').diff(moment.utc(right.date , 'MMMM Do YYYY, h:mm:ss a'))
                })
                post.answers = result 
                return res.status(200).send(post)
            })
        } 
        else {
            return res.status(200).send(post)
        } 
    })
}

function getImage (fileName, callback) {
    fs.readFile('./profiles/' + fileName, 'base64', (err, base64Image) => {
        if (err) console.error('Error')
        return callback(base64Image)
    })
}

const deleteForum = function (name) {
    Forum.Forum.findOneAndRemove({ groupName: name }, (err, forum) => {
        if (err) return { message: `Error deleting the forum: ${err}` }
        return { message: 'The forum has been deleted successfully' }
    })
}

const updateForum = (req, res) => {
    let groupName = req.params.groupName
    Forum.Forum.updateOne({ groupName: groupName }, { $set: { groupName: req.body.groupName, posts: req.body.posts } }, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum does not exist` })
        else return res.status(200).send({ forum: forum })
    })
}

const deleteForumElement = function (req, res) {
    let group = req.params.groupName
    let postId = req.body.postId
    // If the element is a post
    if (postId == null) {
        Forum.Forum.updateOne({ groupName: group }, { $pull: { 'posts': { '_id': req.body.idToDelete } } }, (err, forum) => {
            if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
            if (!forum) return res.status(404).send({ message: `Forum does not exist` })
            return res.status(200).send({ message: 'Post deleted correctly' })
        })
    } else {
        // If the element is an answer
        Forum.Forum.updateOne({ groupName: group, 'posts._id': postId }, { $pull: { 'posts.$.answers': { '_id': req.body.idToDelete } } }, (err, forum) => {
            if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
            if (!forum) return res.status(404).send({ message: `Forum does not exist` })
            return res.status(200).send({ message: 'Answer deleted correctly' })
        })
    }
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    addAnswer,
    addAnswerResp,
    addPostResp,
    createForum,
    deleteForum,
    updateForum,
    deleteForumElement,
    getImage
}
