const express = require('express')
const path = require('path')

const estLogeado = (req, res, next) => {
  if (process.env.APP === 'ppl') {
    if (req.session.correo) {
    next()
    } else {
      res.redirect('/')
    }
  } else {
    next()
  }
}

module.exports = (app) => {
	app.use('/profesores', estLogeado, express.static(path.join(__dirname, 'profesores/dist')))
	app.use('/estudiantes', estLogeado, express.static(path.join(__dirname, 'estudiantes/dist')))
}
