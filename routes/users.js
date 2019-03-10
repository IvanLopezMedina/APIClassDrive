const usersCtrl = require('../controllers/users')
const express = require('express')
const router = express.Router()

router.get('/users', usersCtrl.getUsers)
router.get('/users/:userId', usersCtrl.getUser)
router.post('/users', usersCtrl.createUser)
router.put('/users/:userId', usersCtrl.updateUser)
router.delete('/users/:userId', usersCtrl.deleteUser)

module.exports = router