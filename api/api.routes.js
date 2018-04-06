const _ = require('lodash')
const validator = require('validator')
module.exports = ({ app, controller, logger }) => {
  app
  .route('/profesor/datosProfesor/:profesorCorreo')
    .get((req, res) => {
      let { profesorCorreo } = req.params
      controller.ObtenerParalelosProfesor({ profesorCorreo })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/estudiante/preguntar')
    .post((req, res) => {
      let { texto, paraleloId } = req.body
      let { _id, correo, matricula, nombres, apellidos } = req.body['creador'] ? req.body['creador'] : {}
      controller.CrearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
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
  .route('/profesor/preguntasEstudianteHoy/:paraleloId')
    .get((req, res) => {
      let { paraleloId } = req.params
      controller.ObtenerPreguntasEstudiante({ paraleloId })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/estudiante/misPreguntasHoy/:correo')
    .get((req, res) => {
      let { correo } = req.params
      controller.PreguntasEstudiante({ correo })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  // RESPONDER ESTUDIANTE Y PREGUNTAR PROFESOR
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
  .route('/profesor/respuestasPregunta/:preguntaId')
    .get((req, res) => {
      let { preguntaId } = req.params
      controller.ObtenerRespuestas({ preguntaId })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

  app
  .route('/profesor/misPreguntasHoy/:paraleloId')
    .get((req, res) => {
      let { paraleloId } = req.params
      controller.ObtenerPreguntasProfesor({ paraleloId })
        .then((resp) => {
          res.status(resp.codigoEstado).json(resp)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.status(resp.codigoEstado).json(resp)
        })
    })

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

  // sera usada por profesores y estudiantes
  // cada uno devolvera diferentes resultados
  // ver con la documentacion cuales son las salidas
  app
  .route('/datosUsuario')
    .get((req, res) => {
      const sessionDatos = req.session
      if (!_.isEmpty(sessionDatos) && sessionDatos && req.session.correo) {
        let correo = req.session.correo
        controller.Login({ correo })
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
      } else {
        res.status(200).json({ estado: false, mensaje: 'No esta loggeado' })
      }
    })

  // app
  // .route('/profesor/preguntasHistorial/:paraleloId')
  //   .get((req, res) => {
  //     let { paraleloId } = req.params
  //   })


  // ENDPOINTS DE PRUEBA PARA LOGIN
  app
  .route('/login')
    .post((req, res) => {
      let { correo } = req.body
      if (!validator.isEmail(correo)) {
        correo = `${correo}@espol.edu.ec`
      }
      controller.Login({ correo })
        .then((resp) => {
          if (resp) {
            let datos = resp.datos
            req.session.correo = datos['correo']
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
