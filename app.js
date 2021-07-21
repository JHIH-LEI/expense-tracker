const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const moment = require('moment')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const { getIcon } = require('./public/javascripts/helper')
const dateFormat = require('./tools/dateFormat')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))

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

app.get('/record/new', (req, res) => {
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
      res.render('new', { categoryList })
    })
})

app.post('/record/new', (req, res) => {
  const { name, date, category, amount } = req.body
  return Record.create({ name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/record/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => {
      const time = dateFormat(record.date)
      res.render('edit', { record, time })
    })
})


app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})