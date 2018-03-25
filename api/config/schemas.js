// http://json-schema.org/example2.html

// /api/att/profesor/paralelos/:profesorCorreo
const PROFESOR_DATOS__PARALELOS = {
  "minProperties": 4,
  "additionalProperties": false,
  "properties": {
    "_id": { "type": "string" },
    "codigo": { "type": "string" },
    "curso": { "type": "string" },
    "nombre": { "type": "string" }
  }
}

const PROFESOR_DATOS = {
  "minProperties": 5,
  "additionalProperties": false,
  "properties": {
    "correo": {
      "type": "string",
      "format": "email"
    },
    "tipo": { 
      "type": "string" ,
      "enum": ["peer", "titular"]
    },
    "nombres": { "type": "string" },
    "apellidos": { "type": "string" },
    "paralelos": { 
      "type": "array",
      "items" : PROFESOR_DATOS__PARALELOS
    }
  }
}

const ERROR_SERVIDOR = {
  "properties": {
    "datos": { "type": "string" },
    "codigoEstado": { "type": "integer", "const": 200 },
    "estado": { "type": "boolean" }
  },
  "additionalProperties": false
}

const OK_ERROR = {
  "type": "object",
  "properties": {
    "datos": { "type": "string" },
    "codigoEstado": { "type": "integer", "const": 200 },
    "estado": { "type": "boolean" }
  },
  "additionalProperties": false
}

const ESTUDIANTE = {
  "type": "object",
  "properties": {
    "correo": { "type": "string" },
    "nombres": { "type": "string" },
    "apellidos": { "type": "string" }
  },
  "additionalProperties": false
}

const ESTUDIANTE_CON_ID = {
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "correo": { "type": "string" },
    "nombres": { "type": "string" },
    "apellidos": { "type": "string" }
  },
  "additionalProperties": false
}

const PREGUNTA = {
  "type": "object",
  "properties": {
    "texto": { "type": "string" },
    "paralelo": { "type": "string" },
    "creador": { 
      "type": "object",
      "items" : ESTUDIANTE 
    },
    "_id": { "type": "string" },
    "destacada": { "type": "boolean" }
  },
  "additionalProperties": false
}

const PREGUNTAS_HOY_ESTUDIANTES = {
  "type": "object",
  "minProperties": 7,
  "additionalProperties": false,
  "properties": {
    "creador": { 
      "type": "object",
      "items" : ESTUDIANTE_CON_ID 
    },
    "_id": { "type": "string" },
    "destacada": { "type": "boolean" },
    "texto": { "type": "string" },
    "paralelo": { "type": "string" },
    "createdAt": { "type": "string" },
    "updatedAt": { "type": "string" }
  }
}

module.exports = {
  PROFESOR_DATOS,
  ERROR_SERVIDOR,
  OK_ERROR,
  PREGUNTA,
  PREGUNTAS_HOY_ESTUDIANTES
}

// const ERROR_SERVIDOR = { datos: 'Error en el servidor', codigoEstado: 500, estado: false }
// OK_ERROR = { estado: false, datos: mensaje, codigoEstado: 200 }