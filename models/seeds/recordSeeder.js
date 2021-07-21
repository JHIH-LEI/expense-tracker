const db = require('../../config/mongoose')
const Record = require('../record')


db.once('open', () => {
  Record.create({
    name: '神戶牛排',
    category: '餐飲食品',
    amount: 2000
  })
})