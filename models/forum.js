const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new Schema({
    author: String,
    date: String,
    answer: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    idMessage: ObjectId
})

const postSchema = new Schema({
    content: String,
    date: String,
    author: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    answers: [answerSchema]
})

const ForumSchema = new Schema({
    groupName: String,
    posts: [postSchema]
},
{ versionKey: false
})

const Forum = mongoose.model('forum', ForumSchema)
const Answer = mongoose.model('answer', answerSchema)
const Post = mongoose.model('post', postSchema)
module.exports = {
    Forum,
    Answer,
    Post
}

