const usersCtrl = require('../controllers/users')
const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()

router.get('/users', usersCtrl.getUsers)
router.get('/users/:userId', usersCtrl.getUser)
router.put('/users/:userId', usersCtrl.updateUser)
router.put('/users/updateavatar/:displayname', usersCtrl.updateAvatar)
router.delete('/users/:userId', usersCtrl.deleteUser)

router.post('/signup', usersCtrl.signUp)
router.post('/signin', usersCtrl.signIn)

// Adding auth to the method, we ensure that the user has a valid token
// The token is send in the request body, with the tag: Authorization
router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
