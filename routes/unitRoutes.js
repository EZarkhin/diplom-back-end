const mongoose = require('mongoose')
const Unit = mongoose.model('Unit')
const isEmpty = require('lodash').isEmpty

module.exports = app => {
  app.get('/api/unit/get', async (req, res) => {
    const units = await Unit.find({})
    isEmpty(units) 
    ? res.status(500).json('Подразделений не найдено') 
    : res.send(units)
  })

  app.get('/api/unit/get/:id', async (req, res) => {
    const units = await Unit.findOne({_id: req.params.id})
      isEmpty(units) 
      ? res.status(500).json('Подразделение не найдено') 
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
      higherUnit
    } = req.body
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
  })

  app.put('/api/unit/:id', async (req, res) => {
    const {
      title,
      type,
      director,
      adress,
      site,
      telephone,
      higherUnit
    } = req.body
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

    const updateUnits = await Unit.updateMany({ higherUnit: oldUnit.title }, { $set: { higherUnit: title } })
    updateUnits.save()
    unit.save((err, data) => {
      if (err) console.log(err)
      else res.send(data)
    })
  })

  app.delete('api/unit/:id', async (req, res) => {
    const oldUnit = await Unit.findOne({_id: req.params.id })
    const unit = await Unit.findOneAndRemove({_id: req.params.id})
    const updateUnits = await Unit.updateMany({ higherUnit: oldUnit.title }, { $set: { higherUnit: '' } })
    updateUnits.save()
    unit.save((err, data) => {
      if (err) console.log(err)
      else res.send(data)
    })
  })
}