const forumsCtrl = require('../controllers/forums')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/posts/:forumId', forumsCtrl.getPosts)
router.get('/post/:postId', forumsCtrl.getPost)
router.put('/addPost/:groupName', forumsCtrl.addPost)
router.put('/addAnswer/:groupName', forumsCtrl.addAnswerResp)
router.put('/updateForum/:groupName', forumsCtrl.updateForum)
router.delete('/deleteForumElement/:groupName', forumsCtrl.deleteForumElement)
// Adding auth to the method, we ensure that the forum has a valid token
// The token is send in the request body, with the tag: Authorization

router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
