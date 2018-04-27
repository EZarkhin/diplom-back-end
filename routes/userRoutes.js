const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const saltRounds = require('../config/cryptConfig').saltRounds
const secret = require('../config/cryptConfig').secret
const isEmpty = require('lodash').isEmpty
const jwt = require('jsonwebtoken')

module.exports = app => {
  app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body
    const passwordHash = bcrypt.hashSync(password, saltRounds)

    const checkUserName = await User.find({ username })
    if (isEmpty(checkUserName)){
      const user = new User({
        username,
        passwordHash,
        email,
        type: 'Visitor'
      })

      user.save((err, data) => {
        if (err) res.status(500).json({errMessage: err})
        else res.status(200).json({
          user: user,
          token:  jwt.sign({ username }, secret, {expiresIn: '24h'})
        })
      })
    } else res.status(500).json({errMessage: 'Пользователь с таким ником существует'})
  })
  app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({username})

    isEmpty(user) 
      ? res.status(500).json({ errMessage: 'Пользователь с таким именем не найден'})
      : bcrypt.compareSync(password, user.passwordHash) ? jwt.sign({ username }, secret, {expiresIn: '24h'}, (err, token) => {
        res.status(200).json({user, token})
      })
      : res.status(500).json({errMessage: 'Пароль неверный'})
    })
  
  app.get('/api/user', async (req, res) => {
    const user = await User.find({})

    isEmpty(user) 
    ? res.status(500).json({errMessage: 'Пользователей не найдено'}) 
    : res.status(200).json({user})
  })

  app.get('/api/user/:id', async (req, res) => {
    const user = await User.findOne({_id: req.params.id})

    isEmpty(user) 
    ? res.status(500).json({errMessage: 'Пользователь не найден'}) 
    : res.status(200).json({user})
  })

  app.put('/api/user/:id', async (req, res) => {
    const { username, password, email, type, token } = req.body
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) res.status(500).json({errMessage: 'Токен неверный'})
      else {
        const user = await User.findOneAndUpdate(
          {_id: req.params.id}, 
          {
            $set: {
              username,
              passwordHash: bcrypt.hashSync(password, saltRounds),
              email,
              type
            }
          },
          {new: true}
        )
        user.save((err, data) => {
          if (err) res.status(500).json({errMessage: 'Внутренняя ошибка сервера'})
          else res.send(data)
        })
      }
    })
  })
  app.delete('/api/user/:id', async (req, res) => {
    const user = await User.findOneAndRemove({_id: req.params.id})
    user.save((err, data) => {
      if (err) res.status(500).json({errMessage: 'Внутренняя ошибка сервера'})
      else res.status(200).json()
    })
  })
}