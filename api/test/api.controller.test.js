// https://templecoding.com/blog/2016/02/29/how-to-stub-promises-using-sinonjs/
// http://chaijs.com/api/bdd/
// https://www.sitepoint.com/sinon-tutorial-javascript-testing-mocks-spies-stubs/
// https://semaphoreci.com/community/tutorials/best-practices-for-spies-stubs-and-mocks-in-sinon-js
// http://www.zsoltnagy.eu/stubbing-with-sinonjs/
// http://elijahmanor.com/unit-test-like-a-secret-agent-with-sinon-js/
// https://github.com/thlorenz/proxyquire
// https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8
// https://gyandeeps.com/console-stubbing/
// https://stackoverflow.com/questions/30593632/sinon-stub-not-stubbing-original-method
// http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
// https://stackoverflow.com/questions/30625404/how-to-unit-test-console-output-with-mocha-on-nodejs
const assert = require('assert')
const validator = require('validator')
const moment = require('moment')
const sinon = require('sinon')
const expect = require('chai').expect
const co = require('co')
const data = require('./database.mock')
const modelReq = require('../api.model')
const mongoSchema = require('../config/models')
const responses = require('../config/responses')
const logger = require('../config/logger')
require('mocha-sinon')
// var sinonStubPromise = require('sinon-stub-promise')
// sinonStubPromise(sinon)
const model = modelReq({ db: mongoSchema, logger })
process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})

const controllerReq = require('../api.controller')

describe('Controller', () =>  {
  let stubedFetch
  before(function(done) {
  	done()
  })
  after(function(done) {
  	// sinon.restore(model)
  	done()
  })
  beforeEach(function(done) {
  	this.f = sinon.stub()
  	done()
  })
  describe('obtener datos profesor', () =>  {
  	beforeEach(function() {
    	this.sinon.stub(logger, 'error')
  	})
  	const modelMock = ({}) => {
      const proto = {
  		obtenerDatosProfesorPorCorreo() {
  		  return new Promise(function(resolve) {
  		    resolve({ profesor: profesor['correo'] })
  		  })
  		}
  	  }
  	  return Object.assign(Object.create(proto), {})
  	}
  	const profesor = data.profesores[0]
  	it('OK', (done) => {
  	  const controller = controllerReq({ responses, model: modelMock({}), logger, validator, moment })
  	  co(function *() {
  	    let response = yield controller.ObtenerParalelosProfesor({ profesorCorreo: profesor['correo'] })
  	    assert.equal(response['estado'], true, 'La accion debe ser valida')
  	    assert.equal(response['codigoEstado'], 200, 'http OK')
  	    done()
  	  }).catch((err) => console.error(err))
    })
    it('BODY ERROR', (done) => {
      const controller = controllerReq({ responses, model: modelMock({}), logger, validator, moment })
  	  co(function *() {
  	    let response = yield controller.ObtenerParalelosProfesor({ profesorCorreo: 'aaaa' })
  	    assert.equal(response['estado'], false, 'La accion debe ser valida')
  	    assert.equal(response['codigoEstado'], 200, 'http OK')
  	    assert.equal(response['datos'], 'El correo no es válido', 'http OK')
  	    done()
  	  }).catch((err) => console.error(err))
    })
    it('SERVER ERROR', (done) => {
  	  co(function *() {
  	  	const modelErrorMock = ({}) => {
      	  const proto = {
  		    obtenerDatosProfesorPorCorreo() {
  		      return new Promise(function(resolve, reject) {
  		        reject({ message: 'Error mensaje'})
  		      })
  		    }
  	  	  }
  	  	  return Object.assign(Object.create(proto), {})
  		}
  		const controller = controllerReq({ responses, model: modelErrorMock({}), logger, validator, moment })
  	    let response = yield controller.ObtenerParalelosProfesor({ profesorCorreo: profesor['correo'] })
  	    expect(response).to.deep.equal(responses.ERROR_SERVIDOR)
  	    expect( logger.error.calledOnce ).to.be.true
  	    done()
  	  }).catch((err) => console.error(err))
    })
  })
})