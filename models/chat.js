const mongoose = require('mongoose')
const Schema = mongoose.Schema

const chatSchema = new Schema({
    groupName: String,
    messages: []         
    },
{ versionKey: false
})

const Chat = mongoose.model('chat', chatSchema)
module.exports = {
    Chat
}
