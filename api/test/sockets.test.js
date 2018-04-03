const ioOptions = { transports: ['websocket'] , forceNew: true , reconnection: false }
const server = require('./socket.server.test').http
const io = require('socket.io-client')
const expect = require('chai').expect
const data = require('./database.mock')

describe('Sockets', () => {
  let profesor
  let estudiante
  let docs = []
  beforeEach(function(done){
    server.listen(process.env.PORT || 3000, function() {
      profesor = io(`http://localhost:${process.env.PORT || 3000}/att`, ioOptions)
      profesor_2 = io(`http://localhost:${process.env.PORT || 3000}/att`, ioOptions)
      estudiante = io(`http://localhost:${process.env.PORT || 3000}/att`, ioOptions)
      estudiante_2 = io(`http://localhost:${process.env.PORT || 3000}/att`, ioOptions)
      done()
    })

  })
  afterEach(function(){
    profesor.disconnect()
    estudiante.disconnect()
    profesor_2.disconnect()
    estudiante_2.disconnect()
    server.close()
  })
  after(function() {
    server.close()
  })
  it('@t1 ESTUDIANTE HACE UNA PREGUNTA', function(done) {
    let estudianteData = data.estudiantes[0]
    let paraleloId = 'pppp'
    let texto = 'Mi primera pregunta'
    let _id = 'iii'
    estudianteData['_id'] = 'eeee'
    let pregunta = {
      preguntaId: _id,
      texto,
      paraleloId,
      creador: estudianteData }
    estudiante.on('connect', function() {
      estudiante.emit('unirseAParalelo', { paraleloId })
      estudiante.on('UNIDO_PARALELO', function() {
        estudiante.emit('preguntaEstudiante', pregunta )
      })
    })
    profesor.on('connect', function() {
      profesor.emit('unirseAParalelo', { paraleloId })
    })
    profesor.on('PREGUNTA_ESTUDIANTE', function({ preguntaId, texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      let preguntaRecibida = {
        preguntaId, texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos }
      }
      expect(preguntaRecibida).to.deep.equal(pregunta)
      done()
    })
  })
  describe('@t2 PROFESOR PREGUNTA', () => {
    let paraleloId = 'idPa'
    let paraleloId_2 = 'idPa2'
    let texto = 'Mi pregunta profesor'
    let preguntaId = 'idPre'
    let profesorData = data.profesores[0]
    let profesor_2Data = data.profesores[1]
    let preguntaProfesor = { paraleloId, preguntaId, texto, creador: profesorData }
    it('@t2.1 ENVIADA A LOS ESTUDIANTES DEL PARALELO', (done) => {
      estudiante.on('connect', function() {
        estudiante.emit('unirseAParalelo', { paraleloId })
        estudiante.on('PREGUNTA_PROFESOR', function({ paraleloId, preguntaId, texto, creador }) {
          expect({ paraleloId, preguntaId, texto, creador }).to.deep.equal(preguntaProfesor)
          done()
        })
      })
      profesor.on('connect', function() {
        profesor.emit('unirseAParalelo', { paraleloId })
        profesor.on('UNIDO_PARALELO', function() {
          profesor.emit('preguntaProfesor', preguntaProfesor)
        })
      })
    })
    it('@t2.2 ENVIADA OTRO PROFESOR DEL PARALELO', (done) => {
      profesor_2.on('connect', function() {
        profesor_2.emit('unirseAParalelo', { paraleloId })
        profesor_2.on('PREGUNTA_PROFESOR', function({ paraleloId, preguntaId, texto, creador }) {
          expect({ paraleloId, preguntaId, texto, creador }).to.deep.equal(preguntaProfesor)
          done()
        })
      })
      profesor.on('connect', function() {
        profesor.emit('unirseAParalelo', { paraleloId })
        profesor.on('UNIDO_PARALELO', function() {
          profesor.emit('preguntaProfesor', preguntaProfesor)
        })
      })
    })
    it('@t2.3 ESTUDIANTE DE OTRO PARALELO NO DEBE RECIBIRLA', (done) => {
      estudiante_2.on('connect', function() {
        estudiante_2.emit('unirseAParalelo', { paraleloId_2 })
        estudiante_2.on('PREGUNTA_PROFESOR', function({ paraleloId, preguntaId, texto, creador }) {
          expect(true).to.equal(false)
        })
      })
      profesor.on('connect', function() {
        profesor.emit('unirseAParalelo', { paraleloId })
        profesor.on('UNIDO_PARALELO', function() {
          profesor.emit('preguntaProfesor', preguntaProfesor)
        })
      })
      setTimeout(done, 600)
    }).timeout(1000)
    it('@t2.4 PROFESOR DE OTRO PARALELO NO DEBE RECIBIRLA', function(done) {
      this.timeout(1000)
      profesor_2.on('connect', function() {
        profesor_2.emit('unirseAParalelo', { paraleloId_2 })
        profesor_2.on('PREGUNTA_PROFESOR', function({ paraleloId, preguntaId, texto, creador }) {
          expect(true).to.equal(false)
        })
      })
      profesor.on('connect', function() {
        profesor.emit('unirseAParalelo', { paraleloId })
        profesor.on('UNIDO_PARALELO', function() {
          profesor.emit('preguntaProfesor', preguntaProfesor)
        })
      })
      setTimeout(done, 600)
    })
    it('@t2.5 PROFESOR TERMINA PREGUNTA Y EL ESTUDIANTE LO RECIBE', function(done) {
      let terminada = { paraleloId, preguntaId, texto, terminadaPor: profesor_2Data }
      estudiante.on('connect', function() {
        estudiante.emit('unirseAParalelo', { paraleloId })
        estudiante.on('TERMINAR_PREGUNTA', function({ paraleloId, preguntaId, terminadaPor: { nombres, apellidos, tipo, correo } }) {
          expect({ paraleloId, preguntaId, texto, terminadaPor: { nombres, apellidos, tipo, correo } }).to.deep.equal(terminada)
          done()
        })
      })
      profesor.on('connect', function() {
        profesor.emit('unirseAParalelo', { paraleloId })
        profesor.on('UNIDO_PARALELO', function() {
          profesor.emit('preguntaProfesor', preguntaProfesor)
        })
      })
      profesor_2.on('connect', function() {
        profesor_2.emit('unirseAParalelo', { paraleloId: paraleloId })
        profesor_2.on('PREGUNTA_PROFESOR', function({ paraleloId, preguntaId, texto, creador }) {
          profesor_2.emit('terminarPregunta', terminada)
        })
      })
    })
  })
})
