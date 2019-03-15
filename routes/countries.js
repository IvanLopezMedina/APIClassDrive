const countriesCtrl = require('../controllers/countries')
const express = require('express')
const router = express.Router()

router.get('/get', countriesCtrl.getCountries)

module.exports = router
