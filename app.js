const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const moment = require('moment')
require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  let categoryList = []
  Category.find()
    .lean()
    .then(category => categoryList = category)
  Record.find()
    .lean()
    .then(records => {
      records.forEach(rc => {
        rc.date = moment(rc.date).format('MMMM d dddd, YYYY')
      })
      res.render('index', { records, categoryList })
      console.log(category)
    })
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})