const filesCtrl = require('../controllers/files')
const express = require('express')
const router = express.Router()
// const auth = require('../middlewares/auth')

router.get('getfiles/:groupName', filesCtrl.getFiles)
router.get('getfile', filesCtrl.getFile)
router.post('addFile/:groupName', filesCtrl.addFile)
router.post('deleteFile/:groupName', filesCtrl.deleteFile)

module.exports = router
