<!-- heroku config:set NPM_CONFIG_PRODUCTION=false -->
<!-- https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3 -->
[![Build Status](https://travis-ci.org/joelerll/att.svg?branch=master)](https://travis-ci.org/joelerll/att)
[![Coverage Status](https://coveralls.io/repos/github/joelerll/att/badge.svg?branch=master)](https://coveralls.io/github/joelerll/att?branch=master)
[![codecov](https://codecov.io/gh/joelerll/att/branch/master/graph/badge.svg)](https://codecov.io/gh/joelerll/att)
# Ask The Teacher

## Features
- [ ] Single page

- [ ] Mobile first

- [ ] Poder realizar una preguntas por el profesor

- [ ] Habilitar una pregunta por el profesor y que los estudiantes respondan

- [ ] Recibir las preguntas de los estudiantes en tiempo real

- [ ] Recibir respuestas de los estudiantes en tiempo real

## Screenshots

## API Reference

https://joelerll95.gitbooks.io/att/content/

__Correrlo en local__

```sh
npm run docs:s
```

## Prerequisites

* Nodejs > 9.3.0

* Mongodb > 3.3.0

## Development

#### Si se quiere correr en linux

```sh
./development # instala todas las dependencias npm
```

```sh
npm run dev # correr solo el servidor api
```

#### Api

```sh
npm install
```

```sh
npm run dev
```

#### Client estudiantes

```sh
cd client/estudiantes
```

```sh
npm install
```


```sh
npm run dev
```

#### Client profesores

```sh
cd client/profesores
```

```sh
npm install
```


```sh
npm run dev
```

## Testing

1. Correr todos los test

```sh
npm run test
```

2. Correr algun determinado test

```sh
npm run test:c # test controllers
npm run test:m # test model
npm run test:r # test router
npm run test:s # test socket
```

3. Correr test con tags

Si se quiere correr el test de router de un determinado tag(ver en los archivos de testing)

```sh
npm run test:r --grep @t1.1
```

## Deployment

```sh
./deploy
```

## Authors

Joel Rodriguez

Edison Mora
