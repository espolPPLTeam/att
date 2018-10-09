let mongoose = {}
let db = {}
if (process.env.NODE_ENV === 'production' && process.env.SERVIDOR === 'heroku') {
  mongoose = require('mongoose')
  db = require('mongoose')
} else if (process.env.NODE_ENV) {
  db = require('./db').getDatabaseConnection()
  mongoose = require('mongoose')
}

const shortid = require('shortid')
const moment = require('moment')
const validators = require('./validators')
mongoose.Promise = global.Promise

const EstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': shortid.generate
  },
  nombres: {
    type: String,
    required: [true, 'El campo "Nombres" es obligatorio'],
    validate: [
      { validator: validators.noSpecialChars, msg: 'El campo "Nombres" no acepta caracteres especiales' },
      { validator: validators.notEmpty, msg: 'El campo "Nombres" no puede estar vacío' }
    ]
  },
  apellidos: {
    type: String,
    required: [true, 'El campo "Apellidos" es obligatorio'],
    validate: [
      { validator: validators.noSpecialChars, msg: 'El campo "Apellidos" no acepta caracteres especiales' },
      { validator: validators.notEmpty, msg: 'El campo "Apellidos" no puede estar vacío' }
    ]
  },
  carrera: {
    type: String,
    validate: [
      { validator: validators.noSpecialChars, msg: 'El campo "Carrera" no acepta caracteres especiales' },
      { validator: validators.notEmpty, msg: 'El campo "Carrera" no puede estar vacío' }
    ]
  },
  matricula: {
    type: String,
    validate: [
      { validator: validators.noSpecialChars, msg: 'El campo "Matrícula" no acepta caracteres especiales' },
      { validator: validators.notEmpty, msg: 'El campo "Matrícula" no puede estar vacío' }
    ]
  },
  email: {
    type: String,
    required: [true, 'El campo "Email" es obligatorio'],
    unique: true,
     validate: [
      { validator: validators.notEmpty, msg: 'El campo "Email" no puede estar vacío' },
      { validator: validators.validEmail, msg: 'Email inválido' }
    ]
  },
  clave: {
    type: String,
    required: [true, 'El campo "Clave" es obligatorio']
  },
  lecciones: [],
  paralelos: [
    {
      type: String,
      ref: 'Paralelos'
    }
  ],
  grupos: [],
  estado: {
    type: String,
    'default': 'activo',
    enum: {
      values: ['activo', 'inactivo'],
      message: 'El campo "Estado" solo puede ser "activo" o "inactivo"'
    }
  },
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
  email: { type: String, required: true },
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
  termino: { type: String, enum: ['1s', '2s'], required: true },
  preguntaActual: { // mostrara la pregunta que actualmente el profesor habilito para que los estudiante respondan, si se quiere desabilitar debe estar vacio ''
    type: String,
    ref: 'PreguntaProfesor',
    'default': ''
  },
  profesores: [{
    type: String,
    ref: 'Profesor',
    field: 'correo'
  }],
  estudiantes: [{
    type: String,
    field: 'correo',
    ref: 'Estudiante'
  }],
  preguntasProfesor: [{
    type: String,
    ref: 'PreguntaProfesor'
  }],
  preguntasEstudiante: [{
    type: String,
    ref: 'PreguntaEstudiante'
  }]
}, {timestamps: false, versionKey: false, collection: 'paralelos', toJSON: { virtuals: true } })

const PreguntaEstudianteSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  creador: {
    matricula: { type: String },
    email: { type: String },
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
  },
  calificacion: {
    type: Number,
    'default': 0
  }
},{timestamps: true, versionKey: false, collection: 'preguntasEstudianteATT', toJSON: { virtuals: true }})

const PreguntaProfesorSchema = mongoose.Schema({ // con la diferencia de createdAt y updateAt podemos sacar el timepo que se habilito la pregunta
  _id: {
    type: String,
	  'default': shortid.generate
  },
  texto: { type: String },
  habilitada: {
    type: Boolean,
    'default': true
  },
  creador: {
    email: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    tipo: {
      type: String,
      enum: ['titular', 'peer']
    }
  },
  terminadoPor: {
    email: { type: String },
    nombres: { type: String },
    apellidos: { type: String },
    tipo: {
      type: String,
      enum: ['titular', 'peer', 'admin']
    }
  },
  paraleloId: {
    type: String,
    ref: 'Paralelo'
  },
  numeroEstudiantesPresentes: { type: Number },
  respuestas: [{
  	type: String,
	  ref: 'Respuesta',
  }]
},{timestamps: true, versionKey: false, collection: 'preguntasProfesoresATT', toJSON: { virtuals: true }})

const RespuestaSchema = mongoose.Schema({
  _id: {
    type: String,
	  'default': shortid.generate
  },
  texto: { type: String },
  creador: {
    email: { type: String },
    nombres: { type: String },
    apellidos: { type: String }
  },
  destacada: {
    type: Boolean,
    'default': false
  },
  paraleloId: {
    type: String,
    ref: 'Paralelo'
  },
  preguntaId: {
    type: String,
    ref: 'PreguntaProfesor'
  },
  calificacion: {
    type: Number,
    'default': 0
  }
},{timestamps: true, versionKey: false, collection: 'respuestasATT'})

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

PreguntaProfesorSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

RespuestaSchema.methods = {
  crear() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.save())
    })
  }
}

EstudianteSchema.statics = {
  obtenerPorId({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: paraleloId }))
    })
  },
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
  anadirPregunta({ email, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ email }, {$addToSet: {'preguntas': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  obtenerPorCorreo({ email }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ email }))
    })
  },
  anadirRespuesta({ matricula, respuestaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ matricula }, {$addToSet: { 'respuestas': respuestaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  cambiarCorreo({ correo, correoNuevo }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ correo }, {$set: { correo: correoNuevo }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  cambiarNombres({ correo, nombres }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ correo }, {$set: { nombres }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  cambiarApellidos({ correo, apellidos }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ correo }, {$set: { apellidos }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  }
}

const Estudiante = db.model('Estudiante', EstudianteSchema)

ProfesorSchema.statics = {
  obtenerPorCorreo({ correo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ email: correo }))
    })
  },
  anadirPregunta({ email, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ email }, {$addToSet: {'preguntas': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
}

ParaleloSchema.virtual('id').get(function(){
    return this._id
})

// ParaleloSchema.options.toJSON = {
//   transform: function(doc, ret) {
//     ret.id = ret._id
//     delete ret._id
//     delete ret.__v
//   }
// }

ParaleloSchema.statics = {
  obtenerPorId({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: paraleloId }))
    })
  },
  obtenerPorIdPopulate({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: paraleloId })
      .populate(
        {
          path: 'preguntasProfesor',
          select: 'texto createdAt id'
        }
      )
      .populate(
        {
          path: 'preguntasEstudiante'
        }
      )
      .select('preguntasProfesor preguntasEstudiante -_id'))
    })
  },
  obtenerTodosPopulateEstudiantes() {
    let self = this
    return new Promise(function(resolve) {
      resolve(self.aggregate([
        { "$unwind": "$estudiantes" },
        { "$lookup":
          {
            "from": "estudiantes",
            "localField": "estudiantes",
            "foreignField": "correo",
            "as": "members",
          },
        },
        { "$unwind": "$members" },
        { "$group": {
          "_id": "$_id",
          "curso": { "$first": "$curso" },
          "codigo": { "$first": "$codigo" },
          "estudiantes": { "$push": "$estudiantes" },
          "members": { "$push": "$members" }
        }},
      ]
      ))
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
  obtenerParalelosProfesorPorId({ id }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({ profesores: id }))
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
  },
  anadirPreguntaProfesor({ paraleloId, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: paraleloId }, {$addToSet: {'preguntasProfesor': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  anadirPreguntaActual({ paraleloId, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: paraleloId }, {$set: { 'preguntaActual': preguntaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  PreguntaActualLimpiar() {
    const self = this
    return new Promise(function(resolve) {
      self.updateMany({ }, {$set: { 'preguntaActual': null }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  obtenerPreguntaHabilitada({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({_id: paraleloId}).populate({
        path: 'preguntaActual',
        populate: { path: 'respuestas' }
      }))
    })
  }
}
const Paralelo = db.model('Paralelo', ParaleloSchema)

PreguntaEstudianteSchema.virtual('id').get(function(){
    return this._id
})

PreguntaEstudianteSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
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
  },
  obtenerPreguntasPorDia({ dia, paraleloId }) {
    let start = moment(`${dia}`, 'YYYY-MM-DD', true).startOf('day')
    let end = moment(`${dia}`, 'YYYY-MM-DD', true).endOf('day')
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({$and: [{createdAt: {$gte: start, $lt: end }}, { paralelo: paraleloId }]}).select(' creador calificacion texto createdAt'))
    })
  },
  calificar({ preguntaId, calificacion }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: preguntaId }, {$set: { calificacion }})
      .then((accionEstado) => {
          resolve(accionEstado.nModified ? true : false)
      })
    })
  }
}

const PreguntaEstudiante = db.model('PreguntaEstudiante', PreguntaEstudianteSchema)

PreguntaProfesorSchema.virtual('id').get(function(){
    return this._id
})

PreguntaProfesorSchema.options.toJSON = {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
}

PreguntaProfesorSchema.statics = {
  obtenerPorId({ _id }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id }))
    })
  },
  obtenerPorIdPopulate({ id }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id: id }).populate(' respuestas '))
    })
  },
  obtenerTodos() {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({}))
    })
  },
  anadirRespuesta({ preguntaId, respuestaId }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: preguntaId }, {$addToSet: {'respuestas': respuestaId }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  terminar({ preguntaId, terminadoPor: { correo, nombres, apellidos, tipo } }) {
    const self = this
    let profesorQueLaTermino = { correo, nombres, apellidos, tipo }
    return new Promise(function(resolve) {
      self.update({ _id: preguntaId }, {$set: { habilitada: false, terminadoPor: profesorQueLaTermino }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  terminarTodas() {
    const self = this
    let profesorQueLaTermino = { correo: 'joelerll@gmail.com', nombres: 'Joel', apellidos: 'Rodriguez', tipo: 'admin' }
    return new Promise(function(resolve) {
      self.updateMany({ }, {$set: { habilitada: false, terminadoPor: profesorQueLaTermino }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  obtenerPreguntasProfesorHoy({ paraleloId }) {
    let start = moment().startOf('day')
    let end = moment().endOf('day')
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({$and: [{ paraleloId }, {createdAt: {$gte: start, $lt: end } }]}))
    })
  }
}

RespuestaSchema.statics = {
  obtenerPorId({ _id }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ _id }))
    })
  },
  destacar({ respuestaId, destacadaEstado }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: respuestaId }, {$set: { destacada: destacadaEstado }}).then((accionEstado) => {
        resolve(accionEstado.nModified ? true : false)
      })
    })
  },
  obtenerPorPreguntaId({ preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.find({ preguntaId }))
    })
  },
  obtenerRespuestaCreador({ correo, preguntaId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({$and: [{ 'creador.correo': correo }, { preguntaId }]}))
    })
  },
  calificar({ respuestaId, calificacion }) {
    const self = this
    return new Promise(function(resolve) {
      self.update({ _id: respuestaId }, {$set: { calificacion }})
      .then((accionEstado) => {
          resolve(accionEstado.nModified ? true : false)
      })
    })
  }
}

// TODO: todos los que mande a update tienen que tener confirmacion de actualizacion

module.exports = {
  Estudiante,
  PreguntaEstudiante,
  Profesor: db.model('Profesor', ProfesorSchema),
  PreguntaProfesor: db.model('PreguntaProfesor', PreguntaProfesorSchema),
  Respuesta: db.model('Respuesta', RespuestaSchema),
  Paralelo
}
