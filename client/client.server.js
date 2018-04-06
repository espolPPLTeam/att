const express = require('express')
const path = require('path')

module.exports = (app) => {
	app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')))
	app.use('/estudiantes', express.static(path.join(__dirname, 'estudiantes/dist')))
}
