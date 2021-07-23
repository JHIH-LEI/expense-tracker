const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
    default: 'fas fa-dollar-sign',
  },
  type: {
    type: String,
    required: true,
    default: '支出'
  }
})

module.exports = mongoose.model('Category', categorySchema)