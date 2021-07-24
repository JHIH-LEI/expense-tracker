const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const record = require('./modules/record')
const category = require('./modules/category')
const chart = require('./modules/chart')

router.use('/chart', chart)
router.use('/', home)
router.use('/record', record)
router.use('/category', category)

module.exports = router