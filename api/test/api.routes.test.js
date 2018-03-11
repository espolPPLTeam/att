process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

const app = require('../../app').app
const request = require('supertest')
const sinon = require('sinon')
const assert = require('assert')
const expect    = require("chai").expect
const co = require('co')
const moment = require('moment')
const validator = require('validator')
const Ajv = require('ajv')
const ajv = new Ajv({$data: true})

const schema = require('../config/schemas')
const data = require('./database.mock')
const controllerRequire = require('../api.controller')
const modelRequire = require('../api.model')
const logger = require('../config/logger')
const responses = require('../config/responses')
const mongo = require('../config/db')
const messages = require('../config/messages')
const db = require('../config/models')

const model = modelRequire({ db, logger })
const controller = controllerRequire({ responses, messages, model, logger, validator })

async function ConectarMongo() {
  try {
    await mongo.Conectar(process.env.MONGO_URL_ATT_TEST)
  } catch (err) {
    console.error(err)
    exit(1)
  }
}

describe('Routes - Integration', () => {
  before(function(done) {
    co(function *() {
      yield ConectarMongo()
      yield mongo.Limpiar()
      done()
    })
  })
  after(function(done) {
    mongo.Desconectar()
    done()
  })
  beforeEach(function(done) {
    co(function *() {
      yield mongo.Limpiar()
      done()
    })
  })
  describe('GET Profesores Obtener Datos', () => {
    it('OK', (done) => {
      // let params
      // let body
      // let request
      // let response
      let profesor = data.profesores[0]
      let paralelo = data.paralelos[0]
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        yield model.anadirProfesorAParalelo({ 
          paralelo: { 
            curso: paralelo['curso'], 
            codigo: paralelo['codigo']
          }, 
          profesorCorreo: profesor['correo'] })
        request(app)
        .get('/api/att/profesor/paralelos/' + profesor['correo'])
        .end(function(err, res) {
          expect(ajv.validate(schema.PROFESOR_DATOS, res.body.datos)).to.equal(true)
          expect(res.status).to.equal(200)
          done()
        })
      })
    }).timeout(5000)
    it('NO ES EMAIL', (done) => {
      done()
    })
    it('NO EXISTE', (done) => {
      done()
    })
    it('SERVER ERROR', (done) => {
      done()
    })
  })
})


// .send({ profesorCorreo: profesor['correo'] })