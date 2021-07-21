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
    .then(() => {
      Record.find()
        .lean()
        .then(records => {
          let totalAmount = 0
          records.forEach(rc => {
            totalAmount += rc.amount
            rc.date = moment(rc.date).format('MMM Do , YYYY')
            rc.icon = getIcon(rc.category, categoryList)
          })
          res.render('index', { records, categoryList, totalAmount })
        })
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
    .catch(error => console.log(error))
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
    .catch(error => console.log(error))
})

app.delete('/record/:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.put('/record/:id', (req, res) => {
  const { name, date, category, amount } = req.body
  const id = req.params.id
  Record.findById(id)
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})