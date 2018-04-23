const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const saltRounds = require('../config/cryptConfig').saltRounds

module.exports = app => {
  app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body
    const passwordHash = bcrypt.hashSync(password, saltRounds)

    const checkUserName = await User.find({ username });
    if
  })
}