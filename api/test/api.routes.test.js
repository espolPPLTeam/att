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
  describe('@t1 GET Profesores Obtener Datos', () => {
    let doc = {
      nombre: 'Profesores Obtener Datos',
      metodo: 'GET',
      url: '/api/att/profesor/datosProfesor/:profesorCorreo',
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
    it('@t1.1 OK', (done) => {
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
        .get('/api/att/profesor/datosProfesor/' + profesor['correo'])
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc, res })
          expect(ajv.validate(schema.PROFESOR_DATOS, res.body.datos)).to.equal(true)
          expect(res.status).to.equal(200)
          done()
        })
      })
    }).timeout(5000)
    it('@t1.2 NO ES EMAIL', (done) => {
      request(app)
      .get('/api/att/profesor/datosProfesor/' + 'aa')
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'NO ES EMAIL',  descripcion: 'Cuando el campo _profesorCorreo_ no es válido', docs, doc, res })
        expect(ajv.validate(schema.OK_ERROR, res.body)).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
    it('@t1.3 NO EXISTE', (done) => {
      let profesor = data.profesores[0]
      request(app)
      .get('/api/att/profesor/datosProfesor/' + profesor['correo'])
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'NO EXISTE', docs, doc, res })
        expect(ajv.validate(schema.OK_ERROR, res.body)).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
  })
  describe('@t2 POST Crear Pregunta Estudiante', () => {
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
    it('@t2.1 OK', (done) => {
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
    it('@t2.2 PARALELOID ES CAMPO OBLIGATORIO', (done) => {
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
  describe('@t3 PUT Destacar Pregunta', () => {
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
    it('@t3.1 OK', (done) => {
      let estudiante = data.estudiantes[0]
      let paralelo = data.paralelos[0]
      let texto = 'Mi primera pregunta'

      co(function *() {
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let paraleloId = paraleloCreado['_id']
        let preguntaCreada = yield model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta',
        paraleloId,
        creador: {
          _id: paraleloId,
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
    it('@t3.2 PREGUNTA ID NO EXISTE', (done) => {
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
  describe('@t4 URL NO VALIDO', () => {
    it('@t4.1 EL URL INGRESADO NO EXISTE', (done) => {
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
  describe('@t5 GET Preguntas Estudiantes Hoy', () => {
    let doc = {
      nombre: 'Preguntas Estudiantes Hoy',
      metodo: 'GET',
      url: '/api/att/profesor/preguntasEstudianteHoy/:paraleloId',
      descripcion: 'Obtiene las preguntas que se hicieron el dia actual en el paralelo enviado',
      params: [
        {
          nombre: 'paraleloId',
          tipo: 'String',
          descripcion: ' -- '
        }
      ],
      errors: []
    }
    it('@t5.1 OK', (done) => {
      let paralelo = data.paralelos[0]
      let estudiante_1 = data.estudiantes[0]
      let estudiante_2 = data.estudiantes[1]
      let pregunta_1 = {

      }
      let pregunta_2 = {

      }
      co(function *() {
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let paraleloId = paraleloCreado['_id']
        let preguntaCreada_1 = yield model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta estudiante 1',
        paraleloId,
        creador: {
          _id: paraleloId,
          correo: estudiante_1['correo'],
          matricula: estudiante_1['matricula'],
          nombres: estudiante_1['nombres'],
          apellidos: estudiante_1['apellidos']
        }})
        let preguntaCreada_2 = yield model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta estudiante 2',
        paraleloId,
        creador: {
          _id: paraleloId,
          correo: estudiante_2['correo'],
          matricula: estudiante_2['matricula'],
          nombres: estudiante_2['nombres'],
          apellidos: estudiante_2['apellidos']
        }})
        request(app)
        .get(`/api/att/profesor/preguntasEstudianteHoy/${paraleloId}`)
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc, res })
          expect(res.body.estado).to.equal(true)
          expect(res.status).to.equal(200)
          expect(ajv.validate(schema.PREGUNTAS_HOY_ESTUDIANTES, res.body.datos[0])).to.equal(true)
          done()
        })
      })
    }).timeout(5000)
  })
  describe('@t6 GET PREGUNTAS HECHAS POR ESTUDIANTE', () => {
    let doc = {
      nombre: 'Estudiante preguntas hechas',
      metodo: 'GET',
      url: '/api/att/estudiante/misPreguntasHoy/:correo',
      descripcion: 'Obtiene las preguntas que ha hecho el estudiante el dia de hoy',
      params: [
        {
          nombre: 'correo',
          tipo: 'String',
          descripcion: ' -- '
        }
      ],
      errors: []
    }
    it('@t6.1 OK', (done) => {
      let estudiante = data.estudiantes[0]
      let estudiante_2 = data.estudiantes[1]
      let paralelo = data.paralelos[0]
      co(function *() {
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let estudianteCreado_2 = yield model.crearEstudiante(estudiante_2)
        let correo = estudiante['correo']
        let correo_2 = estudiante_2['correo']
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let preguntaCreada_1 = yield model.crearPreguntaEstudiante({ texto: 'Mi pregunta', paraleloId: paraleloCreado['_id'], creador: estudianteCreado })
        let preguntaCreada_2 = yield model.crearPreguntaEstudiante({ texto: 'Mi pregunta dos', paraleloId: paraleloCreado['_id'], creador: estudianteCreado })
        let preguntaCreada_3 = yield model.crearPreguntaEstudiante({ texto: 'Mi pregunta dos', paraleloId: paraleloCreado['_id'], creador: estudianteCreado_2 })
        request(app)
        .get(`/api/att/estudiante/misPreguntasHoy/${correo}`)
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc, res })
          expect(res.body.estado).to.equal(true)
          expect(res.status).to.equal(200)
          expect(ajv.validate(schema.PREGUNTA_ESTUDIANTE, res.body.datos[0])).to.equal(true)
          done()
        })
      })
      // let texto = 'Mi primera pregunta'
      // let paraleloId = 'aaaa'
      // let req = {
      //   texto,
      //   paraleloId,
      //   creador: estudiante
      // }
      // request(app)
      // .post(``)
      // .send(req)
      // .end(function(err, res) {
      //   generatorDocs.OK({ docs, doc, res, req })
      //   expect(ajv.validate(schema.PREGUNTA, res.body.datos)).to.equal(true)
      //   expect(res.body.estado).to.equal(true)
      //   expect(res.status).to.equal(200)
      //   done()
      // })
    }).timeout(5000)
  })
})


// .send({ profesorCorreo: profesor['correo'] })
