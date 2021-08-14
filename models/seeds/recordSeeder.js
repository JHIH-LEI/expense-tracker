const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const bcrypt = require('bcryptjs')


db.once('open', () => {
  console.log('recordSeeder is connect!')
  const SEED_USERS = [
    {
      name: 'Alpha Camp',
      email: '123@gmail.com',
      password: '123'
    },
    {
      name: 'Alicia',
      email: 'abc@gmail.com',
      password: '123'
    }
  ]
  //迭代seed_user並且創建user及其record資料
  Promise.all(Array.from(SEED_USERS, (SEED_USER, index) => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => {
        return User.create({
          name: SEED_USER.name,
          email: SEED_USER.email,
          password: hash
        })
      })
      .then(user => {
        return Record.create({
          name: '神戶牛排',
          category: '餐飲食品',
          date: Date.now(),
          amount: -2000,
          userId: user._id
        }, {
          name: 'H1Z1',
          category: '休閒娛樂',
          date: Date.now(),
          amount: -799,
          userId: user._id
        })
      })
  }))
    .then(() => {
      console.log('recordSeeder done!')
      process.exit()
    })
})