const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const ForumSchema = new Schema({
    groupName: String,
    posts: {
        title: String,
        date: Date,
        author: String,
        likes: Number,
        dislikes: Number,
        userFavs: [ObjectId],
        comments: {
            author: String,
            date: Date,
            comment: String,
            likes: Number,
            dislikes: Number
        }
    }

})

module.exports = mongoose.model('Forum', ForumSchema)
