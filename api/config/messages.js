module.exports = {
  CORREO_INVALIDO: 'El correo no es válido',
  PROFESOR_NO_EXISTE: 'El profesor no está registrado en la base de datos',
  ESTUDIANTE_NO_EXISTE: 'El estudiante no esta registrado en la app',
  PREGUNTA_DESTACADA: 'La pregunta fue destacada correctamente',
  PREGUNTA_CREADA: 'La pregunta fue creada correctamente',
  PARALELOID_VACIO: 'El campo paraleloId no debe ser vacío',
  PREGUNTAID_NO_EXISTE: 'La pregunta con ese id no existe',
  PARAMETROS_UNDEFINED: 'Parametros Undefined',
  ERROR_AL_CREAR: 'Error al crear',
  ERROR_AL_OBTENER: 'Error al obtener los datos',
  NO_REGISTRADO: 'El usuario no existe',
  NO_ESTA_ENVIANDO: function(dato) {
    return `NO esta enviando los datos: ${dato.join(',')}`
  }
}
