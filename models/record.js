const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
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
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true
  },
  merchant: String,
  member: {
    type: String,
    require: true,
    default: '自己'
  }
})

module.exports = mongoose.model('Record', recordSchema)