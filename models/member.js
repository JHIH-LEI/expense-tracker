const mongoose = require('mongoose')
const Schema = mongoose.Schema

const memberSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true
  }
})

module.exports = mongoose.model('Member', memberSchema)