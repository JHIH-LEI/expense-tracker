const db = require('../../config/mongoose')
const Category = require('../category')

db.once('open', () => {
  const categoryList = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  categoryList.forEach(category => Category.create({ name: category }))
})