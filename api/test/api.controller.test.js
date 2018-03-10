const validator = require('validator')
const moment = require('moment')
const sinon = require('sinon')
const expect = require('chai').expect
const co = require('co')

const data = require('./database.mock')
const responses = require('../config/responses')
const logger = require('../config/logger')
const messages = require('../config/messages')
const modelReq = require('../api.model')
require('mocha-sinon')

process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})

function crearStub(tipo, metodo, response) {
  let modelStub = {}
  if (tipo === 'resolve') {
    modelStub[metodo] = () => { return Promise.resolve(response) }
    return modelStub
  }
  modelStub[metodo] = () => { return Promise.reject(response) }
  return modelStub
}

// FIXME: como saber si le estoy pasando los datos correctos a los metodos
describe('Controller', () =>  {
  const paramsController = { responses, messages, model: {}, logger, validator }
  const controllerRequire = require('../api.controller')
  
  describe('obtener datos profesor', () =>  {
    const profesor = data.profesores[0]
  	beforeEach(function() {
      this.sinon.stub(logger, 'error')
  	})
  	it('OK', (done) => {
      paramsController['model'] = crearStub('resolve', 'obtenerDatosProfesorPorCorreo', 'return')
  	  const controller = controllerRequire(paramsController)
      controller.ObtenerParalelosProfesor({ profesorCorreo: profesor['correo'] })
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(true)
          done()
        }).catch((err) => console.error(err))
    })
    it('PROFESOR NO EXISTE', (done) => {
      paramsController['model'] = crearStub('resolve', 'obtenerDatosProfesorPorCorreo', null)
      const controller = controllerRequire(paramsController)
      controller.ObtenerParalelosProfesor({ profesorCorreo: profesor['correo'] })
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(false)
          expect(response['datos']).to.equal(messages.PROFESOR_NO_EXISTE)
          done()
        }).catch((err) => console.error(err))
    })
    it('BODY ERROR', (done) => {
      paramsController['model'] = crearStub('resolve', 'obtenerDatosProfesorPorCorreo', 'return')
      const controller = controllerRequire(paramsController)
      controller.ObtenerParalelosProfesor({ profesorCorreo: 'aaaa' })
        .then((response) => {
          expect(response['estado']).to.equal(false)
          expect(response['codigoEstado']).to.equal(200)
          expect(response['datos']).to.equal(messages.CORREO_INVALIDO)
          done()
        }).catch((err) => console.error(err))
    })
    it('SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'obtenerDatosProfesorPorCorreo', 'return')
      const controller = controllerRequire(paramsController)
      controller.ObtenerParalelosProfesor({ profesorCorreo: profesor['correo'] })
        .then((response) => {
          expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
          expect(logger.error.calledOnce).to.be.true
          done()
        }).catch((err) => console.error(err))
    })
  })
  describe('preguntas estudiantes hoy', () =>  {
    beforeEach(function() {
      this.sinon.stub(logger, 'error')
    })
    it('OK', (done) => {
      paramsController['model'] = crearStub('resolve', 'obtenerPreguntasEstudiantesPorParalelo', 'return')
      const controller = controllerRequire(paramsController)
      controller.preguntasEstudianteHoy({ paraleloId:  'aaa'})
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(true)
          done()
        }).catch((err) => console.error(err))
    })
    it('SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'obtenerPreguntasEstudiantesPorParalelo', 'return')
      const controller = controllerRequire(paramsController)
      controller.preguntasEstudianteHoy({ paraleloId:  'aaa'})
        .then((response) => {
          expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
          expect(logger.error.calledOnce).to.be.true
          done()
        }).catch((err) => console.error(err))
    })
  })
  describe('crear pregunta estudiante', () =>  {
    let estudiante = data.estudiantes[0]
    beforeEach(function() {
      this.sinon.stub(logger, 'error')
    })
    it('OK', (done) => {
      paramsController['model'] = crearStub('resolve', 'crearPreguntaEstudiante', 'return')
      const controller = controllerRequire(paramsController)
      controller.crearPreguntaEstudiante({ 
        texto: 'Mi primera pregunta', 
        paraleloId: 'aaa', 
        creador: { 
          _id: 'aaa', 
          correo: estudiante['correo'], 
          matricula: estudiante['matricula'], 
          nombres: estudiante['nombres'], 
          apellidos: estudiante['apellidos'] 
        } })
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(true)
          done()
        }).catch((err) => console.error(err))
    })
    it('BODY ERROR', (done) => {
      paramsController['model'] = crearStub('resolve', 'crearPreguntaEstudiante', 'return')
      const controller = controllerRequire(paramsController)
      controller.crearPreguntaEstudiante({ 
        texto: 'Mi primera pregunta', 
        paraleloId: '', 
        creador: {
          _id: 'aaa', 
          correo: estudiante['correo'], 
          matricula: estudiante['matricula'], 
          nombres: estudiante['nombres'], 
          apellidos: estudiante['apellidos'] 
        } })
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(false)
          expect(response['datos']).to.equal(messages.PARALELOID_VACIO)
          done()
        }).catch((err) => console.error(err))
    })
    it('SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'crearPreguntaEstudiante', 'return')
      const controller = controllerRequire(paramsController)
      controller.crearPreguntaEstudiante({ 
        texto: 'Mi primera pregunta', 
        paraleloId: 'aaa', 
        creador: { 
          _id: 'aaa', 
          correo: estudiante['correo'], 
          matricula: estudiante['matricula'], 
          nombres: estudiante['nombres'], 
          apellidos: estudiante['apellidos'] 
        } })
        .then((response) => {
          expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
          expect(logger.error.calledOnce).to.be.true
          done()
        }).catch((err) => console.error(err))
    })
  })
  describe('destacar pregunta', () =>  {
    beforeEach(function() {
      this.sinon.stub(logger, 'error')
    })
    it('OK', (done) => {
      paramsController['model'] = crearStub('resolve', 'destacarPregunta', 'return')
      const controller = controllerRequire(paramsController)
      controller.destacarPregunta({ preguntaId: 'aaa', destacadaEstado: true })
        .then((response) => {
          expect(response['codigoEstado']).to.equal(200)
          expect(response['estado']).to.equal(true)
          done()
        }).catch((err) => console.error(err))
    })
    it('PREGUNTAID NO EXISTE', (done) => {
      done()
    })
    it('SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'destacarPregunta', 'return')
      const controller = controllerRequire(paramsController)
      controller.destacarPregunta({ preguntaId: 'aaa', destacadaEstado: true })
        .then((response) => {
          expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
          expect(logger.error.calledOnce).to.be.true
          done()
        }).catch((err) => console.error(err))
    })
  })
})