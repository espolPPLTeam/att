module.exports = ({ responses, messages, model, logger, validator }) => {
  const proto = {
    async Login({ correo }) {
      try {
        let profesor = await this.ObtenerParalelosProfesor({ profesorCorreo: correo })
        let estudiante = await this.ObtenerDatosEstudiante({ correo })
        let esProfesor = profesor['estado']
        let esEstudiante = estudiante['estado']
        if (esProfesor) {
          return responses.OK({ datos: profesor['datos'] })
        } else if (esEstudiante) {
          return responses.OK({ datos: estudiante['datos'] })
        } else {
          return null
        }
      } catch (err) {
        logger.error(err)
        return null
      }
    },
    async ObtenerParalelosProfesor({ profesorCorreo }) {
      if (profesorCorreo && validator.isEmail(profesorCorreo)) {
      	try {
          let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo: profesorCorreo })
          if (profesorDatos) {
            let { paralelos }= profesorDatos
            let profesor = (({ correo, tipo, nombres, apellidos }) => ({ correo, tipo, nombres, apellidos }))(profesorDatos)
            let paralelos_filtrados = paralelos.map(function(paralelo) {
               return (({ codigo, _id, curso, nombre }) => ({ codigo, _id, curso, nombre }))(paralelo)
            }, [])
            profesor = { ...profesor, paralelos: paralelos_filtrados }
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
    async ObtenerDatosEstudiante({ correo }) {
      try {
        let estudiante = await model.obtenerDatosEstudiantePorCorreo({ correo })
        if (estudiante) {
          let estudiante_filtrado = (({ correo, matricula, nombres, apellidos }) => ({ correo, matricula, nombres, apellidos }))(estudiante)
          return responses.OK({ datos: estudiante_filtrado })
        } else {
          return responses.OK_ERROR({ mensaje: messages.ESTUDIANTE_NO_EXISTE })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
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
          // TODO: si paraleloId no existe
          let pregunta = await model.crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } })
          let PREGUNTA_LIMPIADA = (({ texto, paralelo, _id, destacada, creador }) => ({ texto, paralelo, _id, destacada, creador }))(pregunta)
          return responses.OK({ datos: PREGUNTA_LIMPIADA })
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
        if (estaDestacada) {
          return responses.OK({ datos: messages.PREGUNTA_DESTACADA })
        } else {
          return responses.OK_ERROR({ mensaje: messages.PREGUNTAID_NO_EXISTE })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async ObtenerPreguntasEstudiante({ paraleloId }) {
      try {
        let preguntas = await model.obtenerPreguntasEstudiantesPorParalelo({ paraleloId })
        return responses.OK({ datos: preguntas })
      } catch (e) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async PreguntasEstudiante({ correo }) {
      try {
        let preguntas = await model.obtenerPreguntasEstudiantePorCorreo({ correo })
        return responses.OK({ datos: preguntas })
      } catch (e) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    URL_NO_VALIDO: responses.URL_NO_VALIDO
  }
  return Object.assign(Object.create(proto), {})
}
