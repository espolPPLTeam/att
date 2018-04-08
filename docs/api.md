# Api DOCS
{% api "Profesores Obtener Datos", method="GET", url="/api/att/profesor/datosProfesor/:profesorCorreo"  %}

Da los paralelos para que se pueda escribir en la pagina principal los paralelos
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
        "_id": "S1z6ohmPjG",
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


{% api "Crear pregunta estudiante", method="POST", url="/api/att/estudiante/preguntar"  %}

El estudiante crea una pregunta
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
  "paraleloId": "r1gCi2mwjf",
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
    "paralelo": "r1gCi2mwjf",
    "_id": "rJ1h3QDoM",
    "creador": {
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "matricula": "201602281",
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


{% api "Descatar pregunta", method="PUT", url="/api/att/profesor/destacarPregunta"  %}

El profesor coloca como destacada una pregunta que escoja
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  preguntaId  | String  |   ---   | 
|  destacadaEstado  | Boolean  |   ---   | 

### Request:

```json
{
  "preguntaId": "rkGhhXwsM",
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


{% api "Preguntas Estudiantes Hoy", method="GET", url="/api/att/profesor/preguntasEstudianteHoy/:paraleloId"  %}

Obtiene las preguntas que se hicieron el dia actual en el paralelo enviado
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
        "correo": "kenjoale@espol.edu.ec",
        "nombres": "KENNETH JOSUE",
        "matricula": "201602281",
        "apellidos": "ALEJANDRO SOLORZANO"
      },
      "destacada": false,
      "_id": "SJ8nhXvsf",
      "texto": "Mi primera pregunta estudiante 1",
      "paralelo": "rkrnhmPjf",
      "createdAt": "2018-04-08T05:46:21.651Z",
      "updatedAt": "2018-04-08T05:46:21.651Z"
    },
    {
      "creador": {
        "correo": "johelsar@espol.edu.ec",
        "nombres": "JOHARA ELVIRA",
        "matricula": "201501116",
        "apellidos": "SARMIENTO TAPIA"
      },
      "destacada": false,
      "_id": "HJlUhhmvjM",
      "texto": "Mi primera pregunta estudiante 2",
      "paralelo": "rkrnhmPjf",
      "createdAt": "2018-04-08T05:46:22.167Z",
      "updatedAt": "2018-04-08T05:46:22.167Z"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Estudiante preguntas hechas", method="GET", url="/api/att/estudiante/misPreguntasHoy/:correo"  %}

Obtiene las preguntas que ha hecho el estudiante el dia de hoy
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
      "createdAt": "2018-04-08T05:46:23.569Z"
    },
    {
      "texto": "Mi pregunta dos",
      "createdAt": "2018-04-08T05:46:23.805Z"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Login", method="POST", url="/api/att/login"  %}

Valido para profesor o estudiante
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
    "paralelos": [
      {
        "codigo": "FISG1002",
        "_id": "BJm_nnQPiM",
        "curso": "2",
        "nombre": "FÍSICA II"
      }
    ]
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


{% api "Datos de profesor para primera pagina", method="GET", url="/api/att/datosUsuario"  %}

Obtiene los datos del profesor que esta conectado, usa cookies para saber quien esta conectado
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
        "_id": "BJm_nnQPiM",
        "curso": "2",
        "nombre": "FÍSICA II"
      }
    ]
  },
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Datos de usuario estudiante", method="GET", url="/api/att/datosUsuario"  %}

Obtiene los datos del estudiante. Si no hay Pregunta Profesor activa devuelve {}. Si el estudiante no respondio devuelve ""
### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "paraleloId": "ByWK3nmPjz",
    "misPreguntasHoy": [
      {
        "texto": "Mi primera pregunta",
        "createdAt": "2018-04-08T05:46:25.541Z"
      }
    ],
    "preguntaProfesor": {
      "texto": "Pregunta Profesor",
      "_id": "HJx532QwiG",
      "createdAt": "2018-04-08T05:46:25.734Z",
      "respuesta": "Mi respuesta"
    }
  },
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Logout", method="GET", url="/api/att/logout"  %}


### Response:

```json
{
  "estado": true
}
```
{% endapi%}


{% api "Crear pregunta y habilitarla", method="POST", url="/api/att/profesor/preguntar"  %}

El profesor crea la pregunta y ademas queda habilitada para que los estudiantes respondan
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
  "paraleloId": "rkba2h7viG",
  "creador": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "rylTh2mwsG",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "_id": "B1Mp2nQvjG",
    "texto": "Mi pregunta a estudiante",
    "creador": {
      "_id": "rylTh2mwsG",
      "correo": "mheredia@espol.edu.ec",
      "tipo": "titular",
      "nombres": "TAMARA",
      "apellidos": "HEREDIA"
    }
  },
  "codigoEstado": 200
}
```
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
  "paraleloId": "rJRnnQvof",
  "preguntaId": "H1MAhh7PsG",
  "texto": "Esta pregunta no tiene sentido",
  "creador": {
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "_id": "SkgC3h7Dof",
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
      "_id": "SkgC3h7Dof",
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "paraleloId": "rJRnnQvof",
    "preguntaId": "H1MAhh7PsG",
    "texto": "Esta pregunta no tiene sentido",
    "_id": "ByJah7Dsz",
    "destacada": false,
    "createdAt": "2018-04-08T05:46:30.707Z",
    "updatedAt": "2018-04-08T05:46:30.707Z"
  },
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Destacar Respuesta", method="PUT", url="/api/att/profesor/destacarRespuesta"  %}

Profesor escoge una pregunta para destacarla
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  respuestaId  | String  |   ---   | 
|  destacadaEstado  | Boolean  |   ---   | 

### Request:

```json
{
  "respuestaId": "SkeJp3QvjM",
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


{% api "Terminar Pregunta", method="PUT", url="/api/att/profesor/terminarPregunta"  %}

La pregunta es desabilitada a que los estudiantes puedan responder
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
  "preguntaId": "rkWg63mPoM",
  "paraleloId": "Skx6hQvjM",
  "terminadoPor": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "Bkxx6hXwsz",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "paraleloId": "Skx6hQvjM",
    "preguntaId": "rkWg63mPoM",
    "terminadoPor": {
      "_id": "Bkxx6hXwsz",
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
      "_id": "ry-6nQDiz",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 1",
      "createdAt": "2018-04-08T05:46:33.289Z",
      "updatedAt": "2018-04-08T05:46:33.289Z"
    },
    {
      "creador": {
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO",
        "correo": "kenjoale@espol.edu.ec"
      },
      "destacada": false,
      "_id": "rke-63XDof",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 2",
      "createdAt": "2018-04-08T05:46:33.498Z",
      "updatedAt": "2018-04-08T05:46:33.498Z"
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
      "_id": "B1GTnXvoG",
      "texto": "Mi primera pregunta",
      "paraleloId": "abc",
      "createdAt": "2018-04-08T05:46:33.823Z",
      "updatedAt": "2018-04-08T05:46:33.823Z"
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
      "_id": "HkeGTh7vjz",
      "texto": "Mi primera pregunta dos",
      "paraleloId": "abc",
      "createdAt": "2018-04-08T05:46:33.986Z",
      "updatedAt": "2018-04-08T05:46:33.986Z"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Obtener datos del perfil profesor", method="GET", url="/api/att/profesor/perfil/:paraleloId/:correo"  %}


### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| paraleloId | String |    |
	
| correo | String |    |
	

### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "preguntasEstudiantesHoy": [
      {
        "creador": {
          "correo": "kenjoale@espol.edu.ec",
          "nombres": "KENNETH JOSUE",
          "matricula": "201602281",
          "apellidos": "ALEJANDRO SOLORZANO"
        },
        "destacada": false,
        "_id": "S1gma3QwjM",
        "texto": "Mi primera pregunta",
        "paralelo": "B1Mfa37wjG",
        "createdAt": "2018-04-08T05:46:34.850Z",
        "updatedAt": "2018-04-08T05:46:34.850Z"
      }
    ],
    "preguntaProfesor": {
      "creador": {
        "_id": "rJZzT37DjM",
        "correo": "mheredia@espol.edu.ec",
        "tipo": "titular",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "createdAt": "2018-04-08T05:46:35.031Z",
      "texto": "Pregunta Profesor",
      "respuestas": [
        {
          "creador": {
            "_id": "HJXTnmvsz",
            "correo": "kenjoale@espol.edu.ec",
            "nombres": "KENNETH JOSUE",
            "apellidos": "ALEJANDRO SOLORZANO"
          },
          "destacada": false,
          "_id": "SJfmp27PjM",
          "paraleloId": "B1Mfa37wjG",
          "preguntaId": "S1W7TnXwiz",
          "texto": "Mi respuesta",
          "createdAt": "2018-04-08T05:46:35.318Z",
          "updatedAt": "2018-04-08T05:46:35.318Z"
        }
      ]
    }
  },
  "codigoEstado": 200
}
```
{% endapi%}



