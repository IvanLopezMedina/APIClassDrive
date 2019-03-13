const usersCtrl = require('../controllers/users')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/users', usersCtrl.getUsers)
router.get('/users/:userId', usersCtrl.getUser)
router.post('/users', usersCtrl.createUser)
router.put('/users/:userId', usersCtrl.updateUser)
router.delete('/users/:userId', usersCtrl.deleteUser)

router.post('/signup', usersCtrl.signUp)
router.post('/signin', usersCtrl.signIn)
router.get('/private', auth, function(req, res) {
   res.status(200).send({ message: 'Test: You have access'})
})
router.post('/crearGrup', usersCtrl.signUp)

module.exports = router