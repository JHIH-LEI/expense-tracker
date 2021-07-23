const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const moment = require('moment')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const helpers = require('handlebars-helpers')
const comparison = helpers.comparison()
// 使用flash
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./config/mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const { getIcon } = require('./public/javascripts/helper')
const dateFormat = require('./tools/dateFormat')
const iconsClass = require('./categoryIcon')
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 使用flash
app.use(cookieParser());
app.use(session({
  secret: 'secret123',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

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

app.get('/:sortBy', (req, res) => {
  const sortBy = req.params.sortBy
  let categoryList = []
  Category.find()
    .lean()
    .then(category => categoryList = category)
    .then(() => {
      Record.find({ category: sortBy })
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

app.get('/record/new/:type', (req, res) => {
  const type = req.params.type
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
      res.render('new', { type, categoryList, iconsClass, error: req.flash('error'), success: req.flash('success') })
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
  let categoryList = []
  Category.find()
    .lean()
    .then(category => {
      categoryList = category
    })
    .then(() => {
      Record.findById(id)
        .lean()
        .then(record => {
          console.log(record.date)
          const time = dateFormat(record.date)
          res.render('edit', { record, time, categoryList, iconsClass, error: req.flash('error'), success: req.flash('success') })
        })
    })
    .catch(error => console.log(error))
})

app.delete('/record/:id', (req, res) => {
  const id = req.params.id
  const url = req.headers.referer
  const pathname = new URL(url).pathname
  Record.findById(id)
    .then(record => record.remove())
    // 返回上一頁，這樣才能避免篩選類別後，再刪除資料後，又回到全部類別
    .then(() => res.redirect(pathname))
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

app.post('/category', (req, res) => {
  const newName = req.body.newCategory
  // icon的網址，取得使用者勾選的項目，其value(也就是類別圖示)
  const icon = req.body.icon
  // 上一頁網址
  const url = req.headers.referer
  const pathname = new URL(url).pathname
  // 檢查類別是否已存在，如果存在回傳true，用then是因為返回的是未實現的promise
  Category.exists({ name: newName })
    .then(boolean => {
      //如果類別已存在
      if (boolean) {
        // 如果上一頁是新增頁面
        if (pathname.indexOf('new') > 0) {
          // 返回新增頁面，並傳送錯誤提示
          req.flash('error', '類別已經存在')
          res.redirect(pathname)
          // 如果上一頁是修改頁面，返回該頁並傳送錯誤提示
        } else if (pathname.indexOf('edit')) res.render('edit', { iconsClass, error: '類別已經存在' })
        // 如果類別尚未存在
      } else {
        // 儲存新類別到資料庫，返回上一頁
        Category.create({ name: newName, icon })
          .then(() => {
            req.flash('success', `${newName}   已經新增到類別當中！`)
            res.redirect(pathname)
          })
      }
    })
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`)
})