const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new Schema({
    author: String,
    date: { type: Date, default: Date.now() },
    comment: String,
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
    comments: [commentSchema]
})

const ForumSchema = new Schema({
    groupName: String,
    posts: [postSchema]
})

const Forum = mongoose.model('forum', ForumSchema)
module.exports = Forum
