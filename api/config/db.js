const mongoose = require('mongoose')

mongoose.Promise = Promise
var conn
var db
let Conectar = function(url) {
  return new Promise(function(resolve) {
    let options = {}
    if (process.env.NODE_ENV === 'production')
      options = { autoIndex: false }
    db = mongoose.createConnection(url, options)
    // db = mongoose.connection
    db.on('error', function(err) {
      console.log(`error ${err}`)
    })

    db.on('connected', function() {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
        console.log(`base de datos conectada ATT`)
    })

    db.on('disconnected', function() {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
        console.log(`base de datos desconectada`)
    })
    resolve(db)
  })
}

let getDatabaseConnection = function() {
  return db
}

let Desconectar = function() {
   mongoose.connection.close()
}

let Limpiar = function() {
  return new Promise(function(resolve) {
    resolve(mongoose.connection.dropDatabase())
  })
}

module.exports = {
  Conectar,
  Desconectar,
  Limpiar,
  getDatabaseConnection
}
