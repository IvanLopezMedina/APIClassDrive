const testCtrl = require('../controllers/test')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

router.get('/alltests/:groupName', testCtrl.getAllTest)
router.get('/test/:groupName', testCtrl.getTest)
router.put('/edittest/:testId', testCtrl.editTest)
router.put('/deletetest/:testId', testCtrl.deleteTest)

router.post('/addtest', testCtrl.addTest)

// Adding auth to the method, we ensure that the user has a valid token
// The token is send in the request body, with the tag: Authorization
router.get('/private', auth, function (req, res) {
    res.status(200).send({ message: 'Test: You have access' })
})

module.exports = router
