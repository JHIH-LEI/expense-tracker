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
    default: 'expense'
  }
})

module.exports = mongoose.model('Category', categorySchema)