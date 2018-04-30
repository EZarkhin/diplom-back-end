const mongoose = require('mongoose')
const Unit = mongoose.model('Unit')
const isEmpty = require('lodash').isEmpty
const Worker = mongoose.model('Worker')
const jwt = require('jsonwebtoken')
const secret = require('../config/cryptConfig').secret

module.exports = app => {
  app.get('/api/unit', async (req, res) => {
    const units = await Unit.find({})
    isEmpty(units) 
    ? res.status(500).json({errMessage: 'Подразделений не найдено'}) 
    : res.status(200).send(units)
  })

  app.get('/api/unit/:id', async (req, res) => {
    const units = await Unit.findOne({_id: req.params.id})
      isEmpty(units) 
      ? res.status(500).json({errMessage: 'Подразделение не найдено'}) 
      : res.status(200).send(units)
  })

  app.get('/api/unit/searchType/:type', async (req, res) => {
    const units = await Unit.findOne({type: req.params.type})
    res.send(units)
  })

  app.get('/api/unit/searchHU/:highUnit', async (req, res) => {
    const units = await Unit.findOne({_id: req.params.id})
    res.send(units)
  })

  app.get('/api/unit/search/:title', async (req, res) => {
    var regex = new RegExp([req.params.title].join(''), 'i')
    const units = await Unit.find({ title: regex })
    res.send(units)
  })

  app.post('/api/unit', async (req, res) => {
    const {
      title,
      type,
      director,
      adress,
      site,
      telephone,
      higherUnit,
      token
    } = req.body
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) res.status(401).json({errMessage: 'Авторизируйтеся для выполнения данного действия'})
      else {
        const checkTitle = await Unit.find({title})
        if (isEmpty(checkTitle)){
          const unit = new Unit({
            title,
            type,
            director,
            adress,
            site,
            telephone,
            higherUnit
          })
          unit.save((err, data) => {
            if (err) console.log(err)
            else res.send(data)
          })
        } else res.status(500).json({errMessage: 'Подразделение с таким названием существует'})
      }
    })
  })

  app.put('/api/unit/:id', async (req, res) => {
    const {
      title,
      type,
      director,
      adress,
      site,
      telephone,
      higherUnit,
      token
    } = req.body
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) res.status(401).json({errMessage: 'Авторизируйтеся для выполнения данного действия'})
      else {
        const oldUnit = await Unit.findOne({_id: req.params.id })
        const newUnit = await Unit.findOneAndUpdate(
          {_id: req.params.id},
          {
            $set: {
              title,
              type,
              director,
              adress,
              site,
              telephone,
              higherUnit
            }
          },
          { new: true }
        )
        const updateWorkers = await Worker.updateMany({ workIn: oldUnit.title}, {$set: {workIn: title}})
        const updateUnits = await Unit.updateMany({ higherUnit: oldUnit.title }, { $set: { higherUnit: title } })
        updateWorkers.save()
        updateUnits.save()
        unit.save((err, data) => {
          if (err) console.log(err)
          else res.send(data)
        })
      }
    })
  })

  app.delete('api/unit/:id', async (req, res) => {
    const oldUnit = await Unit.findOne({_id: req.params.id })
    const unit = await Unit.findOneAndRemove({_id: req.params.id})
    const updateWorkers = await Worker.updateMany({ workIn: oldUnit.title }, { $set: {workIn: title} })
    const updateUnits = await Unit.updateMany({ higherUnit: oldUnit.title }, { $set: { higherUnit: '' } })
    updateWorkers.save()
    updateUnits.save()
    unit.save((err, data) => {
      if (err) console.log(err)
      else res.send(data)
    })
  })
}