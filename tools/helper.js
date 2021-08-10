const functions = {
  getIcon: function (recordCategory, categoryList) {
    //返回該支出的類別物件
    const category = categoryList.find(category => category.name === recordCategory)
    // 回傳該類別的圖案
    return category.icon
  },
  dateFormat: function (Date) {
    const year = Date.getFullYear()
    const month = (Date.getMonth() + 1) < 10 ? '0' + (Date.getMonth() + 1).toString() : Date.getMonth()
    const date = Date.getDate() < 10 ? '0' + Date.getDate().toString() : Date.getDate()
    //將資料原日期傳至input date value
    return `${year}-${month}-${date}`
  }
}

module.exports = functions