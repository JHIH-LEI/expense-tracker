const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const bcrypt = require('bcryptjs')


db.once('open', async () => {
  console.log('recordSeeder is connect!')
  const SEED_USER = {
    name: 'Alpha Camp',
    email: '123@gmail.com',
    password: '123'
  }
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => {
      User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      })
        .then(async user => {
          await Record.create({
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
        .then(() => {
          console.log('recordSeeder done!')
          process.exit()
        })
    })
})