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

describe('Controller', () =>  {
  const paramsController = { responses, messages, model: {}, logger, validator }
  const controllerRequire = require('../api.controller')

  describe('@t1 ObtenerParalelosProfesor', () =>  {
    const profesor = data.profesores[0]
  	beforeEach(function() {
      this.sinon.stub(logger, 'error')
  	})
    it('@t1.1 SERVER ERROR', (done) => {
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

  // describe('@t2 preguntasEstudianteHoy', () =>  {
  //   beforeEach(function() {
  //     this.sinon.stub(logger, 'error')
  //   })
  //   it('@t2.1 SERVER ERROR', (done) => {
  //     paramsController['model'] = crearStub('reject', 'obtenerPreguntasEstudiantesPorParalelo', 'return')
  //     const controller = controllerRequire(paramsController)
  //     controller.PreguntasEstudianteHoy({ paraleloId:  'aaa'})
  //       .then((response) => {
  //         expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
  //         expect(logger.error.calledOnce).to.be.true
  //         done()
  //       }).catch((err) => console.error(err))
  //   })
  // })

  describe('@t3 crearPreguntaEstudiante', () =>  {
    let estudiante = data.estudiantes[0]
    beforeEach(function() {
      this.sinon.stub(logger, 'error')
    })
    it('@t3.1 SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'crearPreguntaEstudiante', 'return')
      const controller = controllerRequire(paramsController)
      controller.CrearPreguntaEstudiante({
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

  describe('@t4 destacarPregunta', () =>  {
    beforeEach(function() {
      this.sinon.stub(logger, 'error')
    })
    it('@t4.1 SERVER ERROR', (done) => {
      paramsController['model'] = crearStub('reject', 'destacarPregunta', 'return')
      const controller = controllerRequire(paramsController)
      controller.DestacarPregunta({ preguntaId: 'aaa', destacadaEstado: true })
        .then((response) => {
          expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
          expect(logger.error.calledOnce).to.be.true
          done()
        }).catch((err) => console.error(err))
    })
  })

})
