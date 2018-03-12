module.exports = ({ app, controller, logger }) => {
  app
  .route('/profesor/paralelos/:profesorCorreo')
    .get((req, res) => {
      let { profesorCorreo } = req.params
      controller.ObtenerParalelosProfesor({ profesorCorreo })
        .then((resp) => {
          res.json(resp)
          res.status(resp.codigoEstado)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.json(resp)
          res.status(resp.codigoEstado)
        })
    })

  app
  .route('/estudiante/preguntar')
    .post((req, res) => {
      let { texto, paraleloId } = req.body
      let { _id, correo, matricula, nombres, apellidos } = req.body['creador'] ? req.body['creador'] : {}
      controller.CrearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
        .then((resp) => {
          res.json(resp)
          res.status(resp.codigoEstado)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.json(resp)
          res.status(resp.codigoEstado)
        })
    })

  app
  .route('/profesor/destacarPregunta')
    .put((req, res) => {
      let { preguntaId, destacadaEstado } = req.body
      controller.DestacarPregunta({ preguntaId, destacadaEstado })
        .then((resp) => {
          res.json(resp)
          res.status(resp.codigoEstado)
        })
        .catch((err, resp) => {
          logger.error(err)
          res.json(resp)
          res.status(resp.codigoEstado)
        })
    })

  app
  .route('/profesor/preguntasEstudianteHoy/:paraleloId')
    .get((req, res) => {

    })
}


// app.route('/profesor/respuestasPregunta')
// app.route('/profesor/crearPregunta')
// app.route('/profesor/preguntasProfesorHistorial')
// app.route('/profesor/terminarPregunta')