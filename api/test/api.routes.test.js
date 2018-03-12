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
      response: {},
      errors: [
      ]
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
          doc['response'] = generatorDocs.toString(res.body)
          docs.push(doc)
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
          doc['errors'].push({ nombre: 'NO ES EMAIL', response: generatorDocs.toString(res.body), descripcion: 'Cuando el campo _profesorCorreo_ no es válido' })
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
        doc['errors'].push({ nombre: 'NO EXISTE', response: generatorDocs.toString(res.body)})
        expect(ajv.validate(schema.OK_ERROR, res.body)).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
    it('SERVER ERROR', (done) => {
      // TODO: como seria?, que medias tomaria?
      // const controller = controllerRequire({ responses, messages, model: crearStub('reject', 'ObtenerParalelosProfesor', ''), logger, validator })
      // doc['errors'].push({ nombre: 'SERVER ERROR', response: generatorDocs.toString({ nombre: 'Joel' })})
      done()
    }).timeout(5000)
  })
  describe('POST Crear Pregunta Estudiante', () => {
    // TODO: si no se enviar el campo de creador?
    let doc = {
      nombre: 'Crear pregunta estudiante',
      metodo: 'POST',
      url: '/api/att/estudiante/preguntar',
      descripcion: 'El estudiante crea una pregunta',
      request: {},
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
      response: {},
      errors: [
      ]
    }
    it('OK', (done) => {
      let estudiante = data.estudiantes[0]
      let texto = 'Mi primera pregunta'
      let paraleloId = 'aaaa'
      let send = { 
        texto,
        paraleloId,
        creador: estudiante
      }
      doc['request'] = generatorDocs.toString(send)
      request(app)
      .post('/api/att/estudiante/preguntar')
      .send(send)
      .end(function(err, res) {
        expect(ajv.validate(schema.PREGUNTA, res.body.datos)).to.equal(true)
        doc['response'] = generatorDocs.toString(res.body)
        docs.push(doc)
        expect(res.body.estado).to.equal(true)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
    it('PARALELOID ES CAMPO OBLIGATORIO', (done) => {
      let estudiante = data.estudiantes[0]
      let send = { 
        texto: 'Mi primera pregunta',
        creador: estudiante
      }
      request(app)
      .post('/api/att/estudiante/preguntar')
      .send(send)
      .end(function(err, res) {
        doc['errors'].push({ nombre: 'PARALELOID ES CAMPO OBLIGATORIO', response: generatorDocs.toString(res.body), request: generatorDocs.toString(send)})
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
      descripcion: 'El profesor pone como destacada una pregunta que escoja',
      request: {},
      body: [
        { nombre: 'preguntaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'destacadaEstado', tipo: 'Boolean', descripcion: ' --- ' },
      ],
      response: {},
      errors: [
      ]
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
        let send = { 
          preguntaId: preguntaCreada['_id'],
          destacadaEstado: true
        }
        doc['request'] = generatorDocs.toString(send)
        request(app)
          .put('/api/att/profesor/destacarPregunta')
          .send(send)
          .end(function(err, res) {
            doc['response'] = generatorDocs.toString(res.body)
            docs.push(doc)
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
      let send = { 
        preguntaId: 'sdasssdas',
        destacadaEstado: true
      }
      request(app)
        .put('/api/att/profesor/destacarPregunta')
        .send(send)
        .end(function(err, res) {
          doc['errors'].push({ nombre: 'PREGUNTA ID NO EXISTE', response: generatorDocs.toString(res.body), request: generatorDocs.toString(send)})
          expect(res.body.datos).to.equal(messages.PREGUNTAID_NO_EXISTE)
          expect(res.body.estado).to.equal(false)
          expect(res.status).to.equal(200)
          done()
        })
    }).timeout(5000)
  })
  // describe('GET Preguntas Estudiantes Hoy', () => {
  //   it('OK', (done) => {
  //     done()
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