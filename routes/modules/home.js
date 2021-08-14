const express = require('express')
const router = express.Router()
const moment = require('moment')

const Category = require('../../models/category')
const Record = require('../../models/record')
const { getIcon, getFilterOptions } = require('../../tools/helper')

router.get('/', (req, res) => {
  const userId = req.user._id
  // 要傳到前端的資料：使用者可以篩選的條件
  let categoryNameList = []
  let yearList = []
  let monthList = []
  const filterOptions = getFilterOptions(userId)
  //獲得使用者可選的篩選條件，包含年/月/類別，最後會傳到前端
  filterOptions
    .then(data => {
      yearList = data[0]
      monthList = data[1]
      categoryNameList = data[2]
    })
    .then(() => {
      Category.find({ userId })
        .lean()
        .then(categories => {
          Record.find({ userId })
            .lean()
            .sort({ date: 'desc' })
            .then(records => {
              let totalAmount = 0
              records.forEach(rc => {
                totalAmount += rc.amount
                rc.date = moment(rc.date).format('MMM Do , YYYY')
                rc.icon = getIcon(rc.category, categories)
              })
              res.render('index', { records, categoryNameList, yearList, monthList, totalAmount })
            })
        })
        .catch(error => console.log(error))
    })
})

router.post('/filter/record', (req, res) => {
  const userId = req.user._id
  // 使用者選擇的篩選條件   
  // req.body = { year: '2020', month: '08', category: 'music' }
  const year = req.body.year === '全部年份' ? { $ne: '' } : Number(req.body.year)
  const month = req.body.month === '全部月份' ? { $ne: '' } : Number(req.body.month)
  const category = req.body.category === '全部類別' ? { $ne: '' } : req.body.category
  // 要傳到前端的資料，有使用者可以篩選的條件以及總金額
  let totalAmount = 0
  let categoryNameList = []
  let yearList = []
  let monthList = []
  const filterOptions = getFilterOptions(userId)
  // 取得使用者的年/月/類別 送到前端樣板的篩選器中
  filterOptions
    .then(data => {
      yearList = data[0]
      monthList = data[1]
      categoryNameList = data[2]
    })
  // 根據篩選條件篩選資料
  Record.aggregate([
    { $match: { userId } }, //篩選出該使用者的資料
    {
      $addFields: {
        "month": { $month: '$date' }, //增加月欄位
        "year": { $year: '$date' } //新增年欄位
      }
    },
    { $match: { year } },//篩選出符合使用者選的年份的資料
    { $match: { month } }, //篩選出符合使用者選的月份的資料
    { $match: { category } }
  ])
    .then(records => {
      Category.find({ userId })
        .lean()
        .then(categories => {
          records.forEach(record => {
            totalAmount += record.amount //計算總額
            record.date = moment(record.date).format('MMM Do , YYYY') //轉換日期格式到前端
            record.icon = getIcon(record.category, categories) //取得該筆紀錄的類別圖案
          })
        })
        .then(() => res.render('index', { records, totalAmount, categoryNameList, monthList, yearList, month, category, year }))
    })
    .catch(err => console.log(err))
})

module.exports = router