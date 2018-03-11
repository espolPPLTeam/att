// /api/att/profesor/paralelos/:profesorCorreo
const PROFESOR_DATOS__PARALELOS = {
  "properties": {
    "_id": { "type": "string" },
    "codigo": { "type": "string" },
    "curso": { "type": "string" },
    "nombre": { "type": "string" }
  }
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
  }
}

module.exports = {
  PROFESOR_DATOS
}