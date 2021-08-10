const express = require('express')
const router = express.Router()

const Category = require('../../models/category')

router.post('/:type', (req, res) => {
  //類別所屬使用者
  const userId = req.user._id
  // 類別類型
  const type = req.params.type
  const newName = req.body.newCategory
  // icon的網址，取得使用者勾選的項目，其value(也就是類別圖示)
  const icon = req.body.icon
  // 上一頁網址
  const url = req.headers.referer
  const pathname = new URL(url).pathname
  // 檢查類別是否已存在，如果存在回傳true，用then是因為返回的是未實現的promise
  Category.exists({ name: newName, userId })
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
        Category.create({ name: newName, icon, type: type, userId })
          .then(() => {
            req.flash('success', `${newName}   已經新增到類別當中！`)
            res.redirect(pathname)
          })
      }
    })
})

module.exports = router