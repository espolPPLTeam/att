// NOTA: Los errores SERVER_ERROR son hechos por el api.controller.test ya que todavia
//       no encuentro la forma de como hacerlos aqui
// https://blog.risingstack.com/getting-node-js-testing-and-tdd-right-node-js-at-scale/
  // https://github.com/Gottwik/Enduro
  // https://github.com/hexojs/hexo
  // https://github.com/Automattic/wp-calypso

describe('Routes - Integration', () => {
  let docs = []
  before(async function () {
    await ConectarMongo()
    await mongo.Limpiar()
    app = require('../../app').att().app
    db = require('../config/models')
    model = modelRequire({ messages, db, logger })
    controller = controllerRequire({ responses, messages, model, logger, validator })
  })
  after(function() {
    mongo.Desconectar()
    generatorDocs.generateAPI({ docs })
  })
  afterEach(async function() {
    await mongo.Limpiar()
  })

  // TODO: BORRAR, porque es una ruta ya se envia esto al profesor

  context('@t1 POST Crear Pregunta Estudiante', () => {
    // TODO: si no se envia el campo de creador?
    let doc = {
      nombre: 'Crear pregunta estudiante',
      metodo: 'POST',
      url: '/api/att/estudiante/preguntar',
      descripcion: 'El estudiante crea una pregunta',
      body: [
        { nombre: 'texto', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'paraleloId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'creador', tipo: 'Object', descripcion: ' --- ' },
        { nombre: ' correo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' matricula', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' nombres', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' apellidos', margen: 'center', tipo: 'String', descripcion: ' --- '},
      ],
      errors: []
    }

    it('@t1.1 OK', (done) => {
      const texto = 'Mi primera pregunta'
      const estudiante = data.estudiantes[0]
      const paralelo = data.paralelos[0]
      co(function *() {
        let estudiante = data.estudiantes[0]
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let texto = 'Mi primera pregunta'
        let paraleloId = paraleloCreado['_id']
        let req = {
          texto,
          paraleloId,
          creador: estudiante
        }
        request(app)
        .post(doc['url'])
        .send(req)
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc, res, req })
          // console.log(res.body)
          expect(ajv.validate(schema.PREGUNTA, res.body.datos)).to.equal(true)
          expect(res.body.estado).to.equal(true)
          expect(res.status).to.equal(200)
          done()
        })
      }).catch((err) => { console.log(err) })

    }).timeout(5000)
    it('@t1.2 PARALELOID ES CAMPO OBLIGATORIO', (done) => {
      let estudiante = data.estudiantes[0]
      let req = {
        texto: 'Mi primera pregunta',
        creador: estudiante
      }
      request(app)
      .post(doc['url'])
      .send(req)
      .end(function(err, res) {
        generatorDocs.ERROR({ nombre: 'PARALELOID ES CAMPO OBLIGATORIO', docs, doc, res, req })
        expect(res.body.datos).to.equal(messages.PARALELOID_VACIO)
        expect(res.body.estado).to.equal(false)
        expect(res.status).to.equal(200)
        done()
      })
    }).timeout(5000)
  })
  describe('@t2 PUT Destacar Pregunta', () => {
    let doc = {
      nombre: 'Descatar pregunta',
      metodo: 'PUT',
      url: '/api/att/profesor/destacarPregunta',
      descripcion: 'El profesor coloca como destacada una pregunta que escoja',
      body: [
        { nombre: 'preguntaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'destacadaEstado', tipo: 'Boolean', descripcion: ' --- ' },
      ],
      errors: []
    }
    it('@t2.1 OK', (done) => {
      const estudiante = data.estudiantes[0]
      const paralelo = data.paralelos[0]
      let texto = 'Mi primera pregunta'

      co(function *() {
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let paraleloId = paraleloCreado['_id']
        let preguntaCreada = yield model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta',
        paraleloId,
        creador: {
          _id: paraleloId,
          correo: estudiante['correo'],
          matricula: estudiante['matricula'],
          nombres: estudiante['nombres'],
          apellidos: estudiante['apellidos']
        }})
        let req = {
          preguntaId: preguntaCreada['_id'],
          destacadaEstado: true
        }
        request(app)
          .put(doc['url'])
          .send(req)
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc, res, req })
            expect(res.body.datos).to.equal(messages.PREGUNTA_DESTACADA)
            expect(res.body.estado).to.equal(true)
            expect(res.status).to.equal(200)
            done()
          })
      }).catch((err) => console.error(err))
    }).timeout(5000)
    it('@t2.2 PREGUNTA ID NO EXISTE', (done) => {
      let estudiante = data.estudiantes[0]
      let texto = 'Mi primera pregunta'
      let paraleloId = 'aaaa'
      let req = {
        preguntaId: 'sdasssdas',
        destacadaEstado: true
      }
      request(app)
        .put(doc['url'])
        .send(req)
        .end(function(err, res) {
          generatorDocs.ERROR({ nombre: 'PREGUNTA ID NO EXISTE', docs, doc, res, req })
          expect(res.body.datos).to.equal(messages.PREGUNTAID_NO_EXISTE)
          expect(res.body.estado).to.equal(false)
          expect(res.status).to.equal(200)
          done()
        })
    }).timeout(5000)
  })

  // TODO: error docs
  describe('@t3 URL NO VALIDO', () => {
    it('@t3.1 EL URL INGRESADO NO EXISTE', (done) => {
      request(app)
        .put('/api/att/loquesea')
        .end(function(err, res) {
          expect(res.body).to.deep.equal(responses.URL_NO_VALIDO)
          expect(res.body.estado).to.equal(responses.URL_NO_VALIDO.estado)
          expect(res.status).to.equal(responses.URL_NO_VALIDO.codigoEstado)
          done()
        })
    })
  })

  // TODO: login que devuelve estudiantes y profesores. Ademas de mostrar los errores
  describe('@t4 LOGIN', () => {
    let docLogin = {
      nombre: 'Login',
      metodo: 'POST',
      url: '/api/att/login',
      descripcion: 'Valido para profesor o estudiante',
      params: [
        {
          nombre: 'correo',
          tipo: 'String',
          descripcion: ' -- '
        }
      ],
      errors: []
    }
    let docLogout = {
      nombre: 'Logout',
      metodo: 'GET',
      url: '/api/att/logout',
      descripcion: ''
    }

    let docDatosProfesor = {
      nombre: 'Datos de profesor para primera pagina',
      metodo: 'GET',
      url: '/api/att/datosUsuario',
      descripcion: 'Obtiene los datos del profesor que esta conectado, usa cookies para saber quien esta conectado',
      errors: []
    }

    let docDatos = {
      nombre: 'Datos usuario',
      metodo: 'GET',
      url: '/api/att/datosUsuario',
      descripcion: '',
      errors: []
    }

    let docDatosEstudiante = {
      nombre: 'Datos de usuario estudiante',
      metodo: 'GET',
      url: '/api/att/datosUsuario',
      descripcion: 'Obtiene los datos del estudiante. Si no hay Pregunta Profesor activa devuelve que el objeto no existe. Si el estudiante no respondido devuelve que no existe esa propiedades',
      errors: []
    }
    // generatorDocs.ERROR({ nombre: 'PREGUNTA ID NO EXISTE', docs, doc, res, req })
    // generatorDocs.OK({ docs, doc, res })
    let estudiante = data.estudiantes[0]
    let profesor = data.profesores[0]
    let paralelo = data.paralelos[0]
    it('@t4.1 PROFESOR LOGGEADO', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        yield model.anadirProfesorAParalelo({
          paralelo: {
            curso: paraleloCreado['curso'],
            codigo: paraleloCreado['codigo']
          },
          profesorCorreo: profesorCreado['correo'] })
        let correoProfesor = profesorCreado['correo']
        let req = {
          correo: correoProfesor
        }
        agent
        .post(`/api/att/login`)
        .send(req)
        .end(function(err, res) {
          generatorDocs.OK({ docs, doc: docLogin, req, res })
          let correo = res.body['datos']['correo']
          expect(correo).to.equal(correoProfesor)
          agent
          .get('/api/att/datosUsuario')
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc: docDatosProfesor, res })
            expect(ajv.validate(schema.PROFESOR_DATOS, res.body.datos)).to.equal(true)
            done()
          })
        })
      })
    }).timeout(10000)
    it('@t4.2 ESTUDIANTE LOGGEADO', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let paraleloId = paraleloCreado['_id']
        yield model.anadirEstudianteAParalelo({
          paralelo: {
            curso: paraleloCreado['curso'],
            codigo: paraleloCreado['codigo']
          },
          estudianteCorreo: estudianteCreado['correo'] })
        let estudianteCorreo = estudianteCreado['correo']
        let req = {
          correo: estudianteCorreo
        }
        yield model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta',
        paraleloId,
        creador: {
          _id: paraleloId,
          correo: estudianteCreado['correo'],
          matricula: estudianteCreado['matricula'],
          nombres: estudianteCreado['nombres'],
          apellidos: estudianteCreado['apellidos']
        }})
        let preguntaCreada = yield model.crearPreguntaProfesorYHabilitarla({ texto: 'Pregunta Profesor', paraleloId, creador: profesorCreado })
        yield model.crearRespuestaEstudiante({ paraleloId, preguntaId: 'aaaa', texto: 'Mi respuesta no debe salir', creador: estudianteCreado })
        yield model.crearRespuestaEstudiante({ paraleloId, preguntaId: preguntaCreada['_id'], texto: 'Mi respuesta', creador: estudianteCreado })
        agent
        .post(`/api/att/login`)
        .send(req)
        .end(function(err, resp) {
          let correo = resp.body['datos']['correo']
          expect(correo).to.equal(estudianteCorreo)
          agent
          .get('/api/att/datosUsuario')
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc: docDatosEstudiante, res })
            expect(ajv.validate(schema.ESTUDIANTE_PERFIL, res.body.datos)).to.equal(true)
            done()
          })
        })
      })
    }).timeout(10000)
    it('@t4.3 PROFESOR NO LOGGEADO', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let correoProfesor = profesorCreado['correo']
        let req = {
          correo: correoProfesor
        }
        agent
        .get('/api/att/datosUsuario')
        .end(function(err, res) {
          generatorDocs.ERROR({ nombre: 'NO LOGEADO', docs, doc: docDatos, res })
          expect(res.body['estado']).to.equal(false)
          expect(res.body['mensaje']).to.equal('No esta loggeado')
          done()
        })
      })
    }).timeout(10000)
    it('@t4.4 ESTUDIANTE NO LOGGEADO', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let estudianteCorreo = estudianteCreado['correo']
        let req = {
          correo: estudianteCorreo
        }
        agent
        .get('/api/att/datosUsuario')
        .end(function(err, resp) {
          expect(resp.body['estado']).to.equal(false)
          expect(resp.body['mensaje']).to.equal('No esta loggeado')
          done()
        })
      })
    }).timeout(10000)
    it('@t4.5 PROFESOR NO EXISTE', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let correoProfesor = profesor['correo']
        let req = {
          correo: correoProfesor
        }
        agent
        .post('/api/att/login')
        .send(req)
        .end(function(err, res) {
          generatorDocs.ERROR({ nombre: 'NO EXISTE', docs, doc: docLogin, res, req })
          expect(res.body['estado']).to.equal(false)
          expect(res.body['mensaje']).to.equal('El usuario no existe')
          done()
        })
      })
    }).timeout(10000)
    it('@t4.6 ESTUDIANTE NO EXISTE', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let estudianteCorreo = estudiante['correo']
        let req = {
          correo: estudianteCorreo
        }
        agent
        .post('/api/att/login')
        .send(req)
        .end(function(err, resp) {
          expect(resp.body['estado']).to.equal(false)
          expect(resp.body['mensaje']).to.equal('El usuario no existe')
          done()
        })
      })
    }).timeout(10000)
    it('@t4.7 PROFESOR LOGOUT', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let correoProfesor = profesorCreado['correo']
        let req = {
          correo: correoProfesor
        }
        agent
        .post(`/api/att/login`)
        .send(req)
        .end(function(err, resp) {
          let correo = resp.body['datos']['correo']
          expect(correo).to.equal(correoProfesor)
          agent
          .get('/api/att/logout')
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc: docLogout, res })
            agent
            .get('/api/att/datosUsuario')
            .end(function(err, res) {
              expect(res.body['estado']).to.equal(false)
              expect(res.body['mensaje']).to.equal('No esta loggeado')
              done()
            })
          })
        })
      })
    }).timeout(10000)
    it('@t4.8 ESTUDIANTE LOGOUT', (done) => {
      const agent = request.agent(app)
      co(function *() {
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        let estudianteCorreo = estudianteCreado['correo']
        let req = {
          correo: estudianteCorreo
        }
        agent
        .post(`/api/att/login`)
        .send(req)
        .end(function(err, resp) {
          let correo = resp.body['datos']['correo']
          expect(correo).to.equal(estudianteCorreo)
          agent
          .get('/api/att/logout')
          .end(function(err, resp) {
            agent
            .get('/api/att/datosUsuario')
            .end(function(err, resp) {
              expect(resp.body['estado']).to.equal(false)
              expect(resp.body['mensaje']).to.equal('No esta loggeado')
              done()
            })
          })
        })
      })
    }).timeout(10000)
  })

  describe('@t5 CREAR PREGUNTA PROFESOR Y HABILITARLA', () => {
    let profesor = data.profesores[0]
    let paralelo = data.paralelos[0]
    let doc = {
      nombre: 'Crear pregunta y habilitarla',
      metodo: 'POST',
      url: '/api/att/profesor/preguntar',
      descripcion: 'El profesor crea la pregunta y ademas queda habilitada para que los estudiantes respondan',
      body: [
        { nombre: 'texto', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'paraleloId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'creador', tipo: 'Object', descripcion: ' --- ' },
        { nombre: ' correo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' tipo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' nombres', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' apellidos', margen: 'center', tipo: 'String', descripcion: ' --- '},
      ],
      errors: []
    }
    it('@t5.1 OK', (done) => { // LIMPIAR ID creador
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        yield model.anadirProfesorAParalelo({
          paralelo: {
            curso: paralelo['curso'],
            codigo: paralelo['codigo']
          },
          profesorCorreo: profesor['correo'] })
        let req = {
          texto: 'Mi pregunta a estudiante',
          paraleloId: paraleloCreado['_id'],
          creador: profesor
        }
        request(app)
        .post(`/api/att/profesor/preguntar`)
        .send(req)
        .end(function(err, res) {
          expect(res.body.estado).to.equal(true)
          expect(res.status).to.equal(200)
          expect(ajv.validate(schema.PROFESOR_CREAR_PREGUNTA, res.body.datos)).to.equal(true)
          generatorDocs.OK({ docs, doc, res, req })
          done()
        })
      })
    })
  })
  describe('@t6 RESPONDER ESTUDIANTE', () => {
    let doc = {
      nombre: 'Responder Estudiante',
      metodo: 'POST',
      url: '/api/att/estudiante/responder',
      descripcion: '',
      body: [
        { nombre: 'texto', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'paraleloId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'preguntaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'creador', tipo: 'Object', descripcion: ' --- ' },
        { nombre: ' correo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' matricula', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' nombres', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' apellidos', margen: 'center', tipo: 'String', descripcion: ' --- '},
      ]
    }
    let estudiante = data.estudiantes[0]
    let paralelo = data.paralelos[0]
    let profesor = data.profesores[0]
    let texto = 'Esta pregunta no tiene sentido'
    it('@t6.1 OK', (done) => {
      co(function *() {
        const paraleloCreado = yield model.crearParalelo(paralelo)
        const estudianteCreado = yield model.crearEstudiante(estudiante)
        const profesorCreado = yield model.crearProfesor(profesor)
        let paraleloId = paraleloCreado['_id']
        let preguntaObjeto = new db.PreguntaProfesor
        preguntaObjeto.crear({
          texto,
          paraleloId,
          creador: {
            correo: profesor['correo'],
            tipo: profesor['tipo'],
            nombres: profesor['nombres'],
            apellidos: profesor['apellidos']
          }
        }).then(preguntaCreada => {
          let req = { paraleloId, preguntaId: preguntaCreada['_id'], texto, creador: estudiante }
          request(app)
          .post(`/api/att/estudiante/responder`)
          .send(req)
          .end(function(err, res) {
            generatorDocs.OK({ docs, doc, res, req })
            expect(res.body.estado).to.equal(true)
            expect(res.status).to.equal(200)
            expect(res.body.codigoEstado).to.equal(200)
            expect(ajv.validate(schema.RESPUESTA_ESTUDIANTE, res.body.datos)).to.equal(true)
            done()
          })
        })
      }).catch((err) => console.error(err))
    }).timeout(10000)
  })
  describe('@t7 DESTACAR RESPUESTA ESTUDIANTE', () => {
    let doc = {
      nombre: 'Destacar Respuesta',
      metodo: 'PUT',
      url: '/api/att/profesor/destacarRespuesta',
      descripcion: 'Profesor escoge una pregunta para destacarla',
      body: [
        { nombre: 'respuestaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'destacadaEstado', tipo: 'Boolean', descripcion: ' --- ' }
      ],
      errors: []
    }
    it('@t7.1 OK', (done) => {
      let respuesta = new db.Respuesta({
          texto: 'Mi respuesta'
        })
      respuesta.crear()
        .then((respuestaCreada) => {
          let req = {
            respuestaId: respuestaCreada['_id'],
            destacadaEstado: true
          }
          request(app)
          .put(`/api/att/profesor/destacarRespuesta`)
          .send(req)
          .end(function(err, res) {
            expect(res.body.estado).to.equal(true)
            expect(res.status).to.equal(200)
            expect(res.body.codigoEstado).to.equal(200)
            expect(res.body.datos).to.equal(messages.RESPUESTA_DESTACADA)
            generatorDocs.OK({ docs, doc, res, req })
            done()
          })
        })
    }).timeout(10000)
    it('@t7.2 ID RESPUESTA NO EXISTE', (done) => {
      let req = {
        respuestaId: 'noexisto',
        destacadaEstado: true
      }
      request(app)
      .put(`/api/att/profesor/destacarRespuesta`)
      .send(req)
      .end(function(err, res) {
        expect(res.body.estado).to.equal(false)
        expect(res.status).to.equal(200)
        expect(res.body.codigoEstado).to.equal(200)
        expect(res.body.datos).to.equal(messages.RESPUESTA_ID_NO_EXISTE)
        generatorDocs.ERROR({ nombre: 'NO EXISTE RESPUESTA', docs, doc, res })
        done()
      })
    }).timeout(10000)
  })
  describe('@t8 TERMINAR PREGUNTA', () => {
    let doc = {
      nombre: 'Terminar Pregunta',
      metodo: 'PUT',
      url: '/api/att/profesor/terminarPregunta',
      descripcion: 'La pregunta es desabilitada a que los estudiantes puedan responder',
      body: [
        { nombre: 'paraleloId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'preguntaId', tipo: 'String', descripcion: ' --- ' },
        { nombre: 'terminadoPor', tipo: 'Object', descripcion: ' --- ' },
        { nombre: ' correo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' tipo', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' nombres', margen: 'center', tipo: 'String', descripcion: ' --- ' },
        { nombre: ' apellidos', margen: 'center', tipo: 'String', descripcion: ' --- '},
      ],
      errors: []
    }
    it('@t8.1 OK', (done) => {
      co(function *() {
        let paralelo = data.paralelos[0]
        const paraleloCreado = yield model.crearParalelo(paralelo)
        let profesor = data.profesores[0]
        const profesorCreado = yield model.crearProfesor(profesor)
        let pregunta = new db.PreguntaProfesor({
          texto: 'Mi pregunta'
        })
        pregunta.crear()
          .then((preguntaCreada) => {
            let req = {
              preguntaId: preguntaCreada['_id'],
              paraleloId: paraleloCreado['_id'],
              terminadoPor: profesor
            }
            request(app)
            .put(`/api/att/profesor/terminarPregunta`)
            .send(req)
            .end(function(err, res) {
              expect(res.body.estado).to.equal(true)
              expect(res.status).to.equal(200)
              expect(res.body.codigoEstado).to.equal(200)
              expect(ajv.validate(schema.PREGUNTA_TERMINADA, res.body.datos)).to.equal(true)
              generatorDocs.OK({ docs, doc, res, req })
              done()
            })
          })
      })
    }).timeout(10000)
    it('@t8.2 PREGUNTA O PARALELO NO EXISTE', (done) => {
      let req = {
        preguntaId: 'no existe',
        paraleloId: 'no existe',
        terminadoPor: {}
      }
      request(app)
      .put(`/api/att/profesor/terminarPregunta`)
      .send(req)
      .end(function(err, res) {
        expect(res.body.estado).to.equal(false)
        expect(res.status).to.equal(200)
        expect(res.body.codigoEstado).to.equal(200)
        generatorDocs.ERROR({ nombre: 'NO EXISTE RESPUESTA', docs, doc, res })
        done()
      })
    }).timeout(10000)
  })

  describe('@t9 PROFESOR PERFIL', ()=> {
    let doc = {
      nombre: 'Obtener datos del perfil profesor',
      metodo: 'GET',
      url: '/api/att/profesor/perfil/:paraleloId/:correo',
      descripcion: '',
      params: [
        {
          nombre: 'paraleloId',
          tipo: 'String',
          descripcion: ''
        },
        {
          nombre: 'correo',
          tipo: 'String',
          descripcion: ''
        }
      ],
      errors: []
    }
    it('@t9.1 OK', function(done) {
      let estudiante = data.estudiantes[0]
      let profesor = data.profesores[0]
      let paralelo = data.paralelos[0]
      co(function *() {
        let profesorCreado = yield model.crearProfesor(profesor)
        let paraleloCreado = yield model.crearParalelo(paralelo)
        let paraleloId = paraleloCreado['_id']
        yield model.anadirProfesorAParalelo({
          paralelo: {
            curso: paraleloCreado['curso'],
            codigo: paraleloCreado['codigo']
          },
          profesorCorreo: profesorCreado['correo'] })
        let estudianteCreado = yield model.crearEstudiante(estudiante)
        yield model.anadirEstudianteAParalelo({
          paralelo: {
            curso: paraleloCreado['curso'],
            codigo: paraleloCreado['codigo']
          },
          estudianteCorreo: estudianteCreado['correo']
        })
        yield model.crearPreguntaEstudiante({
          texto: 'Mi primera pregunta',
          paraleloId,
          creador: {
            _id: paraleloId,
            correo: estudianteCreado['correo'],
            matricula: estudianteCreado['matricula'],
            nombres: estudianteCreado['nombres'],
            apellidos: estudianteCreado['apellidos']
        }})
        let preguntaCreada = yield model.crearPreguntaProfesorYHabilitarla({ texto: 'Pregunta Profesor', paraleloId, creador: profesorCreado })
        yield model.crearRespuestaEstudiante({ paraleloId, preguntaId: preguntaCreada['_id'], texto: 'Mi respuesta', creador: estudianteCreado })
        let correo = profesorCreado['correo']
        request(app)
          .get(`/api/att/profesor/perfil/${paraleloId}/${correo}`)
          .end(function(err, res) {
            expect(ajv.validate(schema.PROFESOR_PERFIL, res.body.datos)).to.equal(true)
            expect(res.body.estado).to.equal(true)
            expect(res.status).to.equal(200)
            expect(res.body.codigoEstado).to.equal(200)
            generatorDocs.OK({ docs, doc, res })
            done()
          })
      })
    }).timeout(10000)
  })

  describe('@t10 PROFESOR CALIFICAR PREGUNTA ESTUDIANTE', ()=> {
    let doc = {
      nombre: 'Profesor calificar pregunta estudiante',
      metodo: 'PUT',
      url: '/api/att/profesor/calificarPreguntaEstudiante',
      descripcion: '',
      body: [
        {
          nombre: 'preguntaId',
          tipo: 'string',
          descripcion: ''
        },
        {
          nombre: 'calificacion',
          tipo: 'numero',
          descripcion: ''
        }
      ],
      errors: []
    }
    it('@t10.1 OK', async () => {
      let pregunta = new db.PreguntaEstudiante({
        texto: 'Mi pregunta',
        paralelo: 'idid'
      })
      let preguntaCreada = await pregunta.crear()
      let preguntaId = preguntaCreada['_id']
      let calificacion = 1
      let res = await request(app)
                .put(`/api/att/profesor/calificarPreguntaEstudiante`)
                .send({ preguntaId, calificacion })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(messages.PREGUNTA_CALIFICADA)
      generatorDocs.OK({ docs, doc, res })
    })
    it('@t10.2 PREGUNTA CON ESE ID NO EXISTE', async () => {
      let preguntaId = 'aaa'
      let calificacion = 1
      let res = await request(app)
                .put(`/api/att/profesor/calificarPreguntaEstudiante`)
                .send({ preguntaId, calificacion })
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(messages.PREGUNTAID_NO_EXISTE)
      generatorDocs.ERROR({ nombre: 'NO EXISTE PREGUNTA CON ESE ID', docs, doc, res })
    })
  })
  describe('@t11 PROFESOR CALIFICAR RESPUESTA ESTUDIANTE', ()=> {
    let doc = {
      nombre: 'Profesor calificar respuesta estudiante',
      metodo: 'PUT',
      url: '/api/att/profesor/calificarRespuestaEstudiante',
      descripcion: '',
      body: [
        {
          nombre: 'respuestaId',
          tipo: 'string',
          descripcion: ''
        },
        {
          nombre: 'calificacion',
          tipo: 'numero',
          descripcion: ''
        }
      ],
      errors: []
    }
    it('@t11.1 OK', async () => {
      let respuesta = new db.Respuesta({
        texto: 'Mi pregunta',
        paralelo: 'idid'
      })
      let respuestaCreada = await respuesta.crear()
      let respuestaId = respuestaCreada['_id']
      let calificacion = 1
      let res = await request(app)
                .put(`/api/att/profesor/calificarRespuestaEstudiante`)
                .send({ respuestaId, calificacion })
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(messages.RESPUESTA_CALIFICADA)
      generatorDocs.OK({ docs, doc, res })
    })
    it('@t11.2 RESPUESTA CON ESE ID NO EXISTE', async () => {
      let respuestaId = 'aaa'
      let calificacion = 1
      let res = await request(app)
                .put(`/api/att/profesor/calificarRespuestaEstudiante`)
                .send({ respuestaId, calificacion })
      expect(res.body.estado).to.equal(false)
      expect(res.body.codigoEstado).to.equal(200)
      expect(res.body.datos).to.equal(messages.RESPUESTAID_NO_EXISTE)
      generatorDocs.ERROR({ nombre: 'NO EXISTE RESPUESTA CON ESE ID', docs, doc, res })
    })
  })
  describe('@t12 HISTORIAL PARALELO', ()=> {
    let estudiante = data.estudiantes[0]
    let profesor = data.profesores[0]
    let paralelo = data.paralelos[0]
    it('@t11.2 OK', async () => {
      let profesorCreado = await model.crearProfesor(profesor)
      let paraleloCreado = await model.crearParalelo(paralelo)
      let estudianteCreado = await model.crearEstudiante(estudiante)
      const paraleloId = paraleloCreado['_id']
      await model.crearPreguntaEstudiante({
        texto: 'Mi primera pregunta',
        paraleloId,
        creador: estudiante
      })
      await model.crearPreguntaProfesorYHabilitarla({
        texto: 'Pregunta Profesor',
        paraleloId,
        creador: profesor
      })
      let res = await request(app)
                .get(`/api/att/profesor/historialParalelo/${paraleloId}`)
      console.log(res.body.datos)
    })
  })
})
