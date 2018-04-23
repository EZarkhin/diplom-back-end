const mongoose = require('mongoose')
const { Schema } = mongoose

const unitSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  director: { type: String, required: true },
  adress: { type: String, required: true },
  site: { type: String },
  telephone: { type: String },
  higherUnit: { type: String }
})

mongoose.model('Unit', unitSchema)