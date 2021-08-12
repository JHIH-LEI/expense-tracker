const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { createAccount } = require('../tools/helper')

module.exports = (app) => {
  // middleware
  app.use(passport.initialize());
  app.use(passport.session());
  // 登陸策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '此Email尚未註冊' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: '帳號或密碼錯誤' })
            }
            done(null, user)
          })
      })
      .catch(err => done(err, null))
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_APP_CALLBACK,
    profileFields: ['email', 'displayName']
  },
    (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) {
            return done(null, user)
          }
          user = createAccount(email, name)
          user
            .then(user => done(null, user))
        })
        .catch(err => done(err, null))
    }
  ));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
  },
    (accessToken, refreshToken, profile, done) => {
      const { email, name } = profile._json
      User.findOne({ email })
        .then(user => {
          if (user) {
            return done(null, user)
          }
          user = createAccount(email, name)
          user
            .then(user => done(null, user))
        })
        .catch(err => done(err, null))
    }
  ));

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