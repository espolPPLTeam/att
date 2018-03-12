module.exports = ({ db, logger }) => {
  let PreguntaEstudiante = db.PreguntaEstudiante
  let Estudiante = db.Estudiante
  let Profesor = db.Profesor
  let Paralelo = db.Paralelo
  const proto = {
    crearParalelo({ codigo, nombre, curso, termino, anio }) {
      return new Promise(function(resolve) {
        let paraleloCreado = new Paralelo({ codigo, nombre, curso, termino, anio })
        paraleloCreado.crear()
          .then(() => {
            resolve(paraleloCreado)
          }).catch(err => logger.error(err))
      })
    },
    anadirEstudianteAParalelo({ paralelo: { curso, codigo }, estudianteCorreo }) {
      return new Promise(function(resolve) {
        Paralelo.anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          .then((resp) => {
            resolve(resp)
          }).catch(err => logger.error(err))
      })
    },
    anadirProfesorAParalelo({ paralelo: { curso, codigo }, profesorCorreo }) {
      return new Promise(function(resolve) {
        Paralelo.anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo })
          .then((resp) => {
            resolve(resp)
          }).catch(err => logger.error(err))
      })
    },
    eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
      return new Promise(function(resolve) {
        Promise.all([
          Estudiante.eliminar({ estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((resp) => {
            resolve(resp)
        }).catch(err => logger.error(err))
      }).catch(err => logger.error(err))
    },
    cambiarEstudianteDeParalelo({ paraleloNuevo: { cursoNuevo, codigoNuevo }, paraleloAntiguo: { cursoAntiguo, codigoAntiguo }, estudianteCorreo }) {
      return new Promise((resolve) => {
        Promise.all([
          Paralelo.anadirEstudiante({ paralelo: { curso: cursoNuevo, codigo: codigoNuevo }, estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso: cursoAntiguo, codigo: codigoAntiguo }, estudianteCorreo })])
            .then((resp) => {
              resolve(resp)
        }).catch(err => logger.error(err))
      }).catch(err => logger.error(err))
    },
    crearEstudiante({ correo, matricula, nombres, apellidos }) {
      return new Promise((resolve) => {
        let estudiante = new Estudiante({ correo, matricula, nombres, apellidos })
        estudiante.crear()
          .then(() => {
            resolve(estudiante)
        }).catch(err => logger.error(err))
      })
    },
    crearProfesor({ correo, tipo, nombres, apellidos }) {
      return new Promise((resolve) => {
        let profesor = new Profesor({ correo, tipo, nombres, apellidos })
        profesor.crear()
          .then(() => {
            resolve(profesor)
        }).catch(err => logger.error(err))
      })
    },
    obtenerDatosEstudiantePorCorreo({ correo }) {
      return new Promise((resolve) => {
        Promise.all([
          Estudiante.obtenerPorCorreo({ correo }),
          Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: correo })])
            .then((values) => {
              let estudiante = null
              if (values[0]) {
                estudiante = values[0]
                if ( values[1] ) {
                  estudiante['paraleloId'] = values[1]['_id'] 
                } else {
                  estudiante['paraleloId'] = null
                }
              }
              resolve(estudiante)
        }).catch(err => logger.error(err))
      })
    },
    obtenerDatosProfesorPorCorreo({ correo }) {
      return new Promise((resolve) => {
        Promise.all([
          Profesor.obtenerPorCorreo({ correo }),
          Paralelo.obtenerParalelosProfesor({ profesorCorreo: correo }) ])
            .then((values) => {
              const paralelos = values[1]
              const profesorDatos = values[0]
              if (values[0]) {
                let profesor = JSON.parse(JSON.stringify(profesorDatos)) // porque por alguna razon no se puede asignar
                profesor['paralelos'] = paralelos
                resolve(profesor)
              } else {
                let profesor = null
                resolve(profesor)
              }
        }).catch(err => logger.error(err))
      })
    },
    crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      return new Promise((resolve) => {
        let pregunta = new PreguntaEstudiante({ texto, paralelo: paraleloId, 'creador': { _id, correo, nombres, apellidos } })
        pregunta.crear()
          .then(preguntaCreda => {
            Promise.all([
              Estudiante.anadirPregunta({ correo, preguntaId: pregunta['_id'] }),
              Paralelo.anadirPreguntaEstudiante({ paraleloId, preguntaId: pregunta['_id'] })])
                .then((values) => {
                  resolve(pregunta)
              }).catch(err => logger.error(err))
        }).catch(err => logger.error(err))
      })
    },
    destacarPregunta({ preguntaId, destacadaEstado }) {
      return new Promise((resolve) => {
        PreguntaEstudiante.destacar({ preguntaId, destacadaEstado })
          .then((resp) => {
            resolve(resp)
        }).catch(err => logger.error(err))
      })
    },
    obtenerPreguntasEstudiantesPorParalelo({ paraleloId }) {
      return new Promise((resolve) => {
        PreguntaEstudiante.obtenerPorParaleloHoy({ paraleloId })
          .then((preguntas) => {
            resolve(preguntas)
        }).catch(err => logger.error(err))
      })
    },
    // crearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {

    // },
    // crearRespuestaEstudiante({ text, preguntaId, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {

    // }
  }
  return Object.assign(Object.create(proto), {})
}