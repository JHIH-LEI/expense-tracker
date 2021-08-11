const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/user/login'
}));

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  let errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填項' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼和確認密碼不符' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此email已被註冊！' })
        return res.render('register', { name, email, password, confirmPassword, errors })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({ name, email, password: hash })
            .then(() => res.redirect('/'))
            .catch(err => console.log(err))
        })
    })
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', '登出成功')
  res.redirect('/user/login');
});

module.exports = router