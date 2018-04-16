process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

request = require('supertest')
sinon = require('sinon')
assert = require('assert')
expect = require("chai").expect
co = require('co')
moment = require('moment')
validator = require('validator')
Ajv = require('ajv')
ajv = new Ajv({$data: true})

data = require('./database.mock')
controllerRequire = require('../api.controller')
modelRequire = require('../api.model')
logger = require('../config/logger')
schema = require('../config/schemas')
mongo = require('../config/db')
responses = require('../config/responses')
messages = require('../config/messages')
generatorDocs = require('./docs.generator')
ConectarMongo = async function () {
  try {
    await mongo.Conectar(`mongodb://localhost/att_${process.env.NODE_ENV}`)
  } catch (err) {
    console.error(err)
    exit(1)
  }
}


// COMENTARIOS POR SI LAS MOSCAS
// crearStub = function (tipo, metodo, response) {
//   let modelStub = {}
//   if (tipo === 'resolve') {
//     modelStub[metodo] = () => { return Promise.resolve(response) }
//     return modelStub
//   }
//   modelStub[metodo] = () => { return Promise.reject(response) }
//   return modelStub
// }
