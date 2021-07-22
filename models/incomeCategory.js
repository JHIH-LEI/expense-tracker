const mongoose = require('mongoose')
const Schema = mongoose.Schema

const incomeCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'fas fa-dollar-sign'
  }
})

module.exports = mongoose.model('incomeCategory', incomeCategorySchema)