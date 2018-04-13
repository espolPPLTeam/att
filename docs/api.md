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
        "_id": "S1lXfh9aoM",
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
  "paraleloId": "BJxVGn9asf",
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
    "paralelo": "BJxVGn9asf",
    "_id": "SyrG35psG",
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
  "preguntaId": "rJgIf2qTjM",
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
      "_id": "SJxwGn9TiM",
      "texto": "Mi primera pregunta estudiante 1",
      "paralelo": "BkDzh9psz",
      "createdAt": "2018-04-13T02:55:11.188Z",
      "updatedAt": "2018-04-13T02:55:11.188Z"
    },
    {
      "creador": {
        "correo": "johelsar@espol.edu.ec",
        "nombres": "JOHARA ELVIRA",
        "matricula": "201501116",
        "apellidos": "SARMIENTO TAPIA"
      },
      "destacada": false,
      "_id": "HkZDG3casG",
      "texto": "Mi primera pregunta estudiante 2",
      "paralelo": "BkDzh9psz",
      "createdAt": "2018-04-13T02:55:11.435Z",
      "updatedAt": "2018-04-13T02:55:11.435Z"
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
      "createdAt": "2018-04-13T02:55:12.207Z"
    },
    {
      "texto": "Mi pregunta dos",
      "createdAt": "2018-04-13T02:55:12.421Z"
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
        "_id": "rkltM39asG",
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
        "_id": "rkltM39asG",
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
    "paraleloId": "H1Wqf35aoM",
    "misPreguntasHoy": [
      {
        "texto": "Mi primera pregunta",
        "createdAt": "2018-04-13T02:55:14.248Z"
      }
    ],
    "preguntaProfesor": {
      "texto": "Pregunta Profesor",
      "preguntaId": "ryQqfhc6iz",
      "fechaCreadaPregunta": "2018-04-13T02:55:14.427Z",
      "fechaCreadaRepuesta": "2018-04-13T02:55:14.918Z",
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
  "paraleloId": "SJbRz29ToG",
  "creador": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "rkg0Mn5Toz",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "_id": "SJJQ2q6iM",
    "texto": "Mi pregunta a estudiante",
    "creador": {
      "_id": "rkg0Mn5Toz",
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
  "paraleloId": "HyeJm25pjf",
  "preguntaId": "HJllX2cTjM",
  "texto": "Esta pregunta no tiene sentido",
  "creador": {
    "correo": "kenjoale@espol.edu.ec",
    "matricula": "201602281",
    "nombres": "KENNETH JOSUE",
    "apellidos": "ALEJANDRO SOLORZANO",
    "_id": "rkWkXnqaoz",
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
      "_id": "rkWkXnqaoz",
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "paraleloId": "HyeJm25pjf",
    "preguntaId": "HJllX2cTjM",
    "texto": "Esta pregunta no tiene sentido",
    "_id": "H1bxmn9asG",
    "destacada": false,
    "createdAt": "2018-04-13T02:55:20.052Z",
    "updatedAt": "2018-04-13T02:55:20.052Z"
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
  "respuestaId": "Bk-X3qaof",
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
  "preguntaId": "H1lGX2c6jM",
  "paraleloId": "SJl-73casf",
  "terminadoPor": {
    "correo": "mheredia@espol.edu.ec",
    "tipo": "titular",
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "_id": "Hyzm3q6oG",
    "preguntas": []
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "paraleloId": "SJl-73casf",
    "preguntaId": "H1lGX2c6jM",
    "terminadoPor": {
      "_id": "Hyzm3q6oG",
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
      "_id": "HJX72q6jf",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 1",
      "createdAt": "2018-04-13T02:55:22.706Z",
      "updatedAt": "2018-04-13T02:55:22.706Z"
    },
    {
      "creador": {
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO",
        "correo": "kenjoale@espol.edu.ec"
      },
      "destacada": false,
      "_id": "BJe7m39aif",
      "paraleloId": "aqb",
      "preguntaId": "preguntaIdentificador",
      "texto": "Mi respuesta 2",
      "createdAt": "2018-04-13T02:55:22.914Z",
      "updatedAt": "2018-04-13T02:55:22.914Z"
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
      "_id": "S1fX7396jz",
      "texto": "Mi primera pregunta",
      "paraleloId": "abc",
      "createdAt": "2018-04-13T02:55:23.205Z",
      "updatedAt": "2018-04-13T02:55:23.205Z"
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
      "_id": "S1mmm3cpjG",
      "texto": "Mi primera pregunta dos",
      "paraleloId": "abc",
      "createdAt": "2018-04-13T02:55:23.423Z",
      "updatedAt": "2018-04-13T02:55:23.423Z"
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
        "_id": "SyfVXhqpsz",
        "texto": "Mi primera pregunta",
        "paralelo": "HygE7h96oM",
        "createdAt": "2018-04-13T02:55:24.346Z",
        "updatedAt": "2018-04-13T02:55:24.346Z"
      }
    ],
    "preguntaProfesor": {
      "creador": {
        "_id": "H1EmhcToG",
        "correo": "mheredia@espol.edu.ec",
        "tipo": "titular",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "createdAt": "2018-04-13T02:55:24.557Z",
      "texto": "Pregunta Profesor",
      "respuestas": [
        {
          "creador": {
            "_id": "ryb4X2qaif",
            "correo": "kenjoale@espol.edu.ec",
            "nombres": "KENNETH JOSUE",
            "apellidos": "ALEJANDRO SOLORZANO"
          },
          "destacada": false,
          "_id": "S1xrQn56sG",
          "paraleloId": "HygE7h96oM",
          "preguntaId": "BkBmh5aoz",
          "texto": "Mi respuesta",
          "createdAt": "2018-04-13T02:55:24.789Z",
          "updatedAt": "2018-04-13T02:55:24.789Z"
        }
      ]
    }
  },
  "codigoEstado": 200
}
```
{% endapi%}



