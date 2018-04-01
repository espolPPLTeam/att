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
      estudiante = io(`http://localhost:${process.env.PORT || 3000}/att`, ioOptions)
      done()
    })

  })
  afterEach(function(){
    profesor.disconnect()
    estudiante.disconnect()
    server.close()
  })
  after(function() {
    server.close()
  })
  it('@t1 ESTUDIANTE HACE UNA PREGUNTA', function(done) {
    this.timeout(6000)
    let doc = {

    }
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
})
