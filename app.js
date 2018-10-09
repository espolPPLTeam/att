// USADO CON PPL
function app (ioPPL) {
  let urlServidor = ''
  if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === 'development:cas') {
      urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}_v2`
    } else {
      urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}_v2`
    }
  } else {
    process.exit(1)
  }

  const express = require('express')
  const bodyParser = require('body-parser')
  const app = express()
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const MongoStore = require('connect-mongo')(session)
  const db = require('./api/config/db')
  const server = require('http').Server(app)
  const PORT = process.env.ATT_PORT || '8003'
  const logger = require('./api/config/logger')
  const shortid = require('shortid')
  const path = require('path')
  const CronJob = require('cron').CronJob
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  if (process.env.NODE_ENV !== 'testing') {
    db.Conectar(urlServidor).then(() => {
    }).catch((err) => console.log(err))
  }

  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan')
    app.use(morgan('tiny'))
  }

  app.use('/', express.static(path.join(__dirname, 'client/login')))
  let io = ioPPL
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
  return app
}

// USADO EN DEVELOPMENT ATT
const att = () => {
  let URL_DB = `mongodb://localhost/ppl_${process.env.NODE_ENV}_v2`

  const express = require('express')
  const bodyParser = require('body-parser')
  const app = express()
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const shortid = require('shortid')
  const path = require('path')
  const cors = require('cors')
  const morgan = require('morgan')
  const db = require('./api/config/db')
  const server = require('http').Server(app)
  const PORT = process.env.ATT_PORT
  const logger = require('./api/config/logger')
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(cors())
  app.use(morgan('tiny'))
  app.use(bodyParser.urlencoded({ extended: false }))

  if (process.env.NODE_ENV !== 'testing') {
    db.Conectar(URL_DB).then(() => {}).catch((err) => console.log(err))
  }

  // app.use('/', express.static(path.join(__dirname, 'client/login')))
  let io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})
  const apiATT = express()
  require('./api/api.server')(apiATT)
  app.use('/api/att', apiATT)

  const client = express()
  require('./client/client.server')(client)
  app.use('/att', client)

  const realtime = express()
  require('./api/sockets')({ io, shortid, logger })
  app.use('/api/att/sockets', realtime)

  app.set('port', PORT)
  return { app, server }
}

module.exports = {
  app,
  att
}
