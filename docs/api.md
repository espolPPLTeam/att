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
        "_id": "HJJuRLfhf",
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
| <center>  correo </center> | String  |   ---   | 
| <center>  matricula </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "texto": "Mi primera pregunta",
  "paraleloId": "Bkle_AIMnz",
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
    "paralelo": "Bkle_AIMnz",
    "_id": "BkZgdA8M3M",
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
  "preguntaId": "SkMOCUM3M",
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
      "_id": "BylX_RIM3f",
      "texto": "Mi primera pregunta estudiante 1",
      "paralelo": "ry7_ALznz",
      "createdAt": "2018-04-16T17:33:31.066Z",
      "updatedAt": "2018-04-16T17:33:31.066Z"
    },
    {
      "creador": {
        "correo": "johelsar@espol.edu.ec",
        "nombres": "JOHARA ELVIRA",
        "matricula": "201501116",
        "apellidos": "SARMIENTO TAPIA"
      },
      "destacada": false,
      "_id": "B1WmOAUMhM",
      "texto": "Mi primera pregunta estudiante 2",
      "paralelo": "ry7_ALznz",
      "createdAt": "2018-04-16T17:33:31.281Z",
      "updatedAt": "2018-04-16T17:33:31.281Z"
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
      "createdAt": "2018-04-16T17:33:31.998Z"
    },
    {
      "texto": "Mi pregunta dos",
      "createdAt": "2018-04-16T17:33:32.257Z"
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
        "_id": "rkeB_0UznM",
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
        "_id": "rkeB_0UznM",
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

Obtiene los datos del estudiante. Si no hay Pregunta Profesor activa devuelve que el objeto no existe. Si el estudiante no respondido devuelve que no existe esa propiedades
### Response:

```json
{
  "estado": true,
  "datos": {
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "paraleloId": "B1gLOCUfnM",
    "misPreguntasHoy": [
      {
        "texto": "Mi primera pregunta",
        "createdAt": "2018-04-16T17:33:34.071Z"
      }
    ],
    "preguntaProfesor": {
      "texto": "Pregunta Profesor",
      "preguntaId": "ByMIdCUG2f",
      "fechaCreadaPregunta": "2018-04-16T17:33:34.308Z",
      "fechaCreadaRespuesta": "2018-04-16T17:33:34.917Z",
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
  "paraleloId": "HyxquR8z3f",
  "creador": {
    "preguntas": [],
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "SkquRLM2z"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "_id": "HJbqORIM3G",
    "texto": "Mi pregunta a estudiante",
    "creador": {
      "_id": "SkquRLM2z",
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
  "paraleloId": "HyjuCIz3z",
  "preguntaId": "By2uAIz3G",
  "texto": "Esta pregunta no tiene sentido",
  "creador": {
    "preguntas": [],
    "respuestas": [],
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "_id": "HJxj_C8MnG"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "creador": {
      "_id": "HJxj_C8MnG",
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "destacada": false,
    "paraleloId": "HyjuCIz3z",
    "preguntaId": "By2uAIz3G",
    "texto": "Esta pregunta no tiene sentido",
    "_id": "Sye2uRUz3G",
    "createdAt": "2018-04-16T17:33:39.776Z",
    "updatedAt": "2018-04-16T17:33:39.776Z"
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
  "respuestaId": "Hk-nOC8f3M",
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
  "preguntaId": "rk0_08zhz",
  "paraleloId": "SJ6uALG2G",
  "terminadoPor": {
    "preguntas": [],
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "BJlT_ALf2f"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "paraleloId": "SJ6uALG2G",
    "preguntaId": "rk0_08zhz",
    "terminadoPor": {
      "_id": "BJlT_ALf2f",
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
      "_id": "rJe0uRLMhf",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 1",
      "createdAt": "2018-04-16T17:33:42.474Z",
      "updatedAt": "2018-04-16T17:33:42.474Z"
    },
    {
      "creador": {
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO",
        "correo": "kenjoale@espol.edu.ec"
      },
      "destacada": false,
      "_id": "H1WRdALM2f",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 2",
      "createdAt": "2018-04-16T17:33:42.788Z",
      "updatedAt": "2018-04-16T17:33:42.788Z"
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
      "habilitada": true,
      "respuestas": [],
      "_id": "rkJFC8Mhz",
      "texto": "Mi primera pregunta",
      "paraleloId": "abc",
      "createdAt": "2018-04-16T17:33:43.102Z",
      "updatedAt": "2018-04-16T17:33:43.102Z"
    },
    {
      "creador": {
        "_id": "abc",
        "correo": "mheredia@espol.edu.ec",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "habilitada": true,
      "respuestas": [],
      "_id": "BylyFA8zhM",
      "texto": "Mi primera pregunta dos",
      "paraleloId": "abc",
      "createdAt": "2018-04-16T17:33:43.291Z",
      "updatedAt": "2018-04-16T17:33:43.291Z"
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
        "_id": "S1zlFA8fhG",
        "texto": "Mi primera pregunta",
        "paralelo": "ryegF0Lfhz",
        "createdAt": "2018-04-16T17:33:44.214Z",
        "updatedAt": "2018-04-16T17:33:44.214Z"
      }
    ],
    "preguntaProfesor": {
      "creador": {
        "_id": "rJxtA8GhM",
        "correo": "mheredia@espol.edu.ec",
        "tipo": "titular",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "createdAt": "2018-04-16T17:33:44.470Z",
      "texto": "Pregunta Profesor",
      "respuestas": [
        {
          "creador": {
            "_id": "SJ-lF08fhz",
            "correo": "kenjoale@espol.edu.ec",
            "nombres": "KENNETH JOSUE",
            "apellidos": "ALEJANDRO SOLORZANO"
          },
          "destacada": false,
          "_id": "BJbFCUz2f",
          "paraleloId": "ryegF0Lfhz",
          "preguntaId": "By7gKAIz2z",
          "texto": "Mi respuesta",
          "createdAt": "2018-04-16T17:33:44.733Z",
          "updatedAt": "2018-04-16T17:33:44.733Z"
        }
      ],
      "_id": "By7gKAIz2z"
    }
  },
  "codigoEstado": 200
}
```
{% endapi%}



