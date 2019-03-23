const groupCtrl = require('../controllers/group')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.post('/group', groupCtrl.createGroup)
router.get('/groups', groupCtrl.getGroups)
router.get('/group/:groupId', groupCtrl.getGroup)
router.delete('/group/:groupId', groupCtrl.deleteGroup)

module.exports = router
