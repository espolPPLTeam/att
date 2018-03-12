// /api/att/profesor/paralelos/:profesorCorreo
const PROFESOR_DATOS__PARALELOS = {
  "properties": {
    "_id": { "type": "string" },
    "codigo": { "type": "string" },
    "curso": { "type": "string" },
    "nombre": { "type": "string" }
  },
  "additionalProperties": false
}

const PROFESOR_DATOS = {
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
  },
  "additionalProperties": false
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
  "title": "OK_ERROR",
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

module.exports = {
  PROFESOR_DATOS,
  ERROR_SERVIDOR,
  OK_ERROR,
  PREGUNTA
}

// const ERROR_SERVIDOR = { datos: 'Error en el servidor', codigoEstado: 500, estado: false }
// OK_ERROR = { estado: false, datos: mensaje, codigoEstado: 200 }