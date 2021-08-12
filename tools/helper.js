const User = require('../models/user')
const bcrypt = require('bcryptjs')
const functions = {
  getIcon: function (recordCategory, categoryList) {
    //返回該支出的類別物件
    const category = categoryList.find(category => category.name === recordCategory)
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
  }
}

module.exports = functions