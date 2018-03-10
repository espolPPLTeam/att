const app = require('../../app').app
const request = require('supertest')
const sinon = require('sinon')
const assert = require('assert')
const expect    = require("chai").expect
const co = require('co')
const moment = require('moment')
const validator = require('validator')
const Ajv = require('ajv')

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
        .get('/api/att/profesor/paralelos' + profesor['correo'])
        .end(function(err, res) {
          console.log(res.body)
     //      let profesorRes = profesor
     //      let paralelos = 
     //      expect(profesorRes['']).to.equal(profesor['correo'])
     //       paralelos: [ [Object] ],
     // correo: 'mheredia@espol.edu.ec',
     // tipo: 'titular',
     // nombres: 'TAMARA',
     // apellidos: 'HEREDIA' }
          // res.status.should.equal(200)
          // res.should.be.json
          // res.should.have.status(201)
          // res.body.error.should.equal(false);
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