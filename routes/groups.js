const groupCtrl = require('../controllers/groups')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.post('/groups', groupCtrl.createGroup)
router.post('/getgroups', groupCtrl.getGroups)
router.post('/searchgroups', groupCtrl.searchGroup)
router.post('/getgroupswithsearch', groupCtrl.getGroupwithSearch)

router.get('/groups', groupCtrl.getGroups)
router.get('/groups/:groupId', groupCtrl.getGroup)
router.get('/groupsname/:name', groupCtrl.getGroupName)
router.get('/groupusers/:groupId', groupCtrl.getUsers)

router.delete('/groups/:groupId', groupCtrl.deleteGroup)

router.put('/subscribe/:groupId', groupCtrl.subscribe)

// Adding auth to the method, we ensure that the user has a valid token
// The token is send in the request body, with the tag: Authorization
router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
