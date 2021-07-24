const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const type = req.query.type
  let recordCategoryList = []
  let recordAmountList = []
  Record.find()
    .lean()
    .then(records => {
      // 依照使用者選擇過濾掉收入or支出類別
      if (type === '收入') {
        //如果圖表type是收入，過濾掉不是收入的
        return records.filter(record => record.name === '收入')
      } else {
        //如果圖表type是支出（非收入的都是支出），過濾掉收入的
        return records.filter(record => record.name !== '收入')
      }
    })
    .then(records => {
      // 將類別及金額依序丟入陣列
      records.forEach(record => {
        recordCategoryList.push(record.category)
        recordAmountList.push(record.amount)
      })
      res.render('chart', { type, recordCategoryList: JSON.stringify(recordCategoryList), recordAmountList: JSON.stringify(recordAmountList) })
    })
    .catch(error => console.log(error))
  // 帶入類別資料，作為標籤
  // 紀錄
})

module.exports = router