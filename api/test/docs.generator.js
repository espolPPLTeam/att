// elimnar la carpeta de generate de todos los archivos
// formar el json de los parametros para formar el api docs
// copiar los archivos a la carpeta docs
// .gitignore a los archivos de generate

// https://github.com/mozilla/nunjucks
var jsonToString = function () {
    return JSON.stringify(this, null, "\t");
};
// var beautify = require("json-beautify");
var nunjucks = require('nunjucks')
var prettyjson = require('prettyjson');
const path = require('path')
const fs = require('fs')
// fs.unlinkSync(path.join(__dirname, 'templates/generate/api.md'))
// fs.writeFileSync('/path/to/file', '', function(){console.log('done')})
nunjucks.configure(path.join(__dirname, 'templates'), { autoescape: false });
let persona =  {
		nombres: 'Joel',
		apellidos: 'Rodriguezs'
	} 
var res = nunjucks.render(path.join(__dirname, 'templates/api.template.md'), { 
	nombre: 'Obtener datos profesor',
	persona: prettyjson.render(persona),
	blockInicio: '<%', blockFin: '%>' })
fs.appendFileSync(path.join(__dirname, 'templates/generate/api.md'), res)