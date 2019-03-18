const countriesCtrl = require('../controllers/countries')
const express = require('express')
const router = express.Router()

router.get('/getcountry', countriesCtrl.getCountries)

module.exports = router
