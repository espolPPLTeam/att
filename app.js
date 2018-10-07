// USADO CON PPL
function app (ioPPL) {
  let urlServidor = ''
  if (process.env.NODE_ENV) {
    if (process.env.NODE_ENV === 'development:cas') {
      urlServidor = `mongodb://localhost/att_development`
    } else {
      urlServidor = `mongodb://localhost/att_${process.env.NODE_ENV}`
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
  const PORT = process.env.PORT || '8000'
  const logger = require('./api/config/logger')
  const shortid = require('shortid')
  const path = require('path')
  const CronJob = require('cron').CronJob
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  if (process.env.NODE_ENV === 'production') {
    new CronJob('00 23 55 * * *', function() {

    })
  }

  if (process.env.NODE_ENV !== 'testing') {
    db.Conectar(urlServidor).then(() => {
      if (process.env.NODE_ENV === 'production') {
        try {
          const WSPPL = require('../web_service/index.js')
          const dbWebService = require('./scripts/webService.db')
          const { exec } = require('child_process')
          const rutaScriptBackup = path.join(__dirname, 'scripts', 'mongoBackup.sh')
          const wsPPL = WSPPL({ db: dbWebService, local: false })
          wsPPL.inicializar().then(() => {
            new CronJob('00 00 00 * * *', function() {
              exec(`sh ${rutaScriptBackup}`, function (error, stdout, stderr) {
                if (error) {
                  console.error(error)
                } else {
                  wsPPL.actualizar()
                }
              })
            }, null, true, 'America/Guayaquil')
          })
        } catch(err) {
          console.error('No esta integrado web_service libreria')
          console.log(err)
        }
      }
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
  let urlServidor = ''
  if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
    urlServidor = process.env.MONGO_URL_HEROKU
  } else if (process.env.NODE_ENV) {
    urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}_v2`
  } else {
    process.exit(1)
  }

  const express = require('express')
  const bodyParser = require('body-parser')
  const app = express()
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const MongoStore = require('connect-mongo')(session)
  const shortid = require('shortid')
  const path = require('path')
  const CronJob = require('cron').CronJob
  const db = require('./api/config/db')
  const server = require('http').Server(app)
  const PORT = process.env.PORT || '8000'
  const logger = require('./api/config/logger')
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(session({
    secret: process.env.SECRET,
    resave: true,
    expire: 1 * 24 * 60 * 60 ,
    saveUninitialized: true,
    name: 'SID',
    unset: 'destroy',
    store: new MongoStore({
        url: urlServidor,
        ttl: 12 * 60 * 60
      })
  }))

  if (process.env.NODE_ENV !== 'testing') {
    db.Conectar(urlServidor).then(() => {
      try {
        const WSPPL = require('../web_service/index.js')
        const dbWebService = require('./scripts/webService.db')
        const dump = require('../web_service/dump')
        const { exec } = require('child_process')
        const rutaScriptBackup = path.join(__dirname, 'scripts', 'mongoBackup.sh')
        const wsPPL = WSPPL({ db: dbWebService, anio: '2017', termino: '2s', local: true, dump })
        wsPPL.inicializar().then(() => {
          // wsPPL.actualizar()
          // new CronJob('00 00 23 * * *', function() {
          //   exec(`sh ${rutaScriptBackup}`, function (error, stdout, stderr) {
          //     if (error) {
          //       console.error(error)
          //     } else {
          //       wsPPL.actualizar()
          //     }
          //   })
          // }, null, true, 'America/Guayaquil')
        })
      } catch(err) {
        console.error('No esta integrado web_service libreria')
        console.log(err)
      }
    }).catch((err) => console.log(err))
  }

  if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan')
    app.use(morgan('tiny'))
  }

  app.use('/', express.static(path.join(__dirname, 'client/login')))
  let io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})
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
  return { app, server }
}

module.exports = {
  app,
  att
}
