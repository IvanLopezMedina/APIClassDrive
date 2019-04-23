const chatCtrl = require('../controllers/chat')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.post('/addMessage/:groupName', chatCtrl.addMessage)
router.get('/getMessages/:groupName', chatCtrl.getMessages)
// Adding auth to the method, we ensure that the forum has a valid token
// The token is send in the request body, with the tag: Authorization

router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router

