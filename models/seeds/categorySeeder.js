const db = require('../../config/mongoose')
const Category = require('../category')
const User = require('../user')
const categoryList = require('../../categories.json')

db.once('open', () => {
  console.log('categorySeeder is connect!')
  return User.find()
    .then(users => {
      Promise.all(Array.from(users, (user, i) => {
        //為每個使用者新增類別
        const userId = user._id
        categoryList.forEach(category => category.userId = userId) //將每個類別寫入自己的User id
        return Category.create(categoryList)
      }))
        .then(() => {
          console.log('done')
          process.exit()
        })
    })
})