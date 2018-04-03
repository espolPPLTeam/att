# Api DOCS
{% api "Profesores Obtener Datos", method="GET", url="/api/att/profesor/datosProfesor/:profesorCorreo"  %}Da los paralelos para que se pueda escribir en la pagina principal los paralelos
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| profesorCorreo | String |   ---   | 
	

### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "paralelos": [
      {
        "codigo": "FISG1002",
        "_id": "BJg_YoqljG",
        "curso": "2",
        "nombre": "FÍSICA II"
      }
    ]
  },
  "codigoEstado": 200
}
```

### ERRORS:
__NO ES EMAIL__

Cuando el campo _profesorCorreo_ no es válido


_response_

```js
{
  "estado": false,
  "datos": "El correo no es válido",
  "codigoEstado": 200
}
```
	
	
__NO EXISTE__




_response_

```js
{
  "estado": false,
  "datos": "El profesor no está registrado en la base de datos",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Crear pregunta estudiante", method="POST", url="/api/att/estudiante/preguntar"  %}El estudiante crea una pregunta
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  texto  | String  |   ---   | 
|  paraleloId  | String  |   ---   | 
|  creador  | Object  |   ---   | 
| <center> _id </center> | String  |   ---   | 
| <center>  correo </center> | String  |   ---   | 
| <center>  matricula </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "texto": "Mi primera pregunta",
  "paraleloId": "H1gKKo9giG",
  "creador": {
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "matricula": "201602281",
    "correo": "kenjoale@espol.edu.ec"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "texto": "Mi primera pregunta",
    "paralelo": "H1gKKo9giG",
    "_id": "S1-KFs9xjM",
    "creador": {
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "destacada": false
  },
  "codigoEstado": 200
}
```

### ERRORS:
__PARALELOID ES CAMPO OBLIGATORIO__




_request_

```js
{
  "texto": "Mi primera pregunta",
  "creador": {
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "matricula": "201602281",
    "correo": "kenjoale@espol.edu.ec"
  }
}
```

_response_

```js
{
  "estado": false,
  "datos": "El campo paraleloId no debe ser vacío",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Descatar pregunta", method="PUT", url="/api/att/profesor/destacarPregunta"  %}El profesor coloca como destacada una pregunta que escoja
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  preguntaId  | String  |   ---   | 
|  destacadaEstado  | Boolean  |   ---   | 

### Request:

```json
{
  "preguntaId": "BybqFo5esG",
  "destacadaEstado": true
}
```

### Response:

```json
{
  "estado": true,
  "datos": "La pregunta fue destacada correctamente",
  "codigoEstado": 200
}
```

### ERRORS:
__PREGUNTA ID NO EXISTE__




_request_

```js
{
  "preguntaId": "sdasssdas",
  "destacadaEstado": true
}
```

_response_

```js
{
  "estado": false,
  "datos": "La pregunta con ese id no existe",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Preguntas Estudiantes Hoy", method="GET", url="/api/att/profesor/preguntasEstudianteHoy/:paraleloId"  %}Obtiene las preguntas que se hicieron el dia actual en el paralelo enviado
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| paraleloId | String |   --   | 
	

### Response:

```json
{
  "estado": true,
  "datos": [
    {
      "creador": {
        "_id": "rkG5Fjqgjf",
        "correo": "kenjoale@espol.edu.ec",
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO"
      },
      "destacada": false,
      "_id": "r1Q9YoqeoG",
      "texto": "Mi primera pregunta estudiante 1",
      "paralelo": "rkG5Fjqgjf",
      "createdAt": "2018-04-03T06:13:22.490Z",
      "updatedAt": "2018-04-03T06:13:22.490Z"
    },
    {
      "creador": {
        "_id": "rkG5Fjqgjf",
        "correo": "johelsar@espol.edu.ec",
        "nombres": "JOHARA ELVIRA",
        "apellidos": "SARMIENTO TAPIA"
      },
      "destacada": false,
      "_id": "HJoFs9goz",
      "texto": "Mi primera pregunta estudiante 2",
      "paralelo": "rkG5Fjqgjf",
      "createdAt": "2018-04-03T06:13:22.694Z",
      "updatedAt": "2018-04-03T06:13:22.694Z"
    }
  ],
  "codigoEstado": 200
}
```

### ERRORS:
{% endapi%}


{% api "Estudiante preguntas hechas", method="GET", url="/api/att/estudiante/misPreguntasHoy/:correo"  %}Obtiene las preguntas que ha hecho el estudiante el dia de hoy
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| correo | String |   --   | 
	

### Response:

```json
{
  "estado": true,
  "datos": [
    {
      "texto": "Mi pregunta",
      "createdAt": "2018-04-03T06:13:23.216Z"
    },
    {
      "texto": "Mi pregunta dos",
      "createdAt": "2018-04-03T06:13:23.424Z"
    }
  ],
  "codigoEstado": 200
}
```

### ERRORS:
{% endapi%}


{% api "Login", method="POST", url="/api/att/login"  %}Obtiene las preguntas que ha hecho el estudiante el dia de hoy
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| correo | String |   --   | 
	

### Request:

```json
{
  "correo": "mheredia@espol.edu.ec"
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "paralelos": []
  },
  "codigoEstado": 200
}
```

### ERRORS:
__NO EXISTE__




_request_

```js
{
  "correo": "mheredia@espol.edu.ec"
}
```

_response_

```js
{
  "estado": false,
  "mensaje": "El usuario no existe"
}
```
	
	
{% endapi%}


{% api "Datos de usuario logeado", method="GET", url="/api/att/datosUsuario"  %}Obtiene los datos del usuario
### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "paralelos": []
  },
  "codigoEstado": 200
}
```

### ERRORS:
__NO LOGEADO__




_response_

```js
{
  "estado": false,
  "mensaje": "No esta loggeado"
}
```
	
	
{% endapi%}


{% api "Logout", method="GET", url="/api/att/logout"  %}Obtiene las preguntas que ha hecho el estudiante el dia de hoy
### Response:

```json
{
  "estado": true
}
```
{% endapi%}


{% api "Crear pregunta y habilitarla", method="POST", url="/api/att/profesor/preguntar"  %}El profesor crea la pregunta y ademas queda habilitada para que los estudiantes respondan
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  texto  | String  |   ---   | 
|  paraleloId  | String  |   ---   | 
|  creador  | Object  |   ---   | 
| <center> _id </center> | String  |   ---   | 
| <center>  correo </center> | String  |   ---   | 
| <center>  tipo </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "texto": "Mi pregunta a estudiante",
  "paraleloId": "ByM6Yi9liz",
  "creador": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "ByZ6Ks9gif",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "_id": "BJAFs5lof",
    "texto": "Mi pregunta a estudiante",
    "creador": {
      "_id": "ByZ6Ks9gif",
      "correo": "mheredia@espol.edu.ec",
      "tipo": "titular",
      "nombres": "TAMARA",
      "apellidos": "HEREDIA"
    }
  },
  "codigoEstado": 200
}
```

### ERRORS:
{% endapi%}


{% api "Responder Estudiante", method="POST", url="/api/att/estudiante/responder"  %}
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  texto  | String  |   ---   | 
|  paraleloId  | String  |   ---   | 
|  preguntaId  | String  |   ---   | 
|  creador  | Object  |   ---   | 
| <center> _id </center> | String  |   ---   | 
| <center>  correo </center> | String  |   ---   | 
| <center>  matricula </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "paraleloId": "Hyx0Ysqesz",
  "preguntaId": "r1QRYi9ljM",
  "texto": "Esta pregunta no tiene sentido",
  "creador": {
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "_id": "S1WAYs9esM",
    "preguntas": [],
    "respuestas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "creador": {
      "_id": "S1WAYs9esM",
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "paraleloId": "Hyx0Ysqesz",
    "preguntaId": "r1QRYi9ljM",
    "texto": "Esta pregunta no tiene sentido",
    "_id": "H11qicgoG",
    "destacada": false,
    "createdAt": "2018-04-03T06:13:26.683Z",
    "updatedAt": "2018-04-03T06:13:26.683Z"
  },
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Destacar Respuesta", method="PUT", url="/api/att/profesor/destacarRespuesta"  %}Profesor escoge una pregunta para destacarla
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  respuestaId  | String  |   ---   | 
|  destacadaEstado  | Boolean  |   ---   | 

### Request:

```json
{
  "respuestaId": "BJxycoqxsG",
  "destacadaEstado": true
}
```

### Response:

```json
{
  "estado": true,
  "datos": "La pregunta fue destacada",
  "codigoEstado": 200
}
```

### ERRORS:
__NO EXISTE RESPUESTA__




_response_

```js
{
  "estado": false,
  "datos": "El id de esta respuesta no existe",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Terminar Pregunta", method="PUT", url="/api/att/profesor/terminarPregunta"  %}La pregunta es desabilitada a que los estudiantes puedan responder
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  paraleloId  | String  |   ---   | 
|  preguntaId  | String  |   ---   | 
|  terminadoPor  | Object  |   ---   | 
| <center> _id </center> | String  |   ---   | 
| <center>  correo </center> | String  |   ---   | 
| <center>  tipo </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "preguntaId": "Hklqocxiz",
  "paraleloId": "SJWk5jqejz",
  "terminadoPor": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "rJzycocljG",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "paraleloId": "SJWk5jqejz",
    "preguntaId": "Hklqocxiz",
    "terminadoPor": {
      "_id": "rJzycocljG",
      "correo": "mheredia@espol.edu.ec",
      "nombres": "TAMARA",
      "apellidos": "HEREDIA",
      "tipo": "titular"
    }
  },
  "codigoEstado": 200
}
```

### ERRORS:
__NO EXISTE RESPUESTA__




_response_

```js
{
  "estado": false,
  "datos": "El paralelo con ese id no existe",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Obtener respuestas de pregunta", method="GET", url="/api/att/profesor/respuestasPregunta/:preguntaId"  %}
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| preguntaId | String |    | 
	

### Response:

```json
{
  "estado": true,
  "datos": [
    {
      "creador": {
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO",
        "correo": "kenjoale@espol.edu.ec"
      },
      "destacada": false,
      "_id": "BJgl9jceiM",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 1",
      "createdAt": "2018-04-03T06:13:28.005Z",
      "updatedAt": "2018-04-03T06:13:28.005Z"
    },
    {
      "creador": {
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO",
        "correo": "kenjoale@espol.edu.ec"
      },
      "destacada": false,
      "_id": "rJ-xqj5goG",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 2",
      "createdAt": "2018-04-03T06:13:28.224Z",
      "updatedAt": "2018-04-03T06:13:28.224Z"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Obtener Preguntas Profesor", method="GET", url="/api/att/profesores/misPreguntasHoy/:paraleloId"  %}
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  paraleloId  | String  |    | 

### Response:

```json
{
  "estado": true,
  "datos": [
    {
      "creador": {
        "_id": "abc",
        "correo": "mheredia@espol.edu.ec",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "hablitado": true,
      "respuestas": [],
      "_id": "BJ7l9sqxjz",
      "texto": "Mi primera pregunta",
      "paraleloId": "abc",
      "createdAt": "2018-04-03T06:13:28.291Z",
      "updatedAt": "2018-04-03T06:13:28.291Z"
    },
    {
      "creador": {
        "_id": "abc",
        "correo": "mheredia@espol.edu.ec",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "hablitado": true,
      "respuestas": [],
      "_id": "ryVl9i9xoz",
      "texto": "Mi primera pregunta dos",
      "paraleloId": "abc",
      "createdAt": "2018-04-03T06:13:28.521Z",
      "updatedAt": "2018-04-03T06:13:28.521Z"
    }
  ],
  "codigoEstado": 200
}
```

### ERRORS:
{% endapi%}



