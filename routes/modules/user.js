const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        return console.log('此email已被註冊！')
      }
      if (!name || !email || !password || !confirmPassword) {
        return console.log('所有欄位都是必填項')
      }
      if (password !== confirmPassword) {
        return console.log('密碼和確認密碼不符')
      }
      User.create({ name, email, password })
        .then(() => console.log('帳號註冊成功！'))
    })
    .then(() => res.render('register'))
    .catch(err => console.log(err))
})

module.exports = router