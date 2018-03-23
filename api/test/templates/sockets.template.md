## Conexión Cliente

```js
const socket = io('/att', {
    reconnect: true
})
```

## Metodos

En socketio existe dos metodos con los que se trabaja, son __emit__ y __on__.

* Emit enviar al servidor dado un _evento_ y el _mensaje_ que se desee enviar

```js
socket.emit('evento', mensaje)
```

* On recibe un _evento_ ademas una funcion con los datos que le envia el server

```js
socket.on('evento', function(mensajeRecibido) { })
```


## Acciones

### Pregunta a profesor

_estudiante_

```js
```

_profesor_

```js
```


#### Metodos Detalle

## Estudiante

#### Emit

_Estudiante pregunta_

__path__: 'pregunta-estudiante'

__mensaje__

```js
```

__ejemplo__

```js
```

#### On


## Profesores


#### On

_Profesor recive pregunta de cada estudiante_

__path__: 'pregunta-estudiante'

__mensaje__

```js
```

__ejemplo__

```js
```


<!-- socket.on('connect', function() {})
socket.on('disconnect', function() {}) -->