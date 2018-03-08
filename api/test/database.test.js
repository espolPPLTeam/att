const assert = require('assert')
const co = require('co')
const mongoSchema = require('../config/models')
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
const creadorEstudiantePrimero = {
      _id: 'Bye0Ouve3b', 
      correo: 'stsemaci@espol.edu.ec', 
      matricula: '201121507', 
      nombres: 'STEVEN SEBASTIAN', 
      apellidos: 'QUEZADA'}

const paraleloUnoId = 'ByRJtODl3-'
const paraleloDosId = 'BJBRuuDgn-'

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
  beforeEach(function(done) {
    co(function *() {
      yield mongo.Limpiar()
      done()
    })
  })
  // it('obtenerDatosEstudiante', (done) =>  {
    
  // })
  // it('obtenerDatosProfesor', (done) =>  {
    
  // })
  it('crearPreguntaEstudiante', (done) =>  {
    co(function *() {
      const preguntaCreada = yield apiModel.crearPreguntaEstudiante({ 
        texto: 'Mi primera Pregunta', 
        paraleloId: paraleloUnoId, 
        creador: creadorEstudiantePrimero
      })
      const preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.ObtenerPreguntaEstudiantePorId({ preguntaId: preguntaCreada['_id'] })
      assert.equal(preguntaEncontrada['texto'], preguntaCreada['texto'], 'Tienen que ser iguales')
      done()
    })
  }).timeout(5000)

  it('obtenerPreguntasEstudiantesPorParalelo', (done) => {
    co(function *() {
      yield apiModel.crearPreguntaEstudiante({ texto: 'Mi primera Pregunta',  paraleloId: paraleloUnoId, creador: creadorEstudiantePrimero })
      yield apiModel.crearPreguntaEstudiante({ texto: 'Mi segunda Pregunta',  paraleloId: paraleloUnoId, creador: creadorEstudiantePrimero })
      yield apiModel.crearPreguntaEstudiante({ texto: 'Mi tercera Pregunta',  paraleloId: paraleloDosId, creador: creadorEstudiantePrimero })
      const preguntas = yield apiModel.obtenerPreguntasEstudiantesPorParalelo({ paraleloId: paraleloUnoId })
      assert.equal(preguntas.length, 2, 'Tienen que ser array de tamano 2')
      done()
    })
  }).timeout(5000)
  // it('crearPreguntaProfesorYHabilitarla', (done) =>  {
    
  // })
  // it('crearRespuestaEstudiante', (done) =>  {
    
  // })
})