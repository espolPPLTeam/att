const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app)
const db = require('./api/config/db')
const PORT = process.env.PORT || '8000'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

db.Conectar(process.env.MONGO_URL)

const io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})

const apiATT = express()
require('./api/api.server')(apiATT)
app.use('/api/att', apiATT)

const client = express()
require('./client/client.server')(client)
app.use('/att', client)

const realtime = express()
require('./api/sockets')({ io })
app.use('/sockets/att', realtime)

app.set('port', PORT)

module.exports = {
  app,
  server
}