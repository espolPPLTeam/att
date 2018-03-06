const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const PORT = process.env.PORT || '8000'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// const api = express()
// require('./app_api/routes.api')(api)
// app.use('/api', api)

app.set('port', PORT)

module.exports = {
  app,
  server
}