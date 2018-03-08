const mongoose = require('mongoose')
const shortid = require('shortid')
mongoose.Promise = global.Promise

const EstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  token: { type: String },
  nombres: { type: String },
  apellidos: { type: String },
  correo: { type: String },
  matricula: { type: String },
  preguntas:  [{ 
  	type: String,
	  ref: 'Pregunta'
  }],
  respuestas:  [{ 
  	type: String,
	  ref: 'Respuesta'
  }]
},{timestamps: false, versionKey: false, collection: 'estudiantes'})

const ProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  token: { type: String },
  correo: { type: String },
  nombres: { type: String },
  apellidos: { type: String },
  tipo: {
    type: String,
    enum: ['titular', 'peer']
  },
  preguntas:  [{ 
    type: String,
    ref: 'Pregunta'
  }]
},{timestamps: false, versionKey: false, collection: 'profesores'})

const ParaleloSchema = new mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  codigo: { type: String },
  nombre: { type: String },
  nombreMateria: { type: String },
  anio: { type: String },
  termino: { type: String, enum: ['1', '2'] },
  hablitado: {
    type: Boolean,
    'default': true
  },
  profesores: [{
    type: String,
    ref: 'Profesor',
    field: 'correo' 
  }],
  estudiantes: [{
    type: String,
    ref: 'Estudiante',
    field: 'correo'
  }],
  preguntasProfesor: [{
    type: String,
    ref: 'PreguntaProfesor'
  }],
  preguntasEstudiante: [{
    type: String,
    ref: 'PreguntaEstudiante'
  }]
}, {timestamps: false, versionKey: false, collection: 'paralelos'})

const PreguntaEstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  creador: {
    _id: { type: String },
    correo: { type: String },
    nombres: { type: String },
    apellidos: { type: String }
  },
  texto: { type: String },
  paralelo: { 
    type: String,
    ref: 'Paralelo'
  }
},{timestamps: true, versionKey: false, collection: 'preguntasEstudiante'})

const PreguntaProfesorSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  texto: { type: String },
  hablitado: {
    type: Boolean,
    'default': true
  },
  creador: {
    _id: { type: String },
    correo: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    tipo: {
      type: String,
      enum: ['titular', 'peer']
    }
  },
  numeroEstudiantesPresentes: { type: Number },
  respuestas: [{ 
  	type: String,
	  ref: 'Respuesta',
  }]
},{timestamps: true, versionKey: false, collection: 'preguntasProfesores'})

const RespuestaSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  texto: { type: String },
  creador: {
    _id: { type: String },
    correo: { type: String },
    nombres: { type: String },
    apellidos: { type: String }
  }
},{timestamps: true, versionKey: false, collection: 'respuestas'})


// ESTUDIANTES
EstudianteSchema.methods.crearEstudiante = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

EstudianteSchema.statics.obtenerEstudiantePorCorreo = function({ correo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ correo }))
  })
}

// PROFESORES
ProfesorSchema.methods.crearProfesor = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

ProfesorSchema.statics.obtenerProfesorPorCorreo = function({ correo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ correo }))
  })
}


// PARALELOS
ParaleloSchema.statics.obtenerParaleloEstudiante = function({ estudianteId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ _id: estudianteId }))
  })
}

// PREGUNTA  ESTUDIANTE
PreguntaEstudianteSchema.statics.ObtenerPreguntaEstudiantePorId = function({ preguntaId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ _id: preguntaId }))
  })
}

PreguntaEstudianteSchema.statics.ObtenerPreguntasEstudiantesPorParalelo = function({ paraleloId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.find({ paralelo: paraleloId }))
  })
}

PreguntaEstudianteSchema.methods.crearPreguntaEstudiante = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}



module.exports = { 
  Estudiante: mongoose.model('Estudiante', EstudianteSchema),
  PreguntaEstudiante: mongoose.model('PreguntaEstudiante', PreguntaEstudianteSchema),
  Profesor: mongoose.model('Profesor', ProfesorSchema),
  PreguntaProfesor: mongoose.model('PreguntaProfesor', PreguntaProfesorSchema),
  Respuesta: mongoose.model('Respuesta', RespuestaSchema),
  Paralelo: mongoose.model('Paralelo', ParaleloSchema)
}