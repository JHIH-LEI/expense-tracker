const express = require('express')
const router = express.Router()
const moment = require('moment')

const Category = require('../../models/category')
const Record = require('../../models/record')
const { getIcon } = require('../../tools/helper')

router.get('/', (req, res) => {
  let categoryList = []
  Category.find()
    .lean()
    .then(category => categoryList = category)
    .then(() => {
      Record.find()
        .lean()
        .sort({ date: 'desc' })
        .then(records => {
          let totalAmount = 0
          records.forEach(rc => {
            totalAmount += rc.amount
            rc.date = moment(rc.date).format('MMM Do , YYYY')
            rc.icon = getIcon(rc.category, categoryList)
          })
          res.render('index', { records, categoryList, totalAmount })
        })
    })
    .catch(error => console.log(error))
})

router.get('/:sortBy', (req, res) => {
  const sortBy = req.params.sortBy
  let categoryList = []
  Category.find()
    .lean()
    .then(category => categoryList = category)
    .then(() => {
      Record.find({ category: sortBy })
        .lean()
        .sort({ date: 'desc' })
        .then(records => {
          let totalAmount = 0
          records.forEach(rc => {
            totalAmount += rc.amount
            rc.date = moment(rc.date).format('MMM Do , YYYY')
            rc.icon = getIcon(rc.category, categoryList)
          })
          res.render('index', { records, categoryList, totalAmount })
        })
    })
    .catch(error => console.log(error))
})

module.exports = router