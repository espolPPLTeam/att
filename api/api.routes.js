const _ = require('lodash')
const validator = require('validator')
module.exports = ({ app, controller, logger }) => {

  // PROFESORES
  app
  .route('/profesor/perfil/:paraleloId/:correo')
    .get((req, res) => {
      let { paraleloId, correo } = req.params
      controller.PerfilProfesor({ correo, paraleloId })
      .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
      .catch((err, resp) => {
        logger.error(err)
        res.status(resp.codigoEstado).json(resp)
      })
    })

  app
  .route('/profesor/destacarPregunta')
    .put((req, res) => {
      let { preguntaId, destacadaEstado } = req.body
      controller.DestacarPregunta({ preguntaId, destacadaEstado })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/destacarRespuesta')
    .put((req, res) => {
      let { respuestaId, destacadaEstado } = req.body
      controller.DestacarRespuestaEstudiante({ respuestaId, destacadaEstado })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/terminarPregunta')
    .put((req, res) => {
      let { preguntaId, paraleloId } = req.body
      let { terminadoPor } = req.body
      controller.TerminarPregunta({ preguntaId, paraleloId, terminadoPor })
        .then((resp) => {
            res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/preguntar')
    .post((req, res) => {
      let { texto, paraleloId } = req.body
      let creador = req.body['creador'] ? req.body['creador'] : {}
      controller.CrearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/calificarPreguntaEstudiante')
    .put((req, res) => {
      let { preguntaId, calificacion } = req.body
      controller.CalificarPregunta({ preguntaId, calificacion })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/calificarRespuestaEstudiante')
    .put((req, res) => {
      let { respuestaId, calificacion } = req.body
      controller.CalificarRespuesta({ respuestaId, calificacion })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/historialParalelo/:paraleloId')
    .get((req, res) => {
      let { paraleloId } = req.params
      controller.HistorialParalelo({ paraleloId })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/preguntasEstudiantes/:paraleloId/:dia')
  .get((req, res) => {
      let { dia, paraleloId } = req.params
      controller.PreguntasEstudiantesPorDia({ dia, paraleloId })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/preguntaProfesor/:id')
  .get((req, res) => {
      let { id } = req.params
      controller.PreguntaProfesor({ id })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  // ESTUDIANTES
  app
  .route('/estudiante/preguntar')
    .post((req, res) => {
      let { texto, paraleloId } = req.body
      let { email, matricula, nombres, apellidos } = req.body['creador'] ? req.body['creador'] : {}
      controller.CrearPreguntaEstudiante({ texto, paraleloId, creador: { email, matricula, nombres, apellidos } })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/estudiante/responder')
    .post((req, res) => {
      let { texto, paraleloId, preguntaId } = req.body
      let creador = req.body['creador'] ? req.body['creador'] : {}
      controller.CrearRespuestaEstudiante({texto, paraleloId, preguntaId, creador })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  // sera usada por profesores y estudiantes
  // cada uno devolvera diferentes resultados
  // ver con la documentacion cuales son las salidas
  app
  .route('/datosUsuario/:email')
    .get((req, res) => {
      let email = req.params.email
      controller.Login({ email })
        .then((resp) => {
          if (resp) {
            res.status(resp.codigoEstado).json(resp)
          } else {
            res.status(200).json({ estado: false, mensaje: 'El usuario no existe' })
          }
        })
        .catch((err, resp) => {
          console.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
      // const sessionDatos = req.session
      // if (!_.isEmpty(sessionDatos) && sessionDatos && req.session.correo) {

      // } else {
      //   res.status(200).json({ estado: false, mensaje: 'No esta loggeado' })
      // }
    })

  // ENDPOINTS DE PRUEBA PARA LOGIN
  app
  .route('/login')
    .post((req, res) => {
      let { correo } = req.body
      if (!validator.isEmail(correo)) {
        correo = `${correo}@espol.edu.ec`
      }
      controller.Login({ email: correo })
        .then((resp) => {
          if (resp) {
            let datos = resp.datos
            req.session.email = datos['email']
            res.send(resp)
          } else {
            res.status(200).json({ estado: false, mensaje: 'El usuario no existe' })
          }
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/logout')
    .get((req, res) => {
      req.session.destroy(function( err ) {
        if ( err ) {
          console.error(err)
          res.status(401).json({ estado: false })
        } else {
          res.status(200).json({ estado: true })
        }
      })
    })

  app
  .use((req, res) => {
    res.status(controller.URL_NO_VALIDO.codigoEstado).json(controller.URL_NO_VALIDO)
  })

}
