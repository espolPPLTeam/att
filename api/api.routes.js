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
      // con cuales pregunta fueron destacadas
    })

  app
  .route('/estudiante/misPreguntasHoy/:estudianteId')
    .get((req, res) => {
      let { estudianteId } = req.params
    })

  app
  .route('/profesor/respuestasPregunta/:preguntaId')
    .get((req, res) => {
      let { preguntaId } = req.params
    })

  app
  .route('/profesor/misPreguntasHoy/:paraleloId')
    .get((req, res) => {
      let { paraleloId } = req.params
    })

  app
  .route('/profesor/preguntar')
    .post((req, res) => {
      let { texto, paraleloId } = req.body
    })

  app
  .route('/profesor/terminarPregunta')
    .put((req, res) => {
      let { preguntaId, paraleloId } = req.body
    })

  app
  .route('/profesor/preguntasHistorial/:paraleloId')
    .get((req, res) => {
      let { paraleloId } = req.params
    })

  app
  .use((req, res) => {
    res.status(controller.URL_NO_VALIDO.codigoEstado).json(controller.URL_NO_VALIDO)
  })
}
