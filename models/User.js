mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true,  match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  type: { type: String, required: true }
})

mongoose.model('User', userSchema)