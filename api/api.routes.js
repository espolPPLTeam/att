module.exports = ({ app, controller, logger }) => {
  app.route('/profesor/paralelos')
    .post((req, res) => {
      let profesorCorreo = req.body.profesorCorreo
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
  app.route('/profesor/preguntasEstudianteHoy')
  app.route('/profesor/destacarPregunta')
  
  // app.route('/profesor/respuestasPregunta')
  // app.route('/profesor/crearPregunta')
  // app.route('/profesor/preguntasProfesorHistorial')
  // app.route('/profesor/terminarPregunta')
}