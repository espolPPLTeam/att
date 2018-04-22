const co = require('co')
const model = require('../api/api.model')
const messages = require('../api/config/messages')
const logger = require('../api/config/logger')
const db = require('../api/config//models')
const Model = model({ db, logger, messages })

module.exports = {
  crearEstudiante({ nombres, apellidos, correo, matricula, paralelo,  codigoMateria }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        yield Model.crearEstudiante({ correo, matricula, nombres, apellidos })
        yield Model.anadirEstudianteAParalelo({ paralelo: { curso: paralelo, codigo: codigoMateria }, estudianteCorreo: correo })
        resolve(true)
      })

    })
  },
  crearProfesor({ nombres, apellidos, correo, tipo, paralelo, codigoMateria }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let profesor = yield db.Profesor.obtenerPorCorreo({ correo })
        if (!profesor) {
          yield Model.crearProfesor({ correo, tipo, nombres, apellidos })
          yield Model.anadirProfesorAParalelo({ paralelo: { curso: paralelo, codigo: codigoMateria }, profesorCorreo: correo })
        } else {
          yield Model.anadirProfesorAParalelo({ paralelo: { curso: paralelo, codigo: codigoMateria }, profesorCorreo: correo })
        }
        resolve(true)
      })

    })
  },
  crearParalelo({ codigoMateria, nombreMateria, paralelo, termino, anio }) {
    return new Promise(function(resolve, reject) {
      Model.crearParalelo({ codigo: codigoMateria, nombre: nombreMateria, curso: paralelo, termino, anio }).then(() => {
        resolve(true)
      })
    })
  },
  eliminarEstudiante({ paralelo, codigoMateria, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      Model.eliminarEstudiante({ paralelo: { curso: paralelo, codigo: codigoMateria }, estudianteCorreo: correo })
      resolve(true)
    })
  },
  cambiarEstudianteParalelo({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let paralelo = yield db.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: correo })
        let codigoNuevo = paralelo['codigo']
        let cursoAntiguo = paralelo['curso']
        let codigoAntiguo = codigoNuevo
       yield Model.cambiarEstudianteDeParalelo({
                  paraleloNuevo: { cursoNuevo: nuevo, codigoNuevo },
                  paraleloAntiguo: { cursoAntiguo, codigoAntiguo },
                  estudianteCorreo: correo })
        resolve(true)
      })
    })
  },
  cambiarCorreoEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let paralelo = yield db.Paralelo.obtenerParaleloEstudiante({ estudianteCorreo: correo })
        let codigo = paralelo['codigo']
        let curso = paralelo['curso']
        yield db.Paralelo.eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo: correo })
        yield db.Estudiante.cambiarCorreo({ correo, correoNuevo: nuevo })
        yield db.Paralelo.anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo: nuevo })
        resolve(true)
      })
    })
  },
  cambiarNombresEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      db.Estudiante.cambiarNombres({ correo, nombres: nuevo }).then((resp) => {
        resolve(true)
      })
    })
  },
  cambiarApellidosEstudiante({ nuevo, correo, matricula }) {
    return new Promise(function(resolve, reject) {
      db.Estudiante.cambiarApellidos({ correo, apellidos: nuevo }).then((resp) => {
        resolve(true)
      })
    })
  },
  estaLleno() {
    return new Promise(function(resolve, reject) {
      db.Paralelo.obtenerTodosPopulateEstudiantes().then((paralelos) => {
        if (paralelos.length !== 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  obtenerTodosEstudiantes() {
    return new Promise(function(resolve, reject) {
      co(function* () {
        let paralelos = yield db.Paralelo.obtenerTodosPopulateEstudiantes()
        let estudiantesDatos = []
        for (paralelo of paralelos) {
          for (estudiante of paralelo.members) {
            estudiantesDatos.push({
              nombres: estudiante['nombres'],
              apellidos: estudiante['apellidos'],
              matricula: estudiante['matricula'],
              correo: estudiante['correo'],
              paralelo: paralelo['curso'],
              codigoMateria: paralelo['codigo']
            })
          }
        }
        resolve(estudiantesDatos)
      })
    })
  }
}
