let db = require('../../api/config/db')
let logger = require('../../api/config/logger')
let messages = require('../../api/config/messages')


const paralelos = require('./dump/paralelos.json')
const profesores = require('./dump/profesores.json')
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

db.Conectar(`mongodb://localhost/att_${process.env.NODE_ENV}`)
  .then(() => {
    let model = require('../../api/config/models')
    let modelDB = require('../../api/api.model')
    let modelMongo = modelDB({ db: model, logger, messages })
    async function iniciar() {
      try {
        await db.Limpiar()
        // Creo los paralelos
        for (let i = 0; i < paralelos.length; i++) {
          await modelMongo.crearParalelo(paralelos[i])
        }
        // Joel se queda como estudiante de F2 P1        
        await modelMongo.crearEstudiante(estudiantes[0])
        await modelMongo.anadirEstudianteAParalelo({ paralelo: paralelos[0], estudianteCorreo: estudiantes[0]['correo']})
        // Los profesores se quedan como estudiantes de F2 P1
        for (let j = 0; j < profesores.length; j++) {
          let matriculaProfe = 201304600 + j  
          const prof = profesores[j]
          await modelMongo.crearEstudiante(
            {
              nombres: prof.nombres,
              apellidos: prof.apellidos,
              correo: prof.correo,
              matricula: matriculaProfe.toString()
            }
          )
          await modelMongo.anadirEstudianteAParalelo({ paralelo: paralelos[0], estudianteCorreo: prof.correo })
        }
        // Edison se queda como profesor de F2P1
        await modelMongo.crearProfesor({
          nombres: estudiantes[1].nombres,
          apellidos: estudiantes[1].apellidos,
          correo: estudiantes[1].correo,
          tipo: 'titular'
        })
        await modelMongo.anadirProfesorAParalelo({ paralelo: paralelos[0], profesorCorreo: estudiantes[1]['correo']})
        console.log('Terminado')
        db.Desconectar()
      } catch(err) {
        console.error(err)
      }
    }
    iniciar()
  })
