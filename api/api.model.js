module.exports = ({ db, logger, messages }) => {
  const _ = require('lodash')
  let PreguntaEstudiante = db.PreguntaEstudiante
  let Estudiante = db.Estudiante
  let Profesor = db.Profesor
  let Paralelo = db.Paralelo
  let PreguntaProfesor = db.PreguntaProfesor
  let Respuesta = db.Respuesta
  const proto = {
    PreguntaHabilitadaParalelo({ paraleloId }) {
      return new Promise((resolve, reject) => {
        Paralelo.obtenerPreguntaHabilitada({ paraleloId })
        .then((pregunta) => {
          resolve(pregunta)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    crearEstudiante({ correo, matricula, nombres, apellidos }) {
      return new Promise((resolve, reject) => {
        let estudiante = new Estudiante({ correo, matricula, nombres, apellidos })
        estudiante.crear()
          .then(() => {
            resolve(estudiante)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
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
            if (process.env.NODE_ENV === 'development')
              console.error(err)
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
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_CREAR)
          })
      })
    },
    obtenerDatosEstudiantePorCorreo({ correo }) {
      if (!correo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['correo']))
      return new Promise((resolve, reject) => {
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
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    obtenerDatosProfesorPorCorreo({ correo }) {
      if (!correo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['correo']))
      return new Promise((resolve, reject) => {
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
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
      if (!curso || !codigo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
      return new Promise(function(resolve, reject) {
        Promise.all([
          Estudiante.eliminar({ estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((resp) => {
            resolve(true)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    anadirEstudianteAParalelo({ paralelo: { curso, codigo }, estudianteCorreo }) {
      if (!curso || !codigo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'estudianteCorreo']))
      return new Promise(function(resolve, reject) {
          Promise.all([
            // Paralelo.obtenerPorCursoYCodigo({ correo: estudianteCorreo }),
            // Estudiante.obtenerPorCorreo({ correo: estudianteCorreo }),
            Paralelo.anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((values) => {
            resolve(values[0])
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    anadirProfesorAParalelo({ paralelo: { curso, codigo }, profesorCorreo }) {
      if (!curso || !codigo || !profesorCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['curso', 'codigo', 'profesorCorreo']))
      return new Promise(function(resolve, reject) {
        Paralelo.anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo })
          .then((resp) => {
            resolve(resp)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_OBTENER)
          })
      })
    },
    cambiarEstudianteDeParalelo({ paraleloNuevo: { cursoNuevo, codigoNuevo }, paraleloAntiguo: { cursoAntiguo, codigoAntiguo }, estudianteCorreo }) {
      if (!cursoNuevo || !codigoNuevo || !cursoAntiguo || !codigoAntiguo || !estudianteCorreo)
        return Promise.reject(messages.NO_ESTA_ENVIANDO(['cursoNuevo', 'codigoNuevo', 'cursoAntiguo', 'codigoAntiguo', 'estudianteCorreo']))
      return new Promise((resolve, reject) => {
        Promise.all([
          Paralelo.anadirEstudiante({ paralelo: { curso: cursoNuevo, codigo: codigoNuevo }, estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso: cursoAntiguo, codigo: codigoAntiguo }, estudianteCorreo })])
            .then((values) => {
              resolve(_.every(values))
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    // Preguntas
    crearPreguntaEstudiante({ texto, paraleloId, creador: { correo, matricula, nombres, apellidos } }) {
      return new Promise((resolve, reject) => {
        let pregunta = new PreguntaEstudiante({ texto, paralelo: paraleloId, 'creador': { correo, nombres, matricula, apellidos } })
        pregunta.crear()
          .then(preguntaCreda => {
            Promise.all([
              Estudiante.anadirPregunta({ correo, preguntaId: pregunta['_id'] }),
              Paralelo.anadirPreguntaEstudiante({ paraleloId, preguntaId: pregunta['_id'] })])
                .then((values) => {
                  if (_.every(values)) {
                    resolve(pregunta)
                  } else {
                    resolve(null)
                  }
            }).catch((err) => {
              if (process.env.NODE_ENV === 'development')
                console.error(err)
              logger.error(err)
              reject(messages.ERROR_AL_OBTENER)
            })
        })
      })
    },
    destacarPregunta({ preguntaId, destacadaEstado }) {
      return new Promise((resolve, reject) => {
        PreguntaEstudiante.destacar({ preguntaId, destacadaEstado })
          .then((resp) => {
            resolve(resp)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    obtenerPreguntasEstudiantesPorParalelo({ paraleloId }) {
      return new Promise((resolve, reject) => {
        PreguntaEstudiante.obtenerPorParaleloHoy({ paraleloId })
          .then((preguntas) => {
            resolve(preguntas)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    obtenerPreguntasEstudiantePorCorreo({ correo }) {
      return new Promise((resolve, reject) => {
        PreguntaEstudiante.obtenerPreguntasPorCorreo({ correo })
          .then((preguntas) => {
            resolve(preguntas)
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_OBTENER)
        })
      })
    },
    crearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, tipo, nombres, apellidos } }) {
      return new Promise((resolve, reject) => {
        // La pregunta se habilita por si sola porque esta como default true
        let pregunta = new PreguntaProfesor({ texto, paralelo: paraleloId, 'creador': { _id, correo, tipo, nombres, apellidos } })
        pregunta.crear()
          .then(preguntaCreda => {
            Promise.all([
              Paralelo.anadirPreguntaActual({ paraleloId, preguntaId: pregunta['_id'] }),
              Profesor.anadirPregunta({ correo, preguntaId: pregunta['_id'] }),
              Paralelo.anadirPreguntaProfesor({ paraleloId, preguntaId: pregunta['_id'] })
              ])
              .then((values) => {
                if (_.every(values)) {
                  resolve(pregunta)
                } else {
                  resolve(null)
                }
            }).catch((err) => {
              if (process.env.NODE_ENV === 'development')
                console.error(err)
              logger.error(err)
              reject(messages.ERROR_AL_CREAR)
            })
        })
      })
    },
    crearRespuestaEstudiante({ paraleloId, preguntaId, texto, creador: { _id, correo, matricula, nombres, apellidos } }) {
      return new Promise((resolve, reject) => {
        let creadorTmp =  { _id, correo, matricula, nombres, apellidos }
        let respuesta = new Respuesta({
          paraleloId,
          preguntaId,
          texto,
          creador: creadorTmp
        })
        respuesta.crear()
          .then(respuestaCreada => {
            let respuestaId = respuesta['_id']
            Promise.all([
              Estudiante.anadirRespuesta({ matricula, respuestaId }),
              PreguntaProfesor.anadirRespuesta({ preguntaId, respuestaId })
            ])
            .then((values) => {
              if (_.every(values)) {
                resolve(respuesta)
              } else {
                resolve(null)
              }
            }).catch((err) => {
              if (process.env.NODE_ENV === 'development')
                console.error(err)
              logger.error(err)
              reject(messages.ERROR_AL_CREAR)
            })
          })
      })
    },
    destacarRespuestaEstudiante({ respuestaId, destacadaEstado }) {
      return new Promise((resolve, reject) => {
        Respuesta.destacar({ respuestaId, destacadaEstado })
          .then((resp) => {
            resolve(resp)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_CREAR)
          })
      })
    },
    terminarPregunta({ paraleloId, preguntaId, terminadoPor: { _id, correo, nombres, apellidos, tipo } }) {
      return new Promise((resolve, reject) => {
        let respuestaVacia = null
        let profesor = { _id, correo, nombres, apellidos, tipo }
        Promise.all([
          Paralelo.anadirPreguntaActual({ paraleloId, preguntaId: respuestaVacia }),
          PreguntaProfesor.terminar({ preguntaId, terminadoPor: profesor })
        ])
        .then((values) => {
          if (_.every(values)) {
            resolve({ paraleloId, preguntaId, terminadoPor: profesor })
          } else {
            resolve(null)
          }
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_CREAR)
        })
      })
    },
    obtenerRespuestaCreador({ correo, preguntaId }) {
      return new Promise((resolve, reject) => {
        Respuesta.obtenerRespuestaCreador({ correo, preguntaId })
          .then((respuesta) => {
            resolve(respuesta)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    calificarPregunta({ preguntaId, calificacion }) {
      return new Promise((resolve, reject) => {
        PreguntaEstudiante.calificar({ preguntaId, calificacion })
          .then((respuesta) => {
            resolve(respuesta)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    calificarRespuesta({ respuestaId, calificacion }) {
      return new Promise((resolve, reject) => {
        Respuesta.calificar({ respuestaId, calificacion })
          .then((respuesta) => {
            resolve(respuesta)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    historialParalelo({ paraleloId }) {
      return new Promise((resolve, reject) => {
        Paralelo.obtenerPorIdPopulate({ paraleloId })
          .then((paraleloDatos) => {
            if (!paraleloDatos) {
              resolve(messages.PARALELO_NO_EXISTE)
            }
            let datosOrdenadorPorFecha = {}
            if (paraleloDatos['preguntasProfesor'])
              datosOrdenadorPorFecha = paraleloDatos['preguntasProfesor'].reduce((acc, cur, i) => {
                let fecha = moment(cur['createdAt']).format('YYYY-MM-DD')
                if (acc[fecha]) {
                  acc[fecha]['preguntasProfesor'].push({
                    texto: cur.texto,
                    id: cur.id
                  })
                } else {
                  acc[fecha] = {
                    preguntasProfesor: [{
                      texto: cur.texto,
                      id: cur.id
                    }]
                  }
                }
                return acc
              }, {})

            let datosOrdanadorTodos = {}
            if (paraleloDatos['preguntasEstudiante']) {
              datosOrdanadorTodos = paraleloDatos['preguntasEstudiante'].reduce((acc, cur, i) => {
                let fecha = moment(cur['createdAt']).format('YYYY-MM-DD')
                if (acc[fecha]) {
                  if (!_.has(acc[fecha], 'preguntasEstudiante.calificadas')) {
                    acc[fecha]['preguntasEstudiante'] = {}
                    acc[fecha]['preguntasEstudiante']['calificadas'] = 0
                    acc[fecha]['preguntasEstudiante']['total'] = 0
                  }
                  acc[fecha]['preguntasEstudiante']['total']++
                  if (cur['calificacion'] !== 0) {
                    acc[fecha]['preguntasEstudiante']['calificadas']++
                  }
                } else {
                  acc[fecha] = {}
                  acc[fecha]['preguntasEstudiante'] = { total: 1, calificadas: 0 }
                  if (cur['calificacion'] !== 0) {
                    acc[fecha]['preguntasEstudiante']['calificadas']++
                  }
                }
                return acc
              }, datosOrdenadorPorFecha)
            } else {
              datosOrdanadorTodos = datosOrdenadorPorFecha
            }
            let todos = []
            for ( let fecha in datosOrdanadorTodos) {
              let dato = datosOrdanadorTodos[fecha]
              todos.push({ ...dato, fecha })
            }
            todos = _.sortBy(todos, function (o) {
              return moment(o.fecha, 'YYYY-MM-DD', true)
            }).reverse()
            resolve(todos)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    preguntasEstudiantesPorDia ({ dia, paraleloId }) {
      return new Promise((resolve, reject) => {
        PreguntaEstudiante.obtenerPreguntasPorDia({ dia, paraleloId })
          .then((preguntas) => {
            resolve(preguntas)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    preguntaProfesorPorId ({ id }) {
      return new Promise((resolve, reject) => {
        PreguntaProfesor.obtenerPorIdPopulate({ id })
        .then((pregunta) => {
            resolve(pregunta)
          }).catch((err) => {
            if (process.env.NODE_ENV === 'development')
              console.error(err)
            logger.error(err)
            reject(messages.ERROR_AL_BUSCAR)
          })
      })
    },
    limpiarTodosTerminadas() {
      return new Promise((resolve, reject) => {
        Promise.all([
          Paralelo.PreguntaActualLimpiar(),
          PreguntaProfesor.terminarTodas()
        ])
        .then((values) => {
          if (_.every(values)) {
            resolve(true)
          } else {
            resolve(null)
          }
        }).catch((err) => {
          if (process.env.NODE_ENV === 'development')
            console.error(err)
          logger.error(err)
          reject(messages.ERROR_AL_CREAR)
        })
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}
