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
  },
  destacada: {
    type: Boolean,
    'default': false
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
  },
  destacada: {
    type: Boolean,
    'default': false
  }
},{timestamps: true, versionKey: false, collection: 'respuestas'})

EstudianteSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

ParaleloSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

ProfesorSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

PreguntaEstudianteSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

EstudianteSchema.statics = {
  eliminar({ estudianteCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOneAndRemove({ correo: estudianteCorreo }))
    })
  },
  anadirPregunta({ correo, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOneAndUpdate({ correo }, {$addToSet: {'preguntas': preguntaId }}))
    })
  },
  obtenerPorCorreo({ correo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ correo }))
    })
  }
}

ProfesorSchema.statics = {
  obtenerPorCorreo({ correo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ correo }))
    })
  }
}

ParaleloSchema.statics = {
  obtenerPorId({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: paraleloId }))
    })
  },
  obtenerParaleloEstudiante({ estudianteCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ estudiantes: estudianteCorreo }))
    })
  },
  obtenerParalelosProfesor({ profesorCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({ profesores: profesorCorreo }))
    })
  },
  anadirEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'estudiantes': estudianteCorreo }}))
    })
  },
  anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'profesores': profesorCorreo }}))
    })
  },
    eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOneAndUpdate({$and: [{ codigo }, { curso }]}, {$pull: {'estudiantes': estudianteCorreo }}))
    })
  },
  anadirPreguntaEstudiante({ paraleloId, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOneAndUpdate({ _id: paraleloId }, {$addToSet: {'preguntasEstudiante': preguntaId }}))
    })
  }
}

PreguntaEstudianteSchema.statics = {
  obtenerPorId({ preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: preguntaId }))
    })
  },
  obtenerPorParalelo({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({ paralelo: paraleloId }))
    })
  },
  destacar({ preguntaId, descatadaEstado }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.update({ _id: preguntaId }, {$set: { destacada: descatadaEstado }}))
    })
  }
}

module.exports = { 
  Estudiante: mongoose.model('Estudiante', EstudianteSchema),
  PreguntaEstudiante: mongoose.model('PreguntaEstudiante', PreguntaEstudianteSchema),
  Profesor: mongoose.model('Profesor', ProfesorSchema),
  PreguntaProfesor: mongoose.model('PreguntaProfesor', PreguntaProfesorSchema),
  Respuesta: mongoose.model('Respuesta', RespuestaSchema),
  Paralelo: mongoose.model('Paralelo', ParaleloSchema)
}