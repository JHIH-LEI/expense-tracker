const User = require('../models/user')
const Record = require('../models/record')
const Category = require('../models/category')
const bcrypt = require('bcryptjs')
const functions = {
  getIcon: function (recordCategory, categories) {
    //返回該支出的類別物件
    const category = categories.find(category => category.name === recordCategory)
    // 回傳該類別的圖案
    return category.icon
  },
  dateFormat: function (Date) {
    const year = Date.getFullYear()
    const month = (Date.getMonth() + 1) < 10 ? '0' + (Date.getMonth() + 1).toString() : Date.getMonth()
    const date = Date.getDate() < 10 ? '0' + Date.getDate().toString() : Date.getDate()
    //將資料原日期傳至input date value
    return `${year}-${month}-${date}`
  },
  createAccount: function (email, name) {
    return User.findOne({ email })
      .then(user => {
        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8)
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
              User.create({ email, name, password: hash })
            })
        }
      })
      .catch(err => console.log(err))
  },
  //將資料傳到前端，需要年/月/類別
  getFilterOptions: function (userId) {
    return Promise.all([functions.getUserYear(userId), functions.getUserMonth(userId), functions.getUserCategory(userId)])
  },
  getUserMonth: function (userId) {
    let monthList = []
    return Record.find({ userId })
      .then(records => {
        records.forEach(record => {
          const date = functions.dateFormat(record.date) //將Date格式轉換成2021-08-01
          monthList.push(date.slice(5, 7)) //取得月份
        })
      })
      .then(() => {
        return monthList = [...new Set(monthList)] //取得不重複月份
      })
  },
  getUserYear: function (userId) {
    let yearList = []
    return Record.find({ userId })
      .then(records => {
        records.forEach(record => {
          const date = functions.dateFormat(record.date) //將Date格式轉換成2021-08-01
          yearList.push(date.slice(0, 4)) //取得年
        })
      })
      .then(() => {
        return yearList = [...new Set(yearList)] //取得不重複年份
      })
  },
  getUserCategory: async function (userId) {
    let categoryList = []
    await Category.find({ userId })
      .lean()
      .then(categories => {
        categories.forEach(category => categoryList.push(category.name))
      })
    return categoryList
  }
}

module.exports = functions