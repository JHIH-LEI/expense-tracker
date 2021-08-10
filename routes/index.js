const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const record = require('./modules/record')
const category = require('./modules/category')
const chart = require('./modules/chart')
const user = require('./modules/user')

router.use('/chart', chart)
router.use('/record', record)
router.use('/category', category)
router.use('/user', user)
router.use('/', home)

module.exports = router