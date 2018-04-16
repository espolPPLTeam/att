let urlServidor = ''
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  urlServidor = process.env.MONGO_URL_HEROKU
} else if (process.env.NODE_ENV) {
  urlServidor = `mongodb://localhost/att_${process.env.NODE_ENV}`
} else {
  process.exit(1)
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const server = require('http').Server(app)
const db = require('./api/config/db')
const PORT = process.env.PORT || '8000'
const logger = require('./api/config/logger')
const shortid = require('shortid')
const path = require('path')
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
let urlSession = ''
if (process.env.APP == 'ppl') {
  urlSession = `mongodb://localhost/ppl_${process.env.NODE_ENV}`
} else {
  urlSession = `mongodb://localhost/att_${process.env.NODE_ENV}`
}
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  expire: 1 * 24 * 60 * 60 ,
  saveUninitialized: true,
  name: 'SID',
  unset: 'destroy',
  store: new MongoStore({
      url: urlSession,
      ttl: 12 * 60 * 60
    })
}))

if (process.env.NODE_ENV !== 'testing')
  db.Conectar(urlServidor).then().catch((err) => console.log(err))

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan')
  app.use(morgan('tiny'))
}

app.use('/', express.static(path.join(__dirname, 'client/login')))

const io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})

const apiATT = express()
require('./api/api.server')(apiATT)
app.use('/api/att', apiATT)

const client = express()
require('./client/client.server')(client)
app.use('/att', client)

const realtime = express()
require('./api/sockets')({ io, shortid, logger })
app.use('/sockets/att', realtime)

app.set('port', PORT)

module.exports = {
  app,
  server
}
