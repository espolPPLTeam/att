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
  codigo: { type: String }, // TODO> tiene que ser un enum
  nombre: { type: String },
  curso: { type: String },
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
EstudianteSchema.methods.crear = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

EstudianteSchema.statics.eliminar = function({ estudianteCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOneAndRemove({ correo: estudianteCorreo }))
  })
}

EstudianteSchema.statics.obtenerPorCorreo = function({ correo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ correo }))
  })
}

// PROFESORES
ProfesorSchema.methods.crear = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

ProfesorSchema.statics.obtenerPorCorreo = function({ correo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ correo }))
  })
}


// PARALELOS
ParaleloSchema.methods.crear = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

ParaleloSchema.statics.obtenerPorId = function({ paraleloId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ _id: paraleloId }))
  })
}

ParaleloSchema.statics.obtenerParaleloEstudiante = function({ estudianteCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ estudiantes: estudianteCorreo }))
  })
}

ParaleloSchema.statics.obtenerParaleloProfesor = function({ profesorCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ profesores: profesorCorreo }))
  })
}

ParaleloSchema.statics.anadirEstudiante = function({ paralelo: { curso, codigo }, estudianteCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'estudiantes': estudianteCorreo }}))
  })
}

ParaleloSchema.statics.anadirProfesor = function({ paralelo: { curso, codigo }, profesorCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'profesores': profesorCorreo }}))
  })
}

ParaleloSchema.statics.eliminarEstudiante = function({ paralelo: { curso, codigo }, estudianteCorreo }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOneAndUpdate({$and: [{ codigo }, { curso }]}, {$pull: {'estudiantes': estudianteCorreo }}))
  })
}

// PREGUNTA  ESTUDIANTE
PreguntaEstudianteSchema.methods.crear = function() {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

PreguntaEstudianteSchema.statics.obtenerPorId = function({ preguntaId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.findOne({ _id: preguntaId }))
  })
}

PreguntaEstudianteSchema.statics.obtenerPorParalelo = function({ paraleloId }) {
  const self = this
  return new Promise(function(resolve) {
    resolve(self.find({ paralelo: paraleloId }))
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