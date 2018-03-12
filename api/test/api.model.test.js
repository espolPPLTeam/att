const assert = require('assert')
const co = require('co')
const data = require('./database.mock')
const mongoSchema = require('../config/models')
const mongo = require('../config/db')
const logger = require('../config/logger')
const sinon = require('sinon')
const expect = require('chai').expect
require('mocha-sinon')

process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})

const apiModel = require('../api.model')({ db: mongoSchema, logger })

describe('Database', () =>  {
  before(function(done) {
    co(function *() {
      yield mongo.Conectar(process.env.MONGO_URL_ATT_TEST)
      yield mongo.Limpiar()
      done()
    }).catch((err) => {
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
  describe('Acciones basicas', () =>  {
    beforeEach(function(done) {
      this.sinon.stub(logger, 'error')
      done()
    })
    it('CREAR Paralelo', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const paraleloEncontrado = yield mongoSchema.Paralelo.obtenerPorId({ paraleloId: paraleloCreado['_id'] })
        expect(paralelo['nombre']).to.equal(paraleloEncontrado['nombre'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('CREAR Profesor y OBTENER Profesor', (done) => {
      co(function *() {
        const profesor = data.profesores[0]
        const paralelo = data.paralelos[0]
        const paraleloDos = data.paralelos[1]
        yield apiModel.crearParalelo(paralelo)
        yield apiModel.crearParalelo(paraleloDos)
        yield apiModel.anadirProfesorAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          profesorCorreo: profesor['correo']
        })
        yield apiModel.anadirProfesorAParalelo({
          paralelo: {
            curso: paraleloDos['curso'],
            codigo: paraleloDos['codigo']
          },
          profesorCorreo: profesor['correo']
        })
        const profesorCreado = yield apiModel.crearProfesor(profesor)
        const profesorEncontrado = yield apiModel.obtenerDatosProfesorPorCorreo({ correo: profesor['correo'] })
        expect(profesor['correo']).to.equal(profesorEncontrado['correo'])
        expect(profesorEncontrado['paralelos'].length).to.equal(2)
        expect(profesorEncontrado['paralelos'][0]['nombre']).to.equal(paralelo['nombre'])
        expect(profesorEncontrado['paralelos'][1]['nombre']).to.equal(paraleloDos['nombre'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('CREAR Estudiante y OBTENER Estudiante', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const estudiante = data.estudiantes[0]

        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudiante['correo']
        })
        const estudianteCreado = yield apiModel.crearEstudiante(estudiante)
        const estudianteEncontrado = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudiante['correo'] })
        expect(estudiante['correo']).to.equal(estudianteEncontrado['correo'])
        expect(estudianteEncontrado['paraleloId']).to.equal(paraleloCreado['_id'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('ANADIR estudiante A paralelo', (done) => {
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
        expect(paraleloEstudiante['curso']).to.equal(paralelo['curso'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('ANADIR profesor A paralelo', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        yield apiModel.crearParalelo(paralelo)
        yield apiModel.anadirProfesorAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          profesorCorreo: 'joeedrod@espol.edu.ec'
        })
        const paraleloEstudiante = yield mongoSchema.Paralelo.obtenerParalelosProfesor({ profesorCorreo: 'joeedrod@espol.edu.ec' })
        expect(paraleloEstudiante[0]['curso']).to.equal(paralelo['curso'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('ELIMINAR estudiante', (done) => {
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
        expect(estudianteUno['correo']).to.equal(estudianteEncontrado['correo'])
        const paraleloEstudiante = yield mongoSchema.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: estudianteUno['correo'] })
        expect(paraleloEstudiante['curso']).to.equal(paralelo['curso'])
        expect(paraleloEstudiante['estudiantes'].length).to.equal(2)
        yield apiModel.eliminarEstudiante({ 
          paralelo: { 
            curso: paralelo['curso'], 
            codigo: paralelo['codigo'] 
          }, 
          estudianteCorreo: estudianteUno['correo'] 
        })
        const estudianteDatos = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo:  estudianteUno['correo'] })
        expect(estudianteDatos).to.equal(null)
        const paraleloEstudianteDos = yield mongoSchema.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: estudianteDos['correo'] })
        expect(paraleloEstudianteDos['estudiantes'].length).to.equal(1)
        expect(paraleloEstudianteDos['estudiantes'][0]).to.equal(estudianteDos['correo'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('CAMBIAR estudiante DE paralelo', (done) => {
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
        expect(paraleloEncontrado['estudiantes'].length).to.equal(1)
        expect(paraleloEncontradoDos['estudiantes'].length).to.equal(2)
        expect(paraleloEncontrado['estudiantes'][0]).to.equal(estudianteDos['correo'])
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
  })
  describe('Preguntar a profesor', () =>  {
    it('crear Pregunta Estudiante', (done) =>  {
      co(function *() {
        const paralelo = data.paralelos[0]
        const estudiante = data.estudiantes[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        yield apiModel.crearEstudiante(estudiante)
        const preguntaCreada = yield apiModel.crearPreguntaEstudiante({ 
          texto: 'Mi primera Pregunta', 
          paraleloId: paraleloCreado['_id'], 
          creador: estudiante
        })
        yield apiModel.anadirEstudianteAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          estudianteCorreo: estudiante['correo']
        })
        const preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.obtenerPorId({ preguntaId: preguntaCreada['_id'] })
        const paraleloEncontrado = yield mongoSchema.Paralelo.obtenerPorId({ paraleloId: paraleloCreado['_id']})
        const estudianteEncontrado = yield apiModel.obtenerDatosEstudiantePorCorreo({ correo: estudiante['correo'] })
        expect(preguntaEncontrada['texto']).to.equal(preguntaCreada['texto'])
        expect(estudianteEncontrado['preguntas'].length).to.equal(1)
        expect(paraleloEncontrado['preguntasEstudiante'].length).to.equal(1)
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('destacar pregunta @destacar', (done) => {
      co(function *() {
        const paralelo = data.paralelos[0]
        const estudiante = data.estudiantes[0]
        const paraleloCreado = yield apiModel.crearParalelo(paralelo)
        const preguntaCreada = yield apiModel.crearPreguntaEstudiante({ 
          texto: 'Mi primera Pregunta', 
          paraleloId: paraleloCreado['_id'], 
          creador: estudiante
        })
        let preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.obtenerPorId({ preguntaId: preguntaCreada['_id'] })
        expect(preguntaEncontrada['destacada']).to.equal(false)
        yield apiModel.destacarPregunta({ preguntaId: preguntaCreada['_id'], destacadaEstado: true })
        preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.obtenerPorId({ preguntaId: preguntaCreada['_id'] })
        expect(preguntaEncontrada['destacada']).to.equal(true)
        yield apiModel.destacarPregunta({ preguntaId: preguntaCreada['_id'], destacadaEstado: false })
        preguntaEncontrada = yield mongoSchema.PreguntaEstudiante.obtenerPorId({ preguntaId: preguntaCreada['_id'] })
        expect(preguntaEncontrada['destacada']).to.equal(false)
        done()
      })
    })
    it('obtener pregunta estudiantes de paralelo', (done) => {
      co(function *() {
        const estudiante = data.estudiantes[0]
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi primera Pregunta',  paraleloId: 'aa', creador: estudiante })
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi segunda Pregunta',  paraleloId: 'aa', creador: estudiante })
        yield apiModel.crearPreguntaEstudiante({ texto: 'Mi tercera Pregunta',  paraleloId: 'aaaa', creador: estudiante })
        const preguntas = yield apiModel.obtenerPreguntasEstudiantesPorParalelo({ paraleloId: 'aa' })
        expect(preguntas.length).to.equal(2)
        done()
      }).catch((err) => console.error(err))
    }).timeout(5000)
  })
  // it('crearPreguntaProfesorYHabilitarla', (done) =>  {
    
  // })
  // it('crearRespuestaEstudiante', (done) =>  {
    
  // })
})