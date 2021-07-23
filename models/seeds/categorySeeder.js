const db = require('../../config/mongoose')
const Category = require('../category')

db.once('open', () => {
  const data = [
    {
      name: '家居物業',
      icon: 'fas fa-home'
    },
    {
      name: '交通出行',
      icon: 'fas fa-shuttle-van'
    },
    {
      name: '休閒娛樂',
      icon: 'fas fa-grin-beam'
    },
    {
      name: '餐飲食品',
      icon: 'fas fa-utensils'
    },
    {
      name: '其他',
      icon: 'fas fa-pen'
    },
    {
      name: '薪水',
      type: 'income'
    }
  ]
  Category.create(data)
})