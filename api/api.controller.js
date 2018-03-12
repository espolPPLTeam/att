module.exports = ({ responses, messages, model, logger, validator }) => {
  const proto = {
    async ObtenerParalelosProfesor({ profesorCorreo }) {
      if (profesorCorreo && validator.isEmail(profesorCorreo)) {
      	try {
          let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo: profesorCorreo })
          if (profesorDatos) {
            let paralelos = profesorDatos['paralelos']
            let profesor = (({ correo, tipo, nombres, apellidos }) => ({ correo, tipo, nombres, apellidos }))(profesorDatos)
            let paralelos_filtrados = paralelos.map(function(paralelo) {
               return (({ codigo, _id, curso, nombre }) => ({ codigo, _id, curso, nombre }))(paralelo)
            }, [])
            profesor['paralelos'] = paralelos_filtrados
            return responses.OK({ datos: profesor })
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
    async PreguntasEstudianteHoy({ paraleloId }) {
      try {
        let preguntas = await model.obtenerPreguntasEstudiantesPorParalelo({ paraleloId })
        return responses.OK({ datos: preguntas })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async CrearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      try {
        if (paraleloId) {
          let pregunta = await model.crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
          let PREGUNTA_LIMPIADA = (({ texto, paralelo, _id, destacada, creador }) => ({ texto, paralelo, _id, destacada, creador }))(pregunta)
          return responses.OK({ datos: PREGUNTA_LIMPIADA })
          // TODO: si paraleloId no existe
        } else {
          return responses.OK_ERROR({ mensaje: messages.PARALELOID_VACIO })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async DestacarPregunta({ preguntaId, destacadaEstado }) {
      try {
        let estaDestacada = await model.destacarPregunta({ preguntaId, destacadaEstado })
        if (estaDestacada) { // FIXME: TEST
          return responses.OK({ datos: messages.PREGUNTA_DESTACADA })
        } else {
          return responses.OK_ERROR({ mensaje: messages.PREGUNTAID_NO_EXISTE })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    URL_NO_VALIDO: responses.URL_NO_VALIDO
  }
  return Object.assign(Object.create(proto), {})
}