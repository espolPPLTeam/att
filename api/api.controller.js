const _ = require('lodash')
module.exports = ({ responses, messages, model, logger, validator }) => {
  const proto = {
    URL_NO_VALIDO: responses.URL_NO_VALIDO,
    async Login({ correo }) {
      try {
        let profesor = await this.ObtenerParalelosProfesor({ profesorCorreo: correo })
        let estudiante = await this.ObtenerDatosEstudiante({ correo })
        let esProfesor = profesor ? profesor['estado'] : false
        let esEstudiante = estudiante ? estudiante['estado'] : false
        if (esProfesor) {
          return responses.OK({ datos: profesor['datos'] })
        } else if (esEstudiante) {
          let estudianteDatos = estudiante['datos']
          let paraleloId = estudianteDatos['paraleloId']
          let preguntas = await model.obtenerPreguntasEstudiantePorCorreo({ correo })
          let paralelo = await model.PreguntaHabilitadaParalelo({ paraleloId })
          let pregunta = paralelo ? paralelo['preguntaActual'] : null
          estudianteDatos['misPreguntasHoy'] = preguntas
          if (pregunta) {
            pregunta =  _.pick(pregunta, ['texto', '_id', 'createdAt'])
            pregunta['preguntaId'] = pregunta['_id']
            pregunta['fechaCreadaPregunta'] = pregunta['createdAt']
            let preguntaId = pregunta['_id']
            delete pregunta.createdAt
            delete pregunta._id
            let respuesta = await model.obtenerRespuestaCreador({ correo: estudianteDatos['correo'], preguntaId })
            if (respuesta) {
              pregunta['fechaCreadaRespuesta'] = respuesta['createdAt']
              pregunta['respuesta'] = respuesta['texto']
            }
            estudianteDatos['preguntaProfesor'] = pregunta
          }
          return responses.OK({ datos: estudianteDatos })
        } else {
          return null
        }
      } catch (err) {
        console.log(err)
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async ObtenerParalelosProfesor({ profesorCorreo }) {
      if (profesorCorreo && validator.isEmail(profesorCorreo)) {
      	try {
          let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo: profesorCorreo })
          if (profesorDatos) {
            let { paralelos }= profesorDatos
            let profesor = _.pick(profesorDatos, ['correo', 'tipo', 'nombres', 'apellidos'])
            let paralelos_filtrados = paralelos.map(function(paralelo) {
              return _.pick(paralelo, ['codigo', '_id', 'curso', 'nombre'])
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
          let estudiante_filtrado = _.pick(estudiante, ['correo', 'matricula', 'nombres', 'apellidos', 'paraleloId'])
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
    async CrearPreguntaEstudiante({ texto, paraleloId, creador: { correo, matricula, nombres, apellidos } }) {
      try {
        if (paraleloId) {
          // TODO: si paraleloId no existe
          let pregunta = await model.crearPreguntaEstudiante({ texto, paraleloId, creador: { correo, matricula, nombres, apellidos } })
          if (pregunta) {
            let PREGUNTA_LIMPIADA = _.pick(pregunta, ['texto', 'paralelo', '_id', 'creador', 'destacada'])
            return responses.OK({ datos: PREGUNTA_LIMPIADA })
          } else {
            return responses.OK_ERROR({ mensaje: messages.ERROR_AL_CREAR })
          }
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
    async CrearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, tipo, nombres, apellidos } }) {
      try {
        let pregunta = await model.crearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, tipo, nombres, apellidos } })
        if (pregunta) {
          let preguntaLimpiada = _.pick(pregunta, ['_id', 'texto', 'creador'])
          return responses.OK({ datos: preguntaLimpiada })
        } else {
          return responses.OK_ERROR({ mensaje: messages.ERROR_AL_CREAR })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async CrearRespuestaEstudiante({ paraleloId, preguntaId, texto, creador: { _id, correo, matricula, nombres, apellidos } }) {
      try {
        let respuesta = await model.crearRespuestaEstudiante({ paraleloId, preguntaId, texto, creador: { _id, correo, matricula, nombres, apellidos } })
        if (respuesta) {
          return responses.OK({ datos: respuesta })
        } else {
          return responses.OK_ERROR({ mensaje: messages.ERROR_AL_CREAR })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async DestacarRespuestaEstudiante({ respuestaId, destacadaEstado }) {
      try {
        let fueDestacada = await model.destacarRespuestaEstudiante({ respuestaId, destacadaEstado })
        if (fueDestacada) {
          return responses.OK({ datos: messages.RESPUESTA_DESTACADA })
        } else {
          return responses.OK_ERROR({ mensaje: messages.RESPUESTA_ID_NO_EXISTE })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async TerminarPregunta({ preguntaId, paraleloId, terminadoPor: { _id, correo, nombres, apellidos, tipo } }) {
      let profesor = { _id, correo, nombres, apellidos, tipo }
      try {
        let fueTerminada = await model.terminarPregunta({ preguntaId, paraleloId, terminadoPor: profesor })
        if (fueTerminada) {
          return responses.OK({ datos: fueTerminada })
        } else {
          return responses.OK_ERROR({ mensaje: messages.PARALELO_NO_EXISTE })
        }
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async ObtenerRespuestas({ preguntaId }) {
      try {
        let preguntas = await model.obtenerRespuestasPorPregunta({ preguntaId })
        return responses.OK({ datos: preguntas })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async ObtenerPreguntasProfesor({ paraleloId }) {
      try {
        let preguntas = await model.obtenerPreguntasProfesorHoy({ paraleloId })
        return responses.OK({ datos: preguntas })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async PerfilProfesor({ correo, paraleloId }) {
      try {
        let profesorDatos = await model.obtenerDatosProfesorPorCorreo({ correo })
        profesorDatos = _.pick(profesorDatos, ['correo', 'tipo', 'nombres', 'apellidos'])
        let preguntasEstudiantesHoy = await model.obtenerPreguntasEstudiantesPorParalelo({ paraleloId })
        profesorDatos['preguntasEstudiantesHoy'] = preguntasEstudiantesHoy
        let preguntaHabilitada = await model.PreguntaHabilitadaParalelo({ paraleloId })
        let pregunta = _.pick(preguntaHabilitada['preguntaActual'], ['creador', 'createdAt', 'texto', 'respuestas'])
        profesorDatos['preguntaProfesor'] = pregunta
        return responses.OK({ datos: profesorDatos })
      } catch (err) {
        logger.error(err)
        return responses.ERROR_SERVIDOR
      }
    }
  }
  return Object.assign(Object.create(proto), {})
}

// _.map(columns, _.partialRight(_.pick, 'key'))
