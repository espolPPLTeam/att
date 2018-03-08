module.exports = ({ db, logger }) => {
  let PreguntaEstudiante = db.PreguntaEstudiante
  let Estudiante = db.Estudiante
  let Profesor = db.Profesor
  let Paralelo = db.Paralelo
  const proto = {
    crearParalelo({ codigo, nombre, curso, termino, anio }) {
      return new Promise(function(resolve, reject) {
        let paraleloCreado = new Paralelo({ codigo, nombre, curso, termino, anio })
        paraleloCreado.crear()
          .then(() => {
            resolve(paraleloCreado)
          }).catch(err => logger.error(err))
      })
    },
    anadirEstudianteAParalelo({ paralelo: { curso, codigo }, estudianteCorreo }) {
      return new Promise(function(resolve, reject) {
        Paralelo.anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          .then(() => {
            resolve(true)
          }).catch(err => logger.error(err))
      })
    },
    anadirProfesorAParalelo({ paralelo: { curso, codigo }, profesorCorreo }) {
      return new Promise(function(resolve, reject) {
        Paralelo.anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo })
          .then(() => {
            resolve(true)
          }).catch(err => logger.error(err))
      })
    },
    eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
      return new Promise(function(resolve, reject) {
        Promise.all([
          Estudiante.eliminar({ estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo })
          ]).then((values) => {
            resolve(true)
        }).catch(err => logger.error(err))
      }).catch(err => logger.error(err))
    },
    cambiarEstudianteDeParalelo({ paraleloNuevo: { cursoNuevo, codigoNuevo }, paraleloAntiguo: { cursoAntiguo, codigoAntiguo }, estudianteCorreo }) {
      return new Promise(function(resolve, reject) {
        Promise.all([
          Paralelo.anadirEstudiante({ paralelo: { curso: cursoNuevo, codigo: codigoNuevo }, estudianteCorreo }),
          Paralelo.eliminarEstudiante({ paralelo: { curso: cursoAntiguo, codigo: codigoAntiguo }, estudianteCorreo })
          ]).then((values) => {
            resolve(true)
        }).catch(err => logger.error(err))
      }).catch(err => logger.error(err))
    },
    crearEstudiante({ correo, matricula, nombres, apellidos }) {
      return new Promise(function(resolve, reject) {
        let estudiante = new Estudiante({ correo, matricula, nombres, apellidos })
        estudiante.crear()
          .then(() => {
            resolve(estudiante)
          }).catch(err => logger.error(err))
      })
    },
    crearProfesor({ correo, tipo, nombres, apellidos }) {
      return new Promise(function(resolve, reject) {
        let profesor = new Profesor({ correo, tipo, nombres, apellidos })
        profesor.crear()
          .then(() => {
            resolve(profesor)
          }).catch(err => logger.error(err))
      })
    },
    obtenerDatosEstudiantePorCorreo({ correo }) {
      // FIXME: test
      // TODO: enviar datos del paralelo
      return new Promise(function(resolve, reject) {
        Estudiante.obtenerPorCorreo({ correo })
          .then(estudiante => {
            resolve(estudiante)
          }).catch(err => logger.error(err))
      })
    },
    obtenerDatosProfesorPorCorreo({ correo }) {
      // FIXME: test
      // TODO: enviar los paralelos
      // TODO: como hacer cuando el profesor tenga mas de un paralelo?
      return new Promise(function(resolve, reject) {
        Profesor.obtenerPorCorreo({ correo })
          .then(estudiante => {
            resolve(estudiante)
          }).catch(err => logger.error(err))
      })
    },
    crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      // TODO: anadir a estudiante la lista de preguntas y a las preguntas de paralelo
      return new Promise(function(resolve, reject) {
        let pregunta = new PreguntaEstudiante({ texto, paralelo: paraleloId, 'creador': { _id, correo, nombres, apellidos } })
        pregunta.crear()
          .then(preguntaCreda => {
            resolve(pregunta)
          }).catch(err => logger.error(err))
      })
    },
    obtenerPreguntasEstudiantesPorParalelo({ paraleloId }) {
      return new Promise(function(resolve, reject) {
        PreguntaEstudiante.obtenerPorParalelo({ paraleloId })
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