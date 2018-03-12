const path = require('path')
const fs = require('fs')
const del = require('del')
const nunjucks = require('nunjucks')

function generateAPI({ docs }) {
  del.sync([path.join(__dirname, '../../docs/api.md')], { force: true })
  nunjucks.configure(path.join(__dirname, 'templates'), { autoescape: false })
  const res = nunjucks.render(path.join(__dirname, 'templates/api.template.md'), { docs, blockInicio: '{%', blockFin: '%}' })
  fs.appendFileSync(path.join(__dirname, '../../docs/api.md'), res) 
}

function generateREALTIME({ docs }) {

}

function toString(objeto) {
  return JSON.stringify(objeto, null, 2)
}

module.exports = {
  generateAPI,
  toString
}