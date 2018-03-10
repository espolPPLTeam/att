module.exports = ({ app, controller, logger }) => {
  app
  .route('/profesor/paralelos/:profesorCorreo')
    .get((req, res) => {
      let profesorCorreo = req.params.profesorCorreo
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
  .route('/profesor/preguntasEstudianteHoy')
    .get((req, res) => {

    })

  app
  .route('/profesor/destacarPregunta')
    .put((req, res) => {

    })

  app
  .route('/estudiante/preguntar')
    .post((req, res) => {

    })
}


// app.route('/profesor/respuestasPregunta')
// app.route('/profesor/crearPregunta')
// app.route('/profesor/preguntasProfesorHistorial')
// app.route('/profesor/terminarPregunta')