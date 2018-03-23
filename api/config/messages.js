module.exports = {
  CORREO_INVALIDO: 'El correo no es válido',
  PROFESOR_NO_EXISTE: 'El profesor no está registrado en la base de datos',
  PREGUNTA_DESTACADA: 'La pregunta fue destacada correctamente',
  PREGUNTA_CREADA: 'La pregunta fue creada correctamente',
  PARALELOID_VACIO: 'El campo paraleloId no debe ser vacío',
  PREGUNTAID_NO_EXISTE: 'La pregunta con ese id no existe',
  PARAMETROS_UNDEFINED: 'Parametros Undefined',
  ERROR_AL_CREAR: 'Error al crear',
  ERROR_AL_OBTENER: 'Error al obtener los datos',
  NO_ESTA_ENVIANDO: function(dato) {
    return `NO esta enviando los datos: ${dato.join(',')}`
  }
}
