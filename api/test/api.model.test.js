const assert = require('assert')
const co = require('co')
const data = require('./database.mock')
const mongoSchema = require('../config/models')
const mongo = require('../config/db')
const logger = require('../config/logger')

process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})

async function ConectarMongo() {
  try {
    await mongo.Conectar(process.env.MONGO_URL_ATT_TEST)
  } catch (err) {
    console.error(err)
    exit(1)
  }
}
const apiModel = require('../api.model')({ db: mongoSchema, logger })
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
  describe('Acciones basicas', () =>  {
    it('crear Paralelo', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const paraleloEncontrado = yield mongoSchema.Paralelo.obtenerPorId({ paraleloId: paraleloCreado['_id'] })
        assert.equal(paralelo['nombre'], paraleloEncontrado['nombre'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)
    it('crear Profesor y obtener Profesor', (done) => {
      co(function *() {
        const profesor = data.profesores[0]
        const profesorCreado = yield apiModel.crearProfesor(profesor)
        const profesorEncontrado = yield apiModel.obtenerDatosProfesorPorCorreo({ correo: profesor['correo'] })
        assert.equal(profesor['correo'], profesorEncontrado['correo'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)
    it('crear Estudiante y obtener Estudiante', (done) => {
      co(function *() {
        const estudiante = data.estudiantes[0]
        const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
        const estudianteEncontrado = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudiante['correo'] })
        assert.equal(estudiante['correo'], estudianteEncontrado['correo'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)
    it('anadir estudiante a paralelo', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const estaCreadoParalelo = yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: 'joeedrod@espol.edu.ec'
        })
        const paraleloEstudiante = yield mongoSchema.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: 'joeedrod@espol.edu.ec' })
        assert.equal(paraleloEstudiante['curso'], paralelo['curso'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)
    it('anadir profesor a paralelo', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const estaCreadoParalelo = yield apiModel.anadirProfesorAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          profesorCorreo: 'joeedrod@espol.edu.ec'
        })
        const paraleloEstudiante = yield mongoSchema.Paralelo.obtenerParaleloProfesor({ profesorCorreo: 'joeedrod@espol.edu.ec' })
        assert.equal(paraleloEstudiante['curso'], paralelo['curso'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)
    it('eliminar estudiante', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const estudianteUno = data.estudiantes[0]
        const estudianteDos = data.estudiantes[1]

        yield apiModel.crearParalelo(paralelo)
        const estudianteCreado = yield apiModel.crearEstudiante(estudianteUno)
        const estudianteEncontrado = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudianteUno['correo'] })
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudianteUno['correo']
        })
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudianteDos['correo']
        })
        assert.equal(estudianteUno['correo'], estudianteEncontrado['correo'], 'Tienen que ser iguales')
        const paraleloEstudiante = yield mongoSchema.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: estudianteUno['correo'] })
        assert.equal(paraleloEstudiante['curso'], paralelo['curso'], 'Tienen que ser iguales')
        assert.equal(paraleloEstudiante['estudiantes'].length, 2, 'Tienen haber dos estudiantes')
        yield apiModel.eliminarEstudiante({ 
          paralelo: { 
            curso: paralelo['curso'], 
            codigo: paralelo['codigo'] 
          }, 
          estudianteCorreo: estudianteUno['correo'] 
        })
        const estudianteDatos = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo:  estudianteUno['correo'] })
        assert.equal(estudianteDatos, null, 'Tiene que estar eliminado estudiante uno')
        const paraleloEstudianteDos = yield mongoSchema.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: estudianteDos['correo'] })
        assert.equal(paraleloEstudianteDos['estudiantes'].length, 1, 'Tienen haber un estudiante')
        assert.equal(paraleloEstudianteDos['estudiantes'][0], estudianteDos['correo'], 'Tienen que coincidir los datos del estudiante')
        done()
      })
    }).timeout(5000)
    it('cambiar paralelo estudiante', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const paraleloDos = data.paralelos[1]
        const estudianteUno = data.estudiantes[0]
        const estudianteDos = data.estudiantes[1]
        const estudianteTres = data.estudiantes[2]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const paraleloCreadoDos = yield apiModel.crearParalelo(paraleloDos)
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudianteUno['correo']
        })
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudianteDos['correo']
        })
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paraleloDos['curso'],
            codigo: paraleloDos['codigo']
          },
          estudianteCorreo: estudianteTres['correo']
        })
        yield apiModel.cambiarEstudianteDeParalelo({ 
          paraleloNuevo: { 
            cursoNuevo: paraleloDos['curso'], 
            codigoNuevo: paraleloDos['codigo'] 
          }, 
          paraleloAntiguo: { 
            cursoAntiguo: paralelo['curso'], 
            codigoAntiguo: paralelo['codigo'] 
          }, 
          estudianteCorreo: estudianteUno['correo'] 
        })
        const paraleloEncontrado = yield mongoSchema.Paralelo.obtenerPorId({ paraleloId: paraleloCreado['_id']})
        const paraleloEncontradoDos = yield mongoSchema.Paralelo.obtenerPorId({ paraleloId: paraleloCreadoDos['_id']})
        assert.equal(paraleloEncontrado['estudiantes'].length, 1, 'Solo un estudiante')
        assert.equal(paraleloEncontradoDos['estudiantes'].length, 2, 'Dos estudiante')
        assert.equal(paraleloEncontrado['estudiantes'][0], estudianteDos['correo'], 'Solo un estudiante')
        done()
      })
    }).timeout(5000)
  })

  describe('Preguntar a profesor', () =>  {
    it('crear Pregunta Estudiante', (done) =>  {
      co(function *() {
        const preguntaCreada = yield apiModel.crearPreguntaEstudiante({ 
          texto: 'Mi primera Pregunta', 
          paraleloId: paraleloUnoId, 
          creador: creadorEstudiantePrimero
        })
        const preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.obtenerPorId({ preguntaId: preguntaCreada['_id'] })
        assert.equal(preguntaEncontrada['texto'], preguntaCreada['texto'], 'Tienen que ser iguales')
        done()
      })
    }).timeout(5000)

    it('obtener pregunta estudiantes de paralelo', (done) => {
      co(function *() {
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi primera Pregunta',  paraleloId: paraleloUnoId, creador: creadorEstudiantePrimero })
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi segunda Pregunta',  paraleloId: paraleloUnoId, creador: creadorEstudiantePrimero })
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi tercera Pregunta',  paraleloId: paraleloDosId, creador: creadorEstudiantePrimero })
        const preguntas = yield apiModel.obtenerPreguntasEstudiantesPorParalelo({ paraleloId: paraleloUnoId })
        assert.equal(preguntas.length, 2, 'Tienen que ser array de tamano 2')
        done()
      })
    }).timeout(5000)
  })
  // it('crearPreguntaProfesorYHabilitarla', (done) =>  {
    
  // })
  // it('crearRespuestaEstudiante', (done) =>  {
    
  // })
})