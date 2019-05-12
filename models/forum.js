const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema({
    author: String,
    date: String,//{ type: Date, default: Date.now() },
    answer: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    avatar: String
})

const postSchema = new Schema({
    content: String,
    date: String,//{ type: Date, default: Date.now() },
    author: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    answers: [answerSchema],
    avatar: String
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
