const mongoose = require('mongoose')
const moment = require('moment');
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId

const replySchema = new Schema({   
    idMessage: ObjectId,                        
    author: String, 
    reply: String,
    date: String
    },
{ versionKey: false
})

const messageSchema = new Schema({
    content: String,
    date: String,
    author: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [replySchema],
    type: String
    },
{ versionKey: false
})


const chatSchema = new Schema({
    groupName: String,
    messages: [messageSchema]
    },
{ versionKey: false
})

const Chat = mongoose.model('chat', chatSchema)
const Message = mongoose.model('message', messageSchema)
const Reply = mongoose.model('reply', replySchema)
module.exports = {
    Chat,
    Message,
    Reply  
}