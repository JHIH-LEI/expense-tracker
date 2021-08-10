const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')

module.exports = (app) => {
  // middleware
  app.use(passport.initialize());
  app.use(passport.session());
  // 登陸策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          console.log('此Email尚未註冊')
          return done(null, false)
        }
        if (password !== user.password) {
          console.log('帳號或密碼錯誤')
          return done(null, false)
        }
        done(null, user)
      })
      .catch(err => done(err, null))
  }));
  // 序列化/反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean() //透過id找到user，很可能傳到前端，要先處理
      .then(user => done(null, user))
      .catch(err => done(err, null))
  });
}