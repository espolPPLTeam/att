const assert = require('assert')
const co = require('co')
const mongoSchema = require('../config/schemaDB')
const mongo = require('../config/db')
const logger = require('../config/logger')

async function ConectarMongo() {
  try {
    await mongo.Conectar(process.env.MONGO_URL_ATT_TEST)
  } catch (err) {
    console.error(err)
    exit(1)
  }
}
const apiModel = require('../api.model')({ mongoSchema, logger })
describe('Database', () =>  {
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
  // it('obtenerDatosEstudiante', (done) =>  {
    
  // })
  // it('obtenerDatosProfesor', (done) =>  {
    
  // })
  it('cq\+rearPreguntaEstudiante', (done) =>  {
    co(function *() {
      const preguntaCreada = yield apiModel.crearPreguntaEstudiante({ texto: 'Mi primera Pregunta', paraleloId: 'paraleloId', creador: {_id: 'aaaaa', correo: 'joelerll@gmail.com', matricula: '201305380', nombres: 'Joel Eduardo', apellidos: 'Rodriguez Llamuca'}})
      const preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.ObtenerPreguntaEstudiantePorId({ preguntaId: preguntaCreada['_id'] })
      assert.equal(preguntaEncontrada['texto'], preguntaCreada['texto'], 'Tienen que ser iguales')
      done()
    })
  }).timeout(20000)
  // it('crearPreguntaProfesorYHabilitarla', (done) =>  {
    
  // })
  // it('crearRespuestaEstudiante', (done) =>  {
    
  // })
})