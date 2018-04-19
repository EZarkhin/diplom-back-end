const mongoose = require('mongoose')
const { Schema } = mongoose

const workerSchema = new Schema({
  name: { type: String, required: true },
  workIn: { type: String, required: true },
  position: { type: String, required: true },
  telephone: { type: String },
  email: { type: String },
  auditory: { type: String },
  housing: { type: String },
  hours: { type: String }
})

mongoose.model('Worker', workerSchema)