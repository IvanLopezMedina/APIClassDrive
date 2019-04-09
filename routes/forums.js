const forumsCtrl = require('../controllers/forums')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/posts/:forumId', forumsCtrl.getPosts)
router.get('/post/:postId', forumsCtrl.getPost)
router.put('/addPost/:forumId', forumsCtrl.addPost)
router.put('/addAnswer/:forumId', forumsCtrl.addAnswer)
router.delete('/deleteForumElement/:forumId', forumsCtrl.deleteForumElement)

// Adding auth to the method, we ensure that the forum has a valid token
// The token is send in the request body, with the tag: Authorization

router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
