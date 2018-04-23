const mongoose = require('mongoose')
const isEmpty = require('lodash').isEmpty
const Worker = mongoose.model('Worker')
const jwt = require('jsonwebtoken')
const secret = require('../config/cryptConfig').secret

module.exports = app => {
  app.get('/api/workers/', async (req, res) => {
    const workers = await Worker.find({})
    isEmpty(workers) 
    ? res.status(500).json({errMessage: 'Cотрудников не найдено'}) 
    : res.send(workers)
  })

  app.get('/api/workers/:id', async (req, res) => {
    const worker = await Worker.findOne({_id: req.params.id})
    isEmpty(workers) 
    ? res.status(500).json({errMessage: 'Cотрудник не найден'}) 
    : res.send(workers)
  })

  app.post('/api/workers/', async (req, res) => {
    const {
      name,
      workIn,
      position,
      phone,
      email,
      auditory,
      housing,
      hours,
      token
    } = req.body
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) res.status(401).json({errMessage: 'Авторизируйтеся для выполнения данного действия'})
      else {
        const checkName = await Worker.find({name})
        if (isEmpty(checkName)) {
          const worker = new Worker({
            name,
            workIn,
            position,
            phone,
            email,
            auditory,
            housing,
            hours,
          })
          worker.save((err, data) => {
            err ? res.status(500).json({errMessage: 'Внутрення ошибка сервера'}) : res.status(200).json(data)
          })
        } else res.status(500).json({errMessage: 'Сотрудник с таким именем существует'})
      }
    })
  })
  app.put('/api/workers/:id', async (req, res) => {
    const {
      name,
      workIn,
      position,
      phone,
      email,
      auditory,
      housing,
      hours,
      token
    } = req.body
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) res.status(401).json({errMessage: 'Авторизируйтеся для выполнения данного действия'})
      else {
        const worker = await Worker.findOneAndUpdate({_id: req.params.id},
          { 
            $set: {
              name,
              workIn,
              position,
              phone,
              email,
              auditory,
              housing,
              hours
            }
          },
          {new: true}
        )
        worker.save((err, data) => {
          err ? res.status(500).json({errMessage: 'Внутрення ошибка сервера'}) : res.status(200).json(data)
        })
      }
    })
  })

  app.delete('/api/workers/:id', async (req, res) => {
    const worker = await Worker.findOneAndRemove({_id: req.params.id})
    worker.save((err, data) => {
      if (err) res.status(500).json({errMessage: 'Внутренняя ошибка сервера'})
      else res.status(200).json()
    })
  })
}