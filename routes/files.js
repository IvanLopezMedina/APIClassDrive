const filesCtrl = require('../controllers/files')
const express = require('express')
const router = express.Router()
// const auth = require('../middlewares/auth')

router.get('/users/:groupId', filesCtrl.getFiles)

module.exports = router
