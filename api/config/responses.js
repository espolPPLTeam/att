const ERROR_SERVIDOR = { datos: { estado: false, datos: 'Error en el servidor' }, codigoEstado: 500 }

const NO_AUTORIZADO = { datos: { estado: false, datos: 'Usuario No autorizado' }, codigoEstado: 401 }

const OK = (datos) => {
  const resp = { estado: true, datos, codigo_estado: 200 }
  return resp
}

module.exports = {
  OK,
  ERROR_SERVIDOR,
  NO_AUTORIZADO
}