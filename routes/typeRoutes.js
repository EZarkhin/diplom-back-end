const mongoose = require('mongoose')
const Type = mongoose.model('Type')
const Unit = mongoose.model('Unit')
const isEmpty = require('lodash').isEmpty

module.exports = app => {
  app.get('/api/type/get', async (req, res) => {
    const types = await Type.find({})
    isEmpty(types) 
      ? res.status(500).json('Типов не найдено') 
      : res.send(types)
  })

  app.get('/api/type/get/:id', async (req, res) => {
    const types = await Type.findOne({_id: req.params.id})
    isEmpty(types) 
      ? res.status(500).json('Тип не найден') 
      : res.send(types)
  })

  app.post('/api/type/', async (req, res) => {
    const { title } = req.body
    const type = new Type({ title })
    type.save((err, data) => {
      if (err) console.log(err)
      res.send(data)
    })

  })

  app.delete('/api/type/:id', async (req, res) => {
    const oldType = await Type.findOne({_id: req.params.id})
    const newType = await Type.findOneAndRemove({_id: req.params.id})

    const updatedUnits = await Unit.updateMany(
      { type: oldType.title},
      { $set: { type: '' } }
    )
    updatedUnits.save()
    newType.save((err, date) => {
      if (err) console.log(err)
      else res.send(data)
    })
  })

  app.put('/api/type/:id', async (req, res) => {
    const { title } = req.body
    const oldType = await Type.findOne({_id: req.params.id})
    const newType = await Type.findOneAndUpdate(
      {_id: req.params.id}, 
      { $set: { title } },
      {new: true}
    )

    const updatedUnits = await Unit.updateMany(
      { type: oldType.title},
      { $set: { type: title }}
    )
    updatedUnits.save()
    newType.save((err, date) => {
      if (err) console.log(err)
      else res.send(data)
    })
  })
}