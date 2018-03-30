const conn = new Mongo()
const db = conn.getDB('att')

db.createCollection('estudiantes')
db.createCollection('profesores')
db.createCollection('paralelos')
db.createCollection('preguntasEstudiante')
db.createCollection('preguntasProfesores')
db.createCollection('respuestas')

const estudiante = {
	nombres: 'Edison André',
	apelidos: 'Mora Cazar',
	correo: 'edanmora@espol.edu.ec',
	matricula: '201304614',
	preguntas: [],
	respuestas: []
}

db.estudiantes.insert(estudiante)

const profesor = {
	nombres: 'Florencio',
	apelidos: 'Pinela',
	correo: 'fpinela@espol.edu.ec',
	tipo: 'titular',
	preguntas: []
}

db.profesores.insert(profesor)

const paralelo = {
	codigo: 'FISG1003',
	nombre: 'Paralelo 1',
	anio: '2018',
	termino: '1',
	habilitado: false,
	profesores: [],
	estudiantes: [],
	preguntasProfesor: [],
	preguntasEstudiante: []	
}

db.paralelos.insert(paralelo)

