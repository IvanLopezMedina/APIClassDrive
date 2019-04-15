const filesCtrl = require('../controllers/files')
const express = require('express')
const router = express.Router()
// const auth = require('../middlewares/auth')

router.get('/files/getfiles/:groupName', filesCtrl.getFiles)
router.get('/files/getfile', filesCtrl.getFile)
router.post('/files/addFile/:groupName', filesCtrl.addFile)

module.exports = router
