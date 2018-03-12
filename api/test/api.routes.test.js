process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

const app = require('../../app').app
const request = require('supertest')
const sinon = require('sinon')
const assert = require('assert')
const expect = require("chai").expect
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

const generatorDocs = require('./docs.generator')

function crearStub(tipo, metodo, response) {
  let modelStub = {}
  if (tipo === 'resolve') {
    modelStub[metodo] = () => { return Promise.resolve(response) }
    return modelStub
  }
  modelStub[metodo] = () => { return Promise.reject(response) }
  return modelStub
}

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

// NOTA: Los errores SERVER_ERROR son hechos por el api.controller.test ya que todavia
//       no encuentro la forma de como hacerlos aqui

describe('Routes - Integration', () => {
  let docs = []
  before(function(done) {
    co(function *() {
      yield ConectarMongo()
      yield mongo.Limpiar()
      done()
    })
  })
  after(function(done) {
    mongo.Desconectar()
    generatorDocs.generateAPI({ docs })
    done()
  })
  beforeEach(function(done) {
    co(function *() {
      yield mongo.Limpiar()
      done()
    })
  })
  describe('GET Profesores Obtener Datos', () => {
    let doc = {
      nombre: 'Profesores Obtener Datos',
      metodo: 'GET',
      url: '/api/att/profesor/paralelos/:profesorCorreo',
      descripcion: 'Da los paralelos para que se pueda escribir en la pagina principal los paralelos',
      params: [
        {
          nombre: 'profesorCorreo',
          tipo: 'String',
          descripcion: ' --- '
        }
      ],
      errors: []
    }
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
        .get('/api/att/profesor/paralelos/' + profesor['correo'])
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc, res })
          expect(ajv.validate(schema.PROFESOR_DATOS, res.body.datos)).to.equal(true)
          expect(res.status).to.equal(200)
          done()
        })
      })
    }).timeout(5000)
    it('NO ES EMAIL', (done) => {
      request(app)
      .get('/api/att/profesor/paralelos/' + 'aa')
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'NO ES EMAIL',  descripcion: 'Cuando el campo _profesorCorreo_ no es válido', docs, doc, res })
        expect(ajv.validate(schema.OK_ERROR, res.body)).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
    it('NO EXISTE', (done) => {
      let profesor = data.profesores[0]
      request(app)
      .get('/api/att/profesor/paralelos/' + profesor['correo'])
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'NO EXISTE', docs, doc, res })
        expect(ajv.validate(schema.OK_ERROR, res.body)).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
  })
  describe('POST Crear Pregunta Estudiante', () => {
    // TODO: si no se envia el campo de creador?
    let doc = {
      nombre: 'Crear pregunta estudiante',
      metodo: 'POST',
      url: '/api/att/estudiante/preguntar',
      descripcion: 'El estudiante crea una pregunta',
      body: [
        { nombre: 'texto', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'paraleloId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'creador', tipo: 'Object', descripcion: ' --- ' },
        { nombre: '_id', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' correo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' matricula', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' nombres', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' apellidos', margen: 'center', tipo: 'String', descripcion: ' --- '},
      ],
      errors: []
    }
    it('OK', (done) => {
      let estudiante = data.estudiantes[0]
      let texto = 'Mi primera pregunta'
      let paraleloId = 'aaaa'
      let req = { 
        texto,
        paraleloId,
        creador: estudiante
      }
      request(app)
      .post(doc['url'])
      .send(req)
      .end(function(err, res) {
        generatorDocs.OK({ docs, doc, res, req })
        expect(ajv.validate(schema.PREGUNTA, res.body.datos)).to.equal(true)
        expect(res.body.estado).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
    it('PARALELOID ES CAMPO OBLIGATORIO', (done) => {
      let estudiante = data.estudiantes[0]
      let req = { 
        texto: 'Mi primera pregunta',
        creador: estudiante
      }
      request(app)
      .post(doc['url'])
      .send(req)
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'PARALELOID ES CAMPO OBLIGATORIO', docs, doc, res, req })
        expect(res.body.datos).to.equal(messages.PARALELOID_VACIO)
        expect(res.body.estado).to.equal(false)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
  })
  describe('PUT Destacar Pregunta', () => {
    let doc = {
      nombre: 'Descatar pregunta',
      metodo: 'PUT',
      url: '/api/att/profesor/destacarPregunta',
      descripcion: 'El profesor coloca como destacada una pregunta que escoja',
      body: [
        { nombre: 'preguntaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'destacadaEstado', tipo: 'Boolean', descripcion: ' --- ' },
      ],
      errors: []
    }
    it('OK', (done) => {
      let estudiante = data.estudiantes[0]
      let texto = 'Mi primera pregunta'
      let paraleloId = 'aaaa'
      
      co(function *() {
        let preguntaCreada = yield model.crearPreguntaEstudiante({ 
        texto: 'Mi primera pregunta', 
        paraleloId: 'aaa', 
        creador: { 
          _id: 'aaa', 
          correo: estudiante['correo'], 
          matricula: estudiante['matricula'], 
          nombres: estudiante['nombres'], 
          apellidos: estudiante['apellidos'] 
        }})
        let req = { 
          preguntaId: preguntaCreada['_id'],
          destacadaEstado: true
        }
        request(app)
          .put(doc['url'])
          .send(req)
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc, res, req })
            expect(res.body.datos).to.equal(messages.PREGUNTA_DESTACADA)
            expect(res.body.estado).to.equal(true)
            expect(res.status).to.equal(200)
            done()
          })
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('PREGUNTA ID NO EXISTE', (done) => {
      let estudiante = data.estudiantes[0]
      let texto = 'Mi primera pregunta'
      let paraleloId = 'aaaa'
      let req = { 
        preguntaId: 'sdasssdas',
        destacadaEstado: true
      }
      request(app)
        .put(doc['url'])
        .send(req)
        .end(function(err, res) {
          generatorDocs.ERROR({ nombre: 'PREGUNTA ID NO EXISTE', docs, doc, res, req })
          expect(res.body.datos).to.equal(messages.PREGUNTAID_NO_EXISTE)
          expect(res.body.estado).to.equal(false)
          expect(res.status).to.equal(200)
          done()
        })
    }).timeout(5000)
  })

  // TODO: error docs
  describe('URL NO VALIDO', () => {
    it('EL URL INGRESADO NO EXISTE', (done) => {
      request(app)
        .put('/api/att/loquesea')
        .end(function(err, res) {
          expect(res.body).to.deep.equal(responses.URL_NO_VALIDO)
          expect(res.body.estado).to.equal(responses.URL_NO_VALIDO.estado)
          expect(res.status).to.equal(responses.URL_NO_VALIDO.codigoEstado)
          done()
        })
    })
  })
  // describe('GET Preguntas Estudiantes Hoy', () => {
  //   it('OK', (done) => {
  //     done()
    //   it('OK', (done) => {
    //   paramsController['model'] = crearStub('resolve', 'obtenerPreguntasEstudiantesPorParalelo', 'return')
    //   const controller = controllerRequire(paramsController)
    //   controller.preguntasEstudianteHoy({ paraleloId:  'aaa'})
    //     .then((response) => {
    //       expect(response['codigoEstado']).to.equal(200)
    //       expect(response['estado']).to.equal(true)
    //       done()
    //     }).catch((err) => console.error(err))
    // })
  //   })
  //   it('PARALELO NO EXISTE', (done) => {
  //     done()
  //   })
  //   it('SERVER ERROR', (done) => {
  //     done()
  //   })
  // })
})


// .send({ profesorCorreo: profesor['correo'] })