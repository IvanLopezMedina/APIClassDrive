const filesCtrl = require('../controllers/files')
const express = require('express')
const router = express.Router()
// const auth = require('../middlewares/auth')

router.get('/files/:groupId', filesCtrl.getFiles)
router.post('/files/', filesCtrl.addFile)

module.exports = router
