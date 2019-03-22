const forumsCtrl = require('../controllers/forums')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/forums', forumsCtrl.getForums)

router.get('/forums/:forumId', forumsCtrl.getForum)
router.put('/forums/:forumId', forumsCtrl.updateForum)
router.delete('/forums/:forumId', forumsCtrl.deleteForum)

router.post('/forum', forumsCtrl.createForum)
// router.post('/signin', forumsCtrl.signIn)
// Adding auth to the method, we ensure that the forum has a valid token
// The token is send in the request body, with the tag: Authorization

router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
