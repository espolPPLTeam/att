module.exports = ({ mongoSchema, logger }) => {
  let PreguntaEstudiante = mongoSchema.PreguntaEstudiante
  const proto = {
    obtenerDatosEstudiante({ usuario }) {
      
    },
    obtenerDatosProfesor({ usuario }) {
      
    },
    crearPreguntaEstudiante({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {
      return new Promise(function(resolve, reject) {
        let pregunta = new PreguntaEstudiante({ texto, paralelo: paraleloId, 'creador': { _id, correo, nombres, apellidos } })
        pregunta.crearPreguntaEstudiante().then(preguntaCreda => {
            resolve(true)
          })
          .catch(err => logger.error(err))
      })
    },
    crearPreguntaProfesorYHabilitarla({ texto, paraleloId, creador: { _id, correo, matricula, nombres, apellidos } }) {

    },
    crearRespuestaEstudiante({ text, preguntaId, paraleloId, creador: { _id, correo, matricula, nombres, apellidos }}) {

    },
    obtenerPreguntasEstudiantesPorParalelo({ paraleloId }) {

    },
    obtenerPreguntasProfesorPorParalelo({ paraleloId }) {

    },
    obtenerHistorialPreguntaEstudiante({ paraleloId }) {

    },
    obtenerPreguntasEstudiantes({ preguntaId }) {

    },
    obtenerHistorialPreguntasProfesor({ paraleloId }) {

    },
    obtenerPreguntasProfesor({ preguntaId }) {

    }
  }
  return Object.assign(Object.create(proto), {})
}