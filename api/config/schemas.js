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
  "minProperties": 6,
  "additionalProperties": false,
  "properties": {
    "texto": { "type": "string" },
    "paralelo": { "type": "string" },
    "creador": {
      "type": "object",
      "items" : ESTUDIANTE
    },
    "_id": { "type": "string" },
    "destacada": { "type": "boolean" },
    "calificacion": { "type": "number"}
  },
  "additionalProperties": false
}

const PREGUNTAS_HOY_ESTUDIANTES = {
  "type": "object",
  "minProperties": 8,
  "additionalProperties": false,
  "properties": {
    "creador": {
      "type": "object",
      "items" : ESTUDIANTE_CON_ID
    },
    "_id": { "type": "string" },
    "destacada": { "type": "boolean" },
    "texto": { "type": "string" },
    "calificacion": { "type": "number" },
    "paralelo": { "type": "string" },
    "createdAt": { "type": "string" },
    "updatedAt": { "type": "string" }
  }
}

const PREGUNTA_ESTUDIANTE = {
  "type": "object",
  "minProperties": 2,
  "additionalProperties": false,
  "properties": {
    "texto": { "type": "string" },
    "createdAt": { "type": "string" }
  }
}

const PROFESOR_DATOS_PREGUNTA = {
  "minProperties": 5,
  "additionalProperties": false,
  "properties": {
    "_id": {
      "type": "string"
    },
    "correo": {
      "type": "string",
      "format": "email"
    },
    "tipo": {
      "type": "string" ,
      "enum": ["peer", "titular"]
    },
    "nombres": { "type": "string" },
    "apellidos": { "type": "string" }
  }
}

const PROFESOR_CREAR_PREGUNTA = {
  "type": "object",
  "minProperties": 3,
  "additionalProperties": false,
  "properties": {
    "_id": { "type": "string" },
    "texto": { "type": "string" },
    "creador": {
      "type": "object",
      "items" : PROFESOR_DATOS_PREGUNTA
    }
  }
}

const RESPUESTA_ESTUDIANTE = {
  "type": "object",
  "minProperties": 9,
  "additionalProperties": false,
  "properties": {
    "_id": { "type": "string" },
    "updatedAt": { "type": "string" },
    "createdAt": { "type": "string" },
    "texto": { "type": "string" },
    "destacada": { "type": "boolean" },
    "calificacion": { "type": "number"},
    "paraleloId": { "type": "string" },
    "preguntaId": { "type": "string" },
    "creador": {
      "type": "object",
      "items" : ESTUDIANTE_CON_ID
    }
  }
}

const PREGUNTA_TERMINADA = {
  "type": "object",
  "minProperties": 3,
  "additionalProperties": false,
  "properties": {
    "paraleloId": { "type": "string" },
    "preguntaId": { "type": "string" },
    "terminadoPor": {
      "type": "object",
      "items" : PROFESOR_DATOS_PREGUNTA
    }
  }
}

const RESPUESTAS_PROFESOR = {
  "type": "array",
  "minProperties": 8,
  "additionalProperties": false,
  "properties": {
    "_id": { "type": "string" },
    "updatedAt": { "type": "string" },
    "createdAt": { "type": "string" },
    "texto": { "type": "string" },
    "destacada": { "type": "boolean" },
    "paraleloId": { "type": "string" },
    "preguntaId": { "type": "string" },
    "creador": {
      "type": "object",
      "items" : ESTUDIANTE
    }
  }
}

const PREGUNTA_PROFESOR_FORMATO_ESTUDIANTE = {
  "type": "object",
  "minProperties": 5,
  "additionalProperties": false,
  "properties": {
    "texto": { "type": "string" },
    "preguntaId": { "type": "string" },
    "respuesta": { "type": "string" },
    "fechaCreadaPregunta": { "type": "string" },
    "fechaCreadaRespuesta": { "type": "string" }
  }
}

const ESTUDIANTE_PERFIL = {
  "type": "object",
  "minProperties": 7,
  "additionalProperties": false,
  "properties": {
    "nombres": { "type": "string" },
    "apellidos": { "type": "string" },
    "correo": { "type": "string", "format": "email" },
    "matricula": { "type": "string" },
    "paraleloId": { "type": "string" },
    "misPreguntasHoy": {
      "type": "array",
      "items": PREGUNTA_ESTUDIANTE
    },
    "preguntaProfesor": {
      "type": "object",
      "items": PREGUNTA_PROFESOR_FORMATO_ESTUDIANTE
    }
  }
}

const PREGUNTA_PROFESOR_FORMATO_PROFESOR = {
  "type": "object",
  "minProperties": 4,
  "properties": {
    "creador": { "type": "object", "items": PROFESOR_DATOS_PREGUNTA  },
    "createdAt": { "type": "string" },
    "_id": { "type": "string" },
    "texto": { "type": "string" },
    "respuestas": {
      "type": "array",
      "items": RESPUESTA_ESTUDIANTE
    },
  }
}

const PROFESOR_PERFIL = {
 "type": "object",
  "minProperties": 6,
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
    "preguntasEstudiantesHoy": {
      "type": "array",
      "items": PREGUNTAS_HOY_ESTUDIANTES
    },
    "preguntaProfesor": {
      "type": "object",
      "items": PREGUNTA_PROFESOR_FORMATO_PROFESOR
    }
  }
}


module.exports = {
  PROFESOR_DATOS,
  ERROR_SERVIDOR,
  OK_ERROR,
  PREGUNTA,
  PREGUNTAS_HOY_ESTUDIANTES,
  PREGUNTA_ESTUDIANTE,
  PROFESOR_CREAR_PREGUNTA,
  RESPUESTA_ESTUDIANTE,
  PREGUNTA_TERMINADA,
  RESPUESTAS_PROFESOR,
  ESTUDIANTE_PERFIL,
  PROFESOR_PERFIL
}

// const ERROR_SERVIDOR = { datos: 'Error en el servidor', codigoEstado: 500, estado: false }
// OK_ERROR = { estado: false, datos: mensaje, codigoEstado: 200 }
