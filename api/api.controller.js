module.exports = ({ responses, model, logger, validator, moment }) => {
  const proto = {
    async ObtenerParalelosProfesor({ profesorCorreo }) {
      let esCorreo = validator.isEmail(profesorCorreo)
      if (esCorreo) {
      	try {
          let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo: profesorCorreo})
      	  return responses.OK({ datos: profesorDatos })
      	} catch (err) {
      	  logger.error(err)
      	  return responses.ERROR_SERVIDOR
      	}
      } else {
    	return responses.OK_ERROR({ mensaje: 'El correo no es válido'})
      }
    },
    preguntasEstudianteHoy({ paraleloId }) {

    },
    destacarPregunta({ preguntaId, destacadaEstado }) {

    }
  }
  return Object.assign(Object.create(proto), {})
}