const db = require('../../config/mongoose')
const Category = require('../category')
const User = require('../user')

db.once('open', () => {
  console.log('categorySeeder is connect!')
  return User.find()
    .then(async user => {
      const userId = user[0]._id
      await Category.create(
        {
          name: '家居物業',
          icon: 'fas fa-home',
          userId
        },
        {
          name: '交通出行',
          icon: 'fas fa-shuttle-van',
          userId
        },
        {
          name: '休閒娛樂',
          icon: 'fas fa-grin-beam',
          userId
        },
        {
          name: '餐飲食品',
          icon: 'fas fa-utensils',
          userId
        },
        {
          name: '其他',
          icon: 'fas fa-pen',
          userId
        },
        {
          name: '薪水',
          type: '收入',
          userId
        })
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})