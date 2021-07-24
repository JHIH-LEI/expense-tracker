const functions = {
  getIcon: function (recordCategory, categoryList) {
    //返回該支出的類別物件
    const category = categoryList.find(category => category.name === recordCategory)
    // 回傳該類別的圖案
    return category.icon
  },
}

module.exports = functions