const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const db = require('./config/db')
const app = express()

require('./models/Unit')
require('./models/Type')
require('./models/Worker')
require('./models/User')

const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  next()
})

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

mongoose.connect(db.url)

require('./routes/unitRoutes')(app)
require('./routes/userRoutes')(app)
require('./routes/typeRoutes')(app)

app.listen(PORT, () => console.log(`Listen port ${PORT}`))