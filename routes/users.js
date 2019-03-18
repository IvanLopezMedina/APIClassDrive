const usersCtrl = require('../controllers/users')
const groupCtrl = require('../controllers/group')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/users', usersCtrl.getUsers)
router.get('/users/:userId', usersCtrl.getUser)
router.put('/users/:userId', usersCtrl.updateUser)
router.delete('/users/:userId', usersCtrl.deleteUser)

router.post('/group', groupCtrl.creatGroup)
router.get('/group', groupCtrl.getGrups)
router.get('/group/:groupId', groupCtrl.getGroup)
router.put('/group/:groupId', groupCtrl.updateGroup)
router.delete('/group/:groupId', groupCtrl.deleteGroup)

router.post('/signup', usersCtrl.signUp)
router.post('/signin', usersCtrl.signIn)
// Adding auth to the method, we ensure that the user has a valid token
// The token is send in the request body, with the tag: Authorization

router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
