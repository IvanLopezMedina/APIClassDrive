const Forum = require('../models/forum')
const mongoose = require('mongoose')

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
            if (err) cb([`Error retrieving data: ${err}`, false])
            if (!forum) cb([`Forum doesn't exist`, false])
            else {
                let post = new Forum.Post()
                post.content = req.body.content
                post.date = req.body.date
                post.author = req.body.author
                post.likes = req.body.likes
                post.dislikes = req.body.dislikes
                forum.posts.push(post)
                forum.save((err) => {
                    if (err) cb([`Error creating post: ${err}`, false])
                    cb(["", true])
                })
            }
        })
    } else {
        cb([valid[0], false])
    }
}

const addAnswer = (req, cb) => {

    let answer = new Forum.Answer()
    answer.answer = req.body.content
    answer.author = req.body.author
    answer.date = req.body.date
    answer.likes = req.body.likes
    answer.dislikes = req.body.dislikes
    //Query for Chat
    if(!req.body.postId) query = {groupName: req.params.groupName,'posts.author': req.body.replies[0].author, 'posts.date': req.body.replies[0].date, 'posts.content': req.body.replies[0].reply}
    //Query for Forum
    else query = {groupName: req.params.groupName,'posts._id': req.body.postId} 
    Forum.Forum.findOneAndUpdate( query, { $push: { 'posts.$.answers': answer } }, (err, forum) => {
        if (err) cb([`Error retrieving data: ${err}`, false])
        if (forum) cb(['Answer added correctly', true])        
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

//////////////////////////////////////////ESTAS FUNCIONES SE TIENEN QUE REVISAR (ABAJO) --> ////////////////////////////////////////////////////////
const getPosts = (req, res) => {
    let groupName = req.params.groupName
    Forum.Forum.findOne(groupName, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        var posts = forum[ 'posts' ]
        res.status(200).send({ posts })
    })
}

const getPost = (req, res) => {
    let groupName = req.body.groupName
    let postId = req.params.postId
    let post
    Forum.Forum.findOne({ groupName: groupName }, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum doesn't exist` })
        for (var i = 0; i < forum['posts'].length; i++) {
            if (forum['posts'][i]['_id'].toString() === postId) {
                post = forum['posts'][i]
                res.status(200).send({ post })
            }
        }
        if (post == null) return res.status(404).send({ message: `Post doesn't exist` })
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
    let groupName = req.params.groupName
    let elementToDelete = req.body.idToDelete
    // Se if element is a post or an answer
    Forum.Forum.findOne({ groupName: groupName }, (err, forum) => {
        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
        if (!forum) return res.status(404).send({ message: `Forum does not exist` })
        else {
            for (var i = 0; i < forum['posts'].length; i++) {
                if (forum['posts'][i]['_id'].toString() === elementToDelete) {
                    forum['posts'].splice(i, 1)
                    forum.save((err) => {
                        if (err) return res.status(500).send({ message: `Error deleting post: ${err}` })
                        return res.status(200).send({ message: 'Post Deleted successfully' })
                    })
                } else {
                    for (var j = 0; j < forum['posts'][i]['answers'].length; j++) {
                        if (forum['posts'][i]['answers'][j]['_id'].toString() === elementToDelete) {
                            forum['posts'][i]['answers'].splice(j, 1)
                            forum.save((err) => {
                                if (err) return res.status(500).send({ message: `Error deleting answer: ${err}` })
                                return res.status(200).send({ message: 'Answer Deleted successfully' })
                            })
                        }
                    }
                }
            }
            return res.status(500)
        }
    })
}

module.exports = {
    getPosts,
    getPost,
    addPost,
    addAnswer,
    addAnswerResp,
    createForum,
    deleteForum,
    updateForum,
    deleteForumElement
}
