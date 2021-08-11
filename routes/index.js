const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const record = require('./modules/record')
const category = require('./modules/category')
const chart = require('./modules/chart')
const user = require('./modules/user')
const auth = require('./modules/auth')
const { authenticator } = require('../middleware/auth')

router.use('/chart', authenticator, chart)
router.use('/record', authenticator, record)
router.use('/category', authenticator, category)
router.use('/user', user)
router.use('/auth', auth)
router.use('/', authenticator, home)

module.exports = router