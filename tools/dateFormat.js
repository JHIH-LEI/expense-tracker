function dateFormat(Date) {
  const year = Date.getFullYear()
  const month = (Date.getMonth() + 1) < 10 ? '0' + (Date.getMonth() + 1).toString() : Date.getMonth()
  const date = Date.getDate() < 10 ? '0' + Date.getDate().toString() : Date.getDate()
  //將資料原日期傳至input date value
  return `${year}-${month}-${date}`
}

module.exports = dateFormat