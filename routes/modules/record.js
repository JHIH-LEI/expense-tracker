const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')
const dateFormat = require('../../tools/dateFormat')
const iconsClass = require('../../categoryIcon')

router.post('/new', (req, res) => {
  const { name, date, category, amount } = req.body
  // 如果名稱是收入，就存正數，反之為支出，金額改為負數
  let money = name === '收入' ? amount : 0 - amount
  return Record.create({ name, date, category, amount: money })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/new/:type', (req, res) => {
  const type = req.params.type
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
      res.render('new', { type, categoryList, iconsClass, error: req.flash('error'), success: req.flash('success') })
    })
    .catch(error => console.log(error))
})

router.get('/:id/edit/:type', (req, res) => {
  const id = req.params.id
  const type = req.params.type
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
    })
    .then(() => {
      Record.findById(id)
        .lean()
        .then(record => {
          // 金額都是正的，所以在render編輯頁前要先把支出的負數拿掉
          let money = 0
          money = record.amount < 0 ? record.amount * -1 : record.amount
          const time = dateFormat(record.date)
          res.render('edit', { type, record, money, time, categoryList, iconsClass, error: req.flash('error'), success: req.flash('success') })
        })
    })
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  const url = req.headers.referer
  const pathname = new URL(url).pathname
  Record.findById(id)
    .then(record => record.remove())
    // 返回上一頁，這樣才能避免篩選類別後，再刪除資料後，又回到全部類別
    .then(() => res.redirect(pathname))
    .catch(error => console.log(error))
})

router.put('/:type/:id', (req, res) => {
  // 修改資料前，將支出金額轉負，收入轉正
  const type = req.params.type
  const { name, date, category, amount } = req.body
  let money = 0
  // 根據類別類型來調整金額正負(type為收入或支出)
  money = type === '收入' ? amount : 0 - amount
  const id = req.params.id
  Record.findById(id)
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = money
      record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router