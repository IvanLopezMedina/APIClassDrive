const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new Schema({
    author: String,
    date: { type: Date, default: Date.now() },
    answer: String,
    likes: Number,
    dislikes: Number
})

const postSchema = new Schema({
    title: String,
    post_date: { type: Date, default: Date.now() },
    author: String,
    likes: Number,
    dislikes: Number,
    userFavs: [ObjectId],
    answers: [answerSchema]
})

const ForumSchema = new Schema({
    groupName: String,
    posts: [postSchema]
})

postSchema.methods.postEmpty = function (posts) {
    let empty = false
    if (posts == null) empty = true
    return empty
}

const Forum = mongoose.model('forum', ForumSchema)
const Answer = mongoose.model('answer', answerSchema)
const Post = mongoose.model('post', postSchema)
module.exports = {
    Forum,
    Answer,
    Post
}
