const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const moment = require('moment')
require('./config/mongoose')
const Record = require('./models/record')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      records.forEach(rc => {
        rc.date = moment(rc.date).format('MMMM d dddd, YYYY')
      })
      res.render('index', { records })
    })
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})