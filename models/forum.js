const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new Schema({
    author: String,
    date: { type: Date, default: Date.now() },
    answer: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
})

const postSchema = new Schema({
    title: String,
    date: { type: Date, default: Date.now() },
    author: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    userFavs: [ObjectId],
    answers: [answerSchema]
})

const ForumSchema = new Schema({
    groupName: String,
    posts: [postSchema]
})

const Forum = mongoose.model('forum', ForumSchema)
const Answer = mongoose.model('answer', answerSchema)
const Post = mongoose.model('post', postSchema)
module.exports = {
    Forum,
    Answer,
    Post
}
