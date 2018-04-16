// let paralelos = require('./dump/paralelos.json')
// let profesores = require('./dump/profesores.json')
// let estudiantes = require('./dump/estudiantes.json')

let db = require('../api/config/db')
let logger = require('../api/config/logger')
let messages = require('../api/config/messages')

const paralelo = {
  "codigo": "FISG1002",
  "nombre": "FÍSICA II",
  "curso": "1",
  "anio": "2017",
  "termino": "2"
}

const estudiantes = [
  {
    "nombres": "JOEL EDUARDO",
    "apellidos": "RODRIGUEZ LLAMUCA",
    "matricula": "201305380",
    "correo": "joeedrod@espol.edu.ec"
  },
  {
    "nombres": "EDISON",
    "apellidos": "MORA",
    "matricula": "201005380",
    "correo": "edanmora@espol.edu.ec"
  }
]

const profesores = [
  {
    "nombres": "FLORENCIO",
    "apellidos": "PINELA",
    "correo": "fpinela@espol.edu.ec",
    "tipo": "titular"
  }
]
db.Conectar(`mongodb://localhost/att_${process.env.NODE_ENV}`).then(() => {
  let model = require('../api/config/models')
  let modelDB = require('../api/api.model')
  let modelMongo = modelDB({ db: model, logger, messages })
  async function iniciar() {
    try {
      await modelMongo.crearEstudiante(estudiantes[0])
      await modelMongo.crearEstudiante(estudiantes[1])
      await modelMongo.crearParalelo(paralelo)
      await modelMongo.crearProfesor(profesores[0])
      await modelMongo.anadirEstudianteAParalelo({ paralelo, estudianteCorreo: estudiantes[0]['correo']})
      await modelMongo.anadirEstudianteAParalelo({ paralelo, estudianteCorreo: estudiantes[1]['correo']})
      await modelMongo.anadirProfesorAParalelo({ paralelo, profesorCorreo: profesores[0]['correo']})
    } catch(err) {
      console.error(err)
    }
  }
  iniciar()
})
