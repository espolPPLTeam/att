process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})
const assert = require('assert')
const co = require('co')
const data = require('./database.mock')
const mongoSchema = require('../config/models')
const mongo = require('../config/db')
const messages = require('../config/messages')
const logger = require('../config/logger')
const sinon = require('sinon')
const expect = require('chai').expect
require('mocha-sinon')

function crearStub(tipo, metodo, response) {
  let modelStub = {}
  if (tipo === 'resolve') {
    modelStub[metodo] = () => { return Promise.resolve(response) }
    return modelStub
  }
  modelStub[metodo] = () => { return Promise.reject(response) }
  return modelStub
}

const apiModel = require('../api.model')({ db: mongoSchema, logger, messages })

describe('Model', () =>  {
  before(function(done) {
    co(function *() {
      yield mongo.Conectar(process.env.MONGO_URL_ATT_TEST)
      yield mongo.Limpiar()
      done()
    }).catch((err) => {
      console.log('no se puedo conectar')
      console.error(err)
      exit(1)
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

  // describe('@t1 CREAR', () => {
  //   describe('@t1.1 ESTUDIANTE', () => {
  //     it('@t1.1.1 OK', (done) => {
  //       const estudiante = data.estudiantes[0]
  //       apiModel.crearEstudiante(estudiante).then((resp) => {
  //         expect(estudiante['correo']).to.equal(resp['correo'])
  //         expect(resp['error']).to.equal(undefined)
  //         expect(resp['MensajeError']).to.equal(undefined)
  //         done()
  //       }).catch((err) => console.error(err))
  //     }).timeout(5000)
  //     it('@t1.1.2 PARAMETROS UNDEFINED', (done) => {
  //       const estudiante = data.estudiantes[0]
  //       estudiante['correo'] = undefined
  //       apiModel.crearEstudiante(estudiante).catch((mensajeError) => {
  //         expect(mensajeError).to.equal(messages.ERROR_AL_CREAR)
  //         done()
  //       })
  //     }).timeout(5000)
  //   })
  //   describe('@t1.2 PROFESOR', () => {
  //     it('@t1.2.1 OK', (done) => {
  //       const profesor = data.profesores[0]
  //       apiModel.crearProfesor(profesor).then((resp) => {
  //         expect(profesor['correo']).to.equal(resp['correo'])
  //         expect(resp['error']).to.equal(undefined)
  //         expect(resp['MensajeError']).to.equal(undefined)
  //         done()
  //       }).catch((err) => console.error(err))
  //     }).timeout(5000)
  //     it('@t1.2.2 PARAMETROS UNDEFINED', (done) => {
  //       const profesor = data.profesores[0]
  //       profesor['correo'] = undefined
  //       apiModel.crearProfesor(profesor).catch((mensajeError) => {
  //         expect(mensajeError).to.equal(messages.ERROR_AL_CREAR)
  //         done()
  //       })
  //     }).timeout(5000)
  //   })
  //   describe('@t1.3 PARALELO', () => {
  //     it('@t1.2.1 OK', (done) => {
  //       const paralelo = data.paralelos[0]
  //       apiModel.crearParalelo(paralelo).then((resp) => {
  //         expect(paralelo['codigo']).to.equal(resp['codigo'])
  //         expect(resp['error']).to.equal(undefined)
  //         expect(resp['MensajeError']).to.equal(undefined)
  //         done()
  //       })
  //     }).timeout(5000)
  //     it('@t1.2.1 PARAMETROS UNDEFINED', (done) => {
  //       const paralelo = data.paralelos[0]
  //       paralelo['codigo'] = undefined
  //       apiModel.crearParalelo(paralelo).catch((mensajeError) => {
  //         expect(mensajeError).to.equal(messages.ERROR_AL_CREAR)
  //         done()
  //       })
  //     }).timeout(5000)
  //   })
  // })

  describe('@t2 OBTENER', () => {
    describe('@t2.1 ESTUDIANTE', () => {
      it('@t2.1.1 OK', (done) => {
        co(function *() {
          const paralelo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          yield mongoSchema.Paralelo.anadirEstudiante({ // TODO: mejorar
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          const estudianteDatos = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudiante['correo']})
          expect(estudianteDatos['correo']).to.equal(estudiante['correo'])
          expect(estudianteDatos['paraleloId']).to.equal(paraleloCreado['_id'])
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t2.1.2 PARAMETROS UNDEFINED', (done) => {
        apiModel.obtenerDatosEstudiantePorCorreo({}).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['correo']))
          done()
        })
      }).timeout(5000)
      it('@t2.1.3 CORREO NO EXISTE', (done) => {
        apiModel.obtenerDatosEstudiantePorCorreo({ correo: 'noexisteestecorreo'}).then((resp) => {
          expect(resp).to.equal(null)
          done()
        })
      }).timeout(5000)
    })
    describe('@t2.2 PROFESOR', () => {
      it('@t2.2.1 OK', (done) => {
        co(function *() {
          const paralelo = data.paralelos[0]
          const profesor = data.profesores[0]
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const profesorCreado = yield apiModel.crearProfesor(profesor)
          yield mongoSchema.Paralelo.anadirProfesor({ // TODO: mejorar
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            profesorCorreo: profesor['correo']
          })
          const profesorDatos = yield apiModel.obtenerDatosProfesorPorCorreo({ correo: profesor['correo']})
          expect(profesorDatos['correo']).to.equal(profesor['correo'])
          expect(profesorDatos['paralelos']).to.be.an('array')
          expect(profesorDatos['paralelos']).to.have.lengthOf(1)
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t2.2.2 PARAMETROS UNDEFINED', (done) => {
        apiModel.obtenerDatosProfesorPorCorreo({}).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['correo']))
          done()
        })
      }).timeout(5000)
      it('@t2.2.3 CORREO NO EXISTE', (done) => {
        apiModel.obtenerDatosProfesorPorCorreo({ correo: 'noexisteestecorreo'}).then((resp) => {
          expect(resp).to.equal(null)
          done()
        })
      }).timeout(5000)
    })
  })

  describe('@t3 ELIMINAR', () => {
    describe('@t3.1 ESTUDIANTE', () => {
      it('@t3.1.1 OK', (done) => {
        co(function *() {
          const paralelo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          yield mongoSchema.Paralelo.anadirEstudiante({ // TODO: mejorar
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          const estudianteDatos = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudiante['correo']})
          expect(estudianteDatos['correo']).to.equal(estudiante['correo'])
          expect(estudianteDatos['paraleloId']).to.equal(paraleloCreado['_id'])
          const resp = yield apiModel.eliminarEstudiante({
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t3.1.2 PARAMETROS UNDEFINED', (done) => {
        const paralelo = data.paralelos[0]
        const estudiante = data.estudiantes[0]
        apiModel.eliminarEstudiante({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          }
        }).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
          done()
        })
      }).timeout(5000)
    })
  })

  describe('@t4 ANADIR A PARALELO', () => {
    describe('@t4.1 ESTUDIANTE', () => {
      it('@t4.1.1 OK', (done) => {
        co(function *() {
          const paralelo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          const estado = yield apiModel.anadirEstudianteAParalelo({
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          expect(estado).to.be.true
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t4.1.2 PARAMETROS UNDEFINED', (done) => {
        const paralelo = data.paralelos[0]
        const estudiante = data.estudiantes[0]
        apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          }
        }).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
          done()
        })
      }).timeout(5000)
      it('@t4.1.3 NO SE REALIZO CORRECTAMENTE', (done) => {
        co(function *() {
          const paralelo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          const estado = yield apiModel.anadirEstudianteAParalelo({
            paralelo: {
              curso: paralelo['curso'],
              codigo: 'aaaa'
            },
            estudianteCorreo: estudiante['correo']
          })
          expect(estado).to.be.false
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
    })
    describe('@t4.2 PROFESOR', () => {
      const paralelo = data.paralelos[0]
      const profesor = data.profesores[0]
      it('@t4.2.1 OK', (done) => {
        co(function *() {
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const profesorCreado = yield apiModel.crearProfesor(profesor)
          const estado = yield apiModel.anadirProfesorAParalelo({
            paralelo: {
              curso: paralelo['curso'],
              codigo: paralelo['codigo']
            },
            profesorCorreo: profesor['correo']
          })
          expect(estado).to.be.true
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t4.2.2 PARAMETROS UNDEFINED', (done) => {
        apiModel.anadirProfesorAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          }
        }).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'profesorCorreo']))
          done()
        })
      }).timeout(5000)
      it('@t4.2.3 NO SE REALIZO CORRECTAMENTE', (done) => {
        co(function *() {
          const paraleloCreado = yield apiModel.crearParalelo(paralelo)
          const estudianteCreado = yield apiModel.crearProfesor(profesor)
          const estado = yield apiModel.anadirProfesorAParalelo({
            paralelo: {
              curso: paralelo['curso'],
              codigo: 'aaaa'
            },
            profesorCorreo: profesor['correo']
          })
          expect(estado).to.be.false
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
    })
  })

  describe('@t5 CAMBIO DE PARALELO', () => {
    describe('@t5.1 PROFESOR', () => {
      it('@t5.1.1 OK', (done) => {
        co(function *() {
          const paraleloNuevo = data.paralelos[1]
          const paraleloAntiguo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreadoNuevo = yield apiModel.crearParalelo(paraleloNuevo)
          const paraleloCreadoAntiguo = yield apiModel.crearParalelo(paraleloAntiguo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          const estado = yield apiModel.anadirEstudianteAParalelo({
            paralelo: {
              curso: paraleloAntiguo['curso'],
              codigo: paraleloAntiguo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          const cambiado = yield apiModel.cambiarEstudianteDeParalelo({
            paraleloNuevo: {
              cursoNuevo: paraleloNuevo['curso'],
              codigoNuevo: paraleloNuevo['codigo']
            },
            paraleloAntiguo: {
              cursoAntiguo: paraleloAntiguo['curso'],
              codigoAntiguo: paraleloAntiguo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          expect(cambiado).to.be.true
          done()
        }).catch((err) => { console.log(err) })
      }).timeout(5000)
      it('@t5.1.2 PARAMETROS UNDEFINED', (done) => {
        const paraleloNuevo = data.paralelos[0]
        apiModel.cambiarEstudianteDeParalelo({
          paraleloNuevo: {
            cursoNuevo: paraleloNuevo['curso'],
            codigoNuevo: paraleloNuevo['codigo']
          },
          paraleloAntiguo: {

          }
        }).catch((mensajeError) => {
          expect(mensajeError).to.equal(messages.NO_ESTA_ENVIANDO(['cursoNuevo', 'codigoNuevo', 'cursoAntiguo', 'codigoAntiguo', 'estudianteCorreo']))
          done()
        })
      })
      it('@t5.1.3 PARALELO NUEVO NO EXISTE', (done) => {
        co(function *() {
          const paraleloNuevo = data.paralelos[0]
          const paraleloAntiguo = data.paralelos[0]
          const estudiante = data.estudiantes[0]
          const paraleloCreadoNuevo = yield apiModel.crearParalelo(paraleloNuevo)
          const paraleloCreadoAntiguo = yield apiModel.crearParalelo(paraleloAntiguo)
          const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
          const estado = yield apiModel.anadirEstudianteAParalelo({
            paralelo: {
              curso: paraleloAntiguo['curso'],
              codigo: paraleloAntiguo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          const cambiado = yield apiModel.cambiarEstudianteDeParalelo({
            paraleloNuevo: {
              cursoNuevo: 'aaa',
              codigoNuevo: paraleloNuevo['codigo']
            },
            paraleloAntiguo: {
              cursoAntiguo: paraleloAntiguo['curso'],
              codigoAntiguo: paraleloAntiguo['codigo']
            },
            estudianteCorreo: estudiante['correo']
          })
          expect(cambiado).to.be.false
          done()
        }).catch((err) => { console.log(err) })
      })
    })
  })

})
