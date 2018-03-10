module.exports = ({ responses, messages, model, logger, validator }) => {
  const proto = {
    async ObtenerParalelosProfesor({ profesorCorreo }) {
      if (profesorCorreo && validator.isEmail(profesorCorreo)) {
      	try {
          let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo: profesorCorreo })
          if (profesorDatos) {
            return responses.OK({ datos: profesorDatos })
          } else {
            return responses.OK_ERROR({ mensaje: messages.PROFESOR_NO_EXISTE })
          }
      	} catch (err) {
      	  logger.error(err)
      	  return responses.ERROR_SERVIDOR
      	}
      } else {
    	  return responses.OK_ERROR({ mensaje: messages.CORREO_INVALIDO })
      }
    },
    async preguntasEstudianteHoy({ paraleloId }) {
      try {
        let preguntas = await model.obtenerPreguntasEstudiantesPorParalelo({ paraleloId })
        return responses.OK({ datos: preguntas })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      try {
        if (paraleloId) {
          await model.crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
          return responses.OK({ datos: messages.PREGUNTA_CREADA })
          // TODO: si paraleloId no existe
        } else {
          return responses.OK_ERROR({ mensaje: messages.PARALELOID_VACIO })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async destacarPregunta({ preguntaId, destacadaEstado }) {
      try {
        await model.destacarPregunta({ preguntaId, destacadaEstado })
        return responses.OK({ datos: messages.PREGUNTA_DESTACADA })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    }
  }
  return Object.assign(Object.create(proto), {})
}