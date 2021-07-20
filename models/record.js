const mongoose = require('mongoose')
const Schema = mongoose.Schema
const RecordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  }
})

module.exports('Record', RecordSchema)