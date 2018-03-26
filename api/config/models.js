const mongoose = require('mongoose')
const shortid = require('shortid')
const moment = require('moment')
mongoose.Promise = global.Promise

const EstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  token: { type: String },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo: { type: String, required: true },
  matricula: { type: String, required: true },
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
  correo: { type: String, required: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['titular', 'peer'],
    required: true
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
  codigo: { type: String, required: true }, // TODO> tiene que ser un enum
  nombre: { type: String, required: true },
  curso: { type: String, required: true },
  anio: { type: String, required: true },
  termino: { type: String, enum: ['1', '2'], required: true },
  habilitado: {
    type: Boolean,
    'default': false
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
    return Promise.resolve(self.save())
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
      self.findOneAndRemove({ correo: estudianteCorreo }).then((accionEstado) => {
        if (accionEstado) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  anadirPregunta({ correo, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ correo }, {$addToSet: {'preguntas': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
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
  obtenerPorCursoYCodigo({ curso, codigo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ curso, codigo }))
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
      self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'estudiantes': estudianteCorreo }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  anadirProfesor({ paralelo: { curso, codigo }, profesorCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({$and: [{ codigo }, { curso }]}, {$addToSet: {'profesores': profesorCorreo }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  eliminarEstudiante({ paralelo: { curso, codigo }, estudianteCorreo }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({$and: [{ codigo }, { curso }]}, {$pull: {'estudiantes': estudianteCorreo }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  anadirPreguntaEstudiante({ paraleloId, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: paraleloId }, {$addToSet: {'preguntasEstudiante': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
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
  // TODO: testear que acepte solo las del dia de hoy
  obtenerPorParaleloHoy({ paraleloId }) {
    let start = moment().startOf('day')
    let end = moment().endOf('day')
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({$and: [{ paralelo: paraleloId }, {createdAt: {$gte: start, $lt: end } }]}))
    })
  },
  destacar({ preguntaId, destacadaEstado }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: preguntaId }, {$set: { destacada: destacadaEstado }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  obtenerPreguntasPorCorreo({ correo }) {
    let start = moment().startOf('day')
    let end = moment().endOf('day')
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({$and: [{ 'creador.correo': correo }, {createdAt: {$gte: start, $lt: end } }]}, { _id: 0 }).select(' texto createdAt'))
    })
  }
}

// TODO: todos los que mande a update tienen que tener confirmacion de actualizacion

module.exports = {
  Estudiante: mongoose.model('Estudiante', EstudianteSchema),
  PreguntaEstudiante: mongoose.model('PreguntaEstudiante', PreguntaEstudianteSchema),
  Profesor: mongoose.model('Profesor', ProfesorSchema),
  PreguntaProfesor: mongoose.model('PreguntaProfesor', PreguntaProfesorSchema),
  Respuesta: mongoose.model('Respuesta', RespuestaSchema),
  Paralelo: mongoose.model('Paralelo', ParaleloSchema)
}
