module.exports = ({ db, logger, messages }) => {
  let PreguntaEstudiante = db.PreguntaEstudiante
  let Estudiante = db.Estudiante
  let Profesor = db.Profesor
  let Paralelo = db.Paralelo
  const proto = {
    crearEstudiante({ correo, matricula, nombres, apellidos }) {
      return new Promise((resolve, reject) => {
        let estudiante = new Estudiante({ correo, matricula, nombres, apellidos })
        estudiante.crear()
          .then(() => {
            resolve(estudiante)
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_CREAR)
        })
      })
    },
    crearProfesor({ correo, tipo, nombres, apellidos }) {
      return new Promise((resolve, reject) => {
          let profesor = new Profesor({ correo, tipo, nombres, apellidos })
          profesor.crear()
            .then(() => {
              resolve(profesor)
          }).catch((err) => {
            logger.error(err)
            reject(messages.ERROR_AL_CREAR)
          })
      })
    },
    crearParalelo({ codigo, nombre, curso, termino, anio }) {
      return new Promise(function(resolve, reject) {
          let paraleloCreado = new Paralelo({ codigo, nombre, curso, termino, anio })
          paraleloCreado.crear()
            .then(() => {
              resolve(paraleloCreado)
          }).catch((err) => {
            logger.error(err)
            reject(messages.ERROR_AL_CREAR)
          })
      })
    },
    obtenerDatosEstudiantePorCorreo({ correo }) {
      if (!correo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['correo']))
      return new Promise((resolve) => {
          Promise.all([
            Estudiante.obtenerPorCorreo({ correo }),
            Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: correo })])
              .then((values) => {
                let estudianteDatos = values[0]
                let paraleloDatos = values[1]
                let estudiante = null
                if (estudianteDatos) {
                  estudiante = JSON.parse(JSON.stringify(estudianteDatos))
                  estudiante['paraleloId'] = paraleloDatos ? paraleloDatos['_id'] : null
                }
                resolve(estudiante)
          }).catch((err) => {
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    obtenerDatosProfesorPorCorreo({ correo }) {
      if (!correo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['correo']))
      return new Promise((resolve) => {
        Promise.all([
          Profesor.obtenerPorCorreo({ correo }),
          Paralelo.obtenerParalelosProfesor({ profesorCorreo: correo }) ])
            .then((values) => {
              const paralelos = values[1]
              const profesorDatos = values[0]
              if (profesorDatos) {
                let profesor = JSON.parse(JSON.stringify(profesorDatos)) // porque por alguna razon no se puede asignar
                profesor['paralelos'] = paralelos
                resolve(profesor)
              } else {
                let profesor = null
                resolve(profesor)
              }
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
      if (!curso || !codigo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
      return new Promise(function(resolve) {
        Promise.all([
          Estudiante.eliminar({ estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((resp) => {
            resolve(true)
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    anadirEstudianteAParalelo({ paralelo: { curso, codigo }, estudianteCorreo }) {
      if (!curso || !codigo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
      return new Promise(function(resolve) {
          Promise.all([
            // Paralelo.obtenerPorCursoYCodigo({ correo: estudianteCorreo }),
            // Estudiante.obtenerPorCorreo({ correo: estudianteCorreo }),
            Paralelo.anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((values) => {
            resolve(values[0])
          }).catch((err) => {
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    anadirProfesorAParalelo({ paralelo: { curso, codigo }, profesorCorreo }) {
      if (!curso || !codigo || !profesorCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'profesorCorreo']))
      return new Promise(function(resolve) {
        Paralelo.anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo })
          .then((resp) => {
            resolve(resp)
          }).catch((err) => {
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    cambiarEstudianteDeParalelo({ paraleloNuevo: { cursoNuevo, codigoNuevo }, paraleloAntiguo: { cursoAntiguo, codigoAntiguo }, estudianteCorreo }) {
      if (!cursoNuevo || !codigoNuevo || !cursoAntiguo || !codigoAntiguo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['cursoNuevo', 'codigoNuevo', 'cursoAntiguo', 'codigoAntiguo', 'estudianteCorreo']))
      return new Promise((resolve) => {
        Promise.all([
          Paralelo.anadirEstudiante({ paralelo: { curso: cursoNuevo, codigo: codigoNuevo }, estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso: cursoAntiguo, codigo: codigoAntiguo }, estudianteCorreo })])
            .then((values) => {
              resolve(values[0] && values[1])
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    // Preguntas
    crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      return new Promise((resolve) => {
        let pregunta = new PreguntaEstudiante({ texto, paralelo: paraleloId, 'creador': { _id, correo, nombres, apellidos } })
        pregunta.crear()
          .then(preguntaCreda => {
            Promise.all([
              Estudiante.anadirPregunta({ correo, preguntaId: pregunta['_id'] }),
              Paralelo.anadirPreguntaEstudiante({ paraleloId, preguntaId: pregunta['_id'] })])
                .then((values) => {
                  if (values[0] && values[1]) {
                    resolve(pregunta)
                  } else {
                    resolve({})
                  }
            }).catch((err) => {
              logger.error(err)
              reject(messages.ERROR_AL_OBTENER)
            })
        })
      })
    },
    destacarPregunta({ preguntaId, destacadaEstado }) {
      return new Promise((resolve) => {
        PreguntaEstudiante.destacar({ preguntaId, destacadaEstado })
          .then((resp) => {
            resolve(resp)
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    obtenerPreguntasEstudiantesPorParalelo({ paraleloId }) {
      return new Promise((resolve) => {
        PreguntaEstudiante.obtenerPorParaleloHoy({ paraleloId })
          .then((preguntas) => {
            resolve(preguntas)
        }).catch((err) => {
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    }
    // crearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {

    // },
    // crearRespuestaEstudiante({ text, preguntaId, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {

    // }
  }
  return Object.assign(Object.create(proto), {})
}
