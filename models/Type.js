const mongoose = require('mongoose')
const { Schema } = mongoose

const typeSchema = new Schema({
  title: { type: String, required: true },
})

mongoose.model('Type', typeSchema)