const express = require('express')
const app = express()
const routes = require('./routes')

const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const helpers = require('handlebars-helpers')
const comparison = helpers.comparison()
// 使用flash
require('dotenv').config()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const usePassport = require('./config/passport')

require('./config/mongoose')
const PORT = process.env.PORT

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 使用flash
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
usePassport(app)
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated() //將驗證結果傳到res，讓前端樣板可用
  res.locals.user = req.user //將使用者資料傳到res，讓前端樣板可用
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

app.listen(PORT, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})