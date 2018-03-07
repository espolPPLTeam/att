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
  it('obtenerDatosEstudiante', (done) =>  {
    
  })
  it('obtenerDatosProfesor', (done) =>  {
    
  })
  it('crearPreguntaEstudiante', (done) =>  {
    co(function *() {
      yield apiModel.crearPreguntaEstudiante({ texto: 'Mi primera Pregunta', paraleloId: 'paraleloId', creador: {_id: 'aaaaa', correo: 'joelerll@gmail.com', matricula: '201305380', nombres: 'Joel Eduardo', apellidos: 'Rodriguez Llamuca'}})
      assert.equal('a', 'a', 'Tienen que ser iguales')
      // verificar que se creo correctamente la pregunta
      done()
    })
  })
  it('crearPreguntaProfesorYHabilitarla', (done) =>  {
    
  })
  it('crearRespuestaEstudiante', (done) =>  {
    
  })
})