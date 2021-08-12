const express = require('express')
const router = express.Router()
const moment = require('moment')

const Category = require('../../models/category')
const Record = require('../../models/record')
const { getIcon, dateFormat } = require('../../tools/helper')

router.get('/', (req, res) => {
  let categoryList = []
  let yearList = []
  let monthList = []
  const userId = req.user._id
  //將年月傳到前端
  Record.find({ userId })
    .then(records => {
      records.forEach(record => {
        const date = dateFormat(record.date) //2021-08-01
        monthList.push(date.slice(5, 7)) //取得月份
        yearList.push(date.slice(0, 4)) //取得年
      })
    })
    .then(() => {
      monthList = [...new Set(monthList)]
      yearList = [...new Set(yearList)]
    })
    .then(() => {
      Category.find({ userId })
        .lean()
        .then(category => categoryList = category)
        .then(() => {
          Record.find({ userId })
            .lean()
            .sort({ date: 'desc' })
            .then(records => {
              let totalAmount = 0
              records.forEach(rc => {
                totalAmount += rc.amount
                rc.date = moment(rc.date).format('MMM Do , YYYY')
                rc.icon = getIcon(rc.category, categoryList)
              })
              res.render('index', { records, categoryList, yearList, monthList, totalAmount })
            })
        })
        .catch(error => console.log(error))
    })

})

router.post('/', (req, res) => {
  // req.body = { year: '2020', month: '08', category: 'music' }
  const year = req.body.year === '全部年份' ? { $ne: '' } : Number(req.body.year)
  const month = req.body.month === '全部月份' ? { $ne: '' } : Number(req.body.month)
  const category = req.body.category === '全部類別' ? { $ne: '' } : req.body.category
  const userId = req.user._id
  let totalAmount = 0
  let categoryList = []
  let yearList = []
  let monthList = []
  //將年月傳到前端
  Record.find({ userId })
    .then(records => {
      records.forEach(record => {
        const date = dateFormat(record.date) //將Date格式轉換成2021-08-01
        monthList.push(date.slice(5, 7)) //取得月份
        yearList.push(date.slice(0, 4)) //取得年
      })
    })
    .then(() => {
      monthList = [...new Set(monthList)] //取得不重複月份
      yearList = [...new Set(yearList)] //取得不重複年份
    })
  // 根據篩選條件篩選資料
  Record.aggregate([
    { $match: { userId } }, //篩選出該使用者的資料
    { $addFields: { "month": { $month: '$date' } } }, //增加月欄位
    { $addFields: { "year": { $year: '$date' } } },
    { $match: { year } },//篩選出符合使用者選的年份的資料
    { $match: { month } }, //篩選出符合使用者選的月份的資料
    { $match: { category } }
  ])
    .then(records => {
      Category.find({ userId })
        .lean()
        .then(categories => {
          categoryList = categories
          records.forEach(record => {
            totalAmount += record.amount //計算總額
            record.date = moment(record.date).format('MMM Do , YYYY') //轉換日期格式到前端
            record.icon = getIcon(record.category, categoryList) //取得類別圖案到前端
          })
        })
        .then(() => res.render('index', { records, totalAmount, categoryList, monthList, yearList, month, category, year }))
    })
    .catch(err => console.log(err))
})

module.exports = router