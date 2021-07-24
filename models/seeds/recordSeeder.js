const db = require('../../config/mongoose')
const Record = require('../record')


db.once('open', async () => {
  console.log('recordSeeder is connect!')
  const data = [
    {
      name: '神戶牛排',
      category: '餐飲食品',
      date: Date.now(),
      amount: -2000
    },
    {
      name: 'H1Z1',
      category: '休閒娛樂',
      date: Date.now(),
      amount: -799
    },
    {
      name: '收入',
      category: '薪水',
      date: Date.now(),
      amount: 10000
    },
    {
      name: '火鍋',
      category: '餐飲食品',
      date: Date.now(),
      amount: -500
    }
  ]
  await Record.create(data)
  db.close()
})