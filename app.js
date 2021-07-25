const express = require('express')
const app = express()
const routes = require('./routes')

const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const helpers = require('handlebars-helpers')
const comparison = helpers.comparison()
// 使用flash
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

require('./config/mongoose')
const PORT = process.env.PORT || 3000

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
app.use(routes)

app.listen(port, () => {
  console.log(`express is running on http://localhost:${PORT}`)
})