const Chat = require('../models/chat')
const mongoose = require('mongoose')
//const Forum = require('../models/forum')
const Forum = require('../controllers/forums')

const createChat = (groupName) => {
    if (groupName == null || groupName === '') {
        return ['Error, groupName is empty', 400, false]
    } else {
        var chat = new Chat.Chat()
        chat.groupName = groupName
        chat.save((err) => {
            if (err) return [`Error creating the chat: ${err} `, 500, false]
        })
        return ['', 200, true]
    }
}

//MODIFICAR PARA AÑADIR LOS MENSAJES CON EL MODELO MODIFICADO
/*const addMessage = (req, res) => {
    let valid = validMessage(req)
    if (valid[1]) {
        Chat.Chat.findOne({groupName : req.params.groupName}, async function (err, chat) {
            if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
            if (!chat) return res.status(404).send({ message: `Chat doesn't exist` })
            let message = new Chat.Chat() 
            message.content =  req.body.content,
            message.author = req.body.author
            message.likes = req.body.likes
            message.dislikes = req.body.dislikes
            message.type = req.body.type
            message.date = req.body.date
            if(message.type === 'question') {
                    //Add question to Forum
                   Forum.addPost(req, function(correctAdded) {
                        if(!correctAdded[1]) {
                            return res.status(404).send({ message: correctAdded[0] })
                        }
                   })
            }
            else if(message.type === 'reply') {
                let replyMessageId = ""
                let reply = new Chat.Reply()
                if(!req.body.replies[0].messageId) {
                    await Chat.Message.findOne({date: req.body.replies[0].date, author: req.body.replies[0].author, content: req.body.replies[0].reply}, {_id:1}, (err, messageId) => {
                        if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
                        if (!messageId) return res.status(404).send({ message: `Message doesn't exist` })
                        replyMessageId = messageId._id
                    })
                    reply.idMessage = replyMessageId
                }
                else {
                    reply.idMessage = req.body.replies[0].messageId
                }
                reply.date = req.body.replies[0].date
                reply.author = req.body.replies[0].author
                reply.reply = req.body.replies[0].reply
                reply.save((err) => {
                    if (err) return res.status(500).send({ message: `Error saving the reply: ${err}` })
                })
                message.replies.push(reply)
                //Add Question to Answer
                Forum.addAnswer(req, function(correctAdded) {
                    if(!correctAdded[1]) {
                        return res.status(404).send({ message: correctAdded[0] })
                    }
               }) 
            }
            chat.messages.push(message)
            //Add message 
            message.save((err) => {
                if (err) return res.status(500).send({ message: `Error saving the question: ${err}` })
            })
            chat.save((err) => {
                if (err) return res.status(500).send({ message: `Error saving the message: ${err}` })
                return res.status(200).send({ message: `Message received` })
            })
        })
    } else {
        return res.status(500).send({ message: valid[0] })
    }
} */
    const addMessage = (req, res) => {
        let valid = validMessage(req)
        if (valid[1]) { 
            let message = {
                content :  req.body.content,
                author : req.body.author,
                likes : req.body.likes,
                dislikes : req.body.dislikes,
                type : req.body.type,
                date : req.body.date,
                messageId: mongoose.Types.ObjectId()
                }
            Chat.Chat.findOneAndUpdate({groupName : req.params.groupName}, {$push: {messages:message}}, (err, chat) => {
            if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
            if (!chat) return res.status(404).send({ message: `Chat doesn't exist` })

            Chat.Chat.findOne({groupName : req.params.groupName, 'messages.content' : 'cabeza'}, {'messages.$.[0].content' :1}, (err, message) => {
                console.log(message)
            })
        })
    } else {
        return res.status(500).send({ message: valid[0] })
    }
}

const getMessages = (req, res) => {
    Chat.Chat.find({groupName : req.params.groupName}, {_id: 0, "messages.date": 1, "messages.author":1, "messages.content":1, "messages.likes":1, "messages.dislikes":1, "messages.type":1, "messages._id": 1, "messages.replies":1}, {limit: 50}, (err, messages) => {
    if (err) return res.status(500).send({ message: `Error retrieving data: ${err}` })
    if (!messages) return res.status(404).send({ message: `Chat doesn't exist` })
    return res.status(200).send({ message: `Message received`, messages })
    })
}

const validMessage = function (req) {
    let content = req.body.content
    let author = req.body.author
    if (content == null || content === '') return [`Error content is empty`, false]
    else if (author == null || author === '') return [`Error author is empty`, false]
    else return ['', true]
}

module.exports = {
    createChat,
    addMessage,
    getMessages
}
