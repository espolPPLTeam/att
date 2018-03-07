const mongoose = require('mongoose')
const shortid = require('shortid')
mongoose.Promise = global.Promise

const EstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  unique: true,
	  'default': shortid.generate
  },
  preguntas:  [{ 
  	type: String,
	  ref: 'Pregunta',
  }]
  respuestas:  [{ 
  	type: String,
	  ref: 'Respuesta',
  }]
},{timestamps: false, versionKey: false, collection: 'estudiantes'})

const ProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
	  unique: true,
	  'default': shortid.generate
  },
},{timestamps: false, versionKey: false, collection: 'profesores'})

const PreguntaEstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  unique: true,
	  'default': shortid.generate
  },
},{timestamps: true, versionKey: false, collection: 'preguntasEstudiante'})

const PreguntaProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
	  unique: true,
	  'default': shortid.generate
  },
  respuestas: [{ 
  	type: String,
	  ref: 'Respuesta',
  }]
},{timestamps: true, versionKey: false, collection: 'preguntasProfesores'})

const RespuestaSchema = mongoose.Schema({
  _id: {
    type: String,
	  unique: true,
	  'default': shortid.generate
  },
},{timestamps: true, versionKey: false, collection: 'respuestas'})

module.exports = { 
  Estudiante: mongoose.model('Estudiante', EstudianteSchema),
  PreguntaEstudiante: mongoose.model('PreguntaEstudiante', PreguntaEstudianteSchema),
  Profesor: mongoose.model('Profesor', ProfesorSchema),
  PreguntaProfesor: mongoose.model('PreguntaProfesor', PreguntaProfesorSchema),
  Respuesta: mongoose.model('Respuesta', RespuestaSchema)
}