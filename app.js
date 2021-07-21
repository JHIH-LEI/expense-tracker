const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const moment = require('moment')
const methodOverride = require('method-override')
require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const category = require('./models/category')
const { getIcon } = require('./public/javascripts/helper')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'))

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
        rc.icon = getIcon(rc.category, categoryList)
      })
      res.render('index', { records, categoryList })
    })
    .catch(error => console.log(error))
})

app.get('/new', (req, res) => {
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
      res.render('new', { categoryList })
    })
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})