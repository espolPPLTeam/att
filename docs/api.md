# Api DOCS
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
  "paraleloId": "rkxNOO8CG",
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
    "calificacion": 0,
    "paralelo": "rkxNOO8CG",
    "creador": {
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "matricula": "201602281",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "destacada": false,
    "id": "r1gl4u_8CG"
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
  "preguntaId": "r1-ZNu_8AG",
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
        "curso": "2",
        "nombre": "FÍSICA II",
        "id": "BkgGNuuLRz"
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
        "curso": "2",
        "nombre": "FÍSICA II",
        "id": "BkgGNuuLRz"
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
    "paraleloId": "rk-QEOOIAM",
    "misPreguntasHoy": [
      {
        "texto": "Mi primera pregunta",
        "createdAt": "2018-05-14T02:44:59.746Z"
      }
    ],
    "preguntaProfesor": {
      "texto": "Pregunta Profesor",
      "preguntaId": "Byl44OuU0f",
      "fechaCreadaPregunta": "2018-05-14T02:44:59.950Z",
      "fechaCreadaRespuesta": "2018-05-14T02:45:00.372Z",
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
| <center>  correo </center> | String  |   ---   | 
| <center>  tipo </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "texto": "Mi pregunta a estudiante",
  "paraleloId": "HJdVudI0z",
  "creador": {
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "tipo": "titular",
    "correo": "mheredia@espol.edu.ec"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "texto": "Mi pregunta a estudiante",
    "creador": {
      "correo": "mheredia@espol.edu.ec",
      "tipo": "titular",
      "nombres": "TAMARA",
      "apellidos": "HEREDIA"
    },
    "id": "r1guN_uL0f"
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
| <center>  correo </center> | String  |   ---   | 
| <center>  matricula </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "paraleloId": "Sk-_4udI0f",
  "preguntaId": "SkWK4_uICG",
  "texto": "Esta pregunta no tiene sentido",
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
    "creador": {
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "destacada": false,
    "calificacion": 0,
    "paraleloId": "Sk-_4udI0f",
    "preguntaId": "SkWK4_uICG",
    "texto": "Esta pregunta no tiene sentido",
    "createdAt": "2018-05-14T02:45:05.290Z",
    "updatedAt": "2018-05-14T02:45:05.290Z",
    "id": "HJzK4dOUCM"
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
  "respuestaId": "rJcEuu8Cz",
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
| <center>  correo </center> | String  |   ---   | 
| <center>  tipo </center> | String  |   ---   | 
| <center>  nombres </center> | String  |   ---   | 
| <center>  apellidos </center> | String  |   ---   | 

### Request:

```json
{
  "preguntaId": "BkbjE_uLCf",
  "paraleloId": "HJoVuu8Rf",
  "terminadoPor": {
    "nombres": "TAMARA",
    "apellidos": "HEREDIA",
    "tipo": "titular",
    "correo": "mheredia@espol.edu.ec"
  }
}
```

### Response:

```json
{
  "estado": true,
  "datos": {
    "paraleloId": "HJoVuu8Rf",
    "preguntaId": "BkbjE_uLCf",
    "terminadoPor": {
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
        "calificacion": 0,
        "texto": "Mi primera pregunta",
        "paralelo": "Skx34ud8CM",
        "createdAt": "2018-05-14T02:45:08.528Z",
        "updatedAt": "2018-05-14T02:45:08.528Z",
        "id": "H1aEOdICM"
      }
    ],
    "preguntaProfesor": {
      "creador": {
        "correo": "mheredia@espol.edu.ec",
        "tipo": "titular",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "createdAt": "2018-05-14T02:45:08.729Z",
      "texto": "Pregunta Profesor",
      "respuestas": [
        {
          "creador": {
            "correo": "kenjoale@espol.edu.ec",
            "nombres": "KENNETH JOSUE",
            "apellidos": "ALEJANDRO SOLORZANO"
          },
          "destacada": false,
          "calificacion": 0,
          "paraleloId": "Skx34ud8CM",
          "preguntaId": "BygTNOO8CG",
          "texto": "Mi respuesta",
          "createdAt": "2018-05-14T02:45:08.951Z",
          "updatedAt": "2018-05-14T02:45:08.951Z",
          "id": "rJW6N_uICz"
        }
      ],
      "id": "BygTNOO8CG"
    }
  },
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Profesor calificar pregunta estudiante", method="PUT", url="/api/att/profesor/calificarPreguntaEstudiante"  %}


### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  preguntaId  | string  |    | 
|  calificacion  | numero  |    | 

### Response:

```json
{
  "estado": true,
  "datos": "La pregunta fue calificada correctamente",
  "codigoEstado": 200
}
```

### ERRORS:
__NO EXISTE PREGUNTA CON ESE ID__




_response_

```js
{
  "estado": false,
  "datos": "La pregunta con ese id no existe",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Profesor calificar respuesta estudiante", method="PUT", url="/api/att/profesor/calificarRespuestaEstudiante"  %}


### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| 
|  respuestaId  | string  |    | 
|  calificacion  | numero  |    | 

### Response:

```json
{
  "estado": true,
  "datos": "La respuesta fue calificada correctamente",
  "codigoEstado": 200
}
```

### ERRORS:
__NO EXISTE RESPUESTA CON ESE ID__




_response_

```js
{
  "estado": false,
  "datos": "La respuesta con ese id no existe",
  "codigoEstado": 200
}
```
	
	
{% endapi%}


{% api "Historial de un paralelo", method="GET", url="/api/att/profesor/historialParalelo/:paraleloId"  %}

Devuelve en orden de fechas, el mas reciente primero
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| paraleloId | string |    |
	

### Response:

```json
{
  "estado": true,
  "datos": [
    {
      "preguntasEstudiante": {
        "total": 1,
        "calificadas": 1
      },
      "fecha": "1970-01-02"
    },
    {
      "preguntasProfesor": [
        {
          "texto": "Pregunta Profesor 3",
          "id": "Hyu"
        }
      ],
      "fecha": "1970-01-01"
    },
    {
      "preguntasProfesor": [
        {
          "texto": "Pregunta Profesor",
          "id": "r1E_"
        },
        {
          "texto": "Pregunta Profesor 2",
          "id": "BJSu"
        }
      ],
      "preguntasEstudiante": {
        "calificadas": 0,
        "total": 2
      },
      "fecha": "1969-12-31"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Preguntas estudiantes por dia", method="GET", url="/api/att/profesor/preguntasEstudiantes/:paraleloId/:dia"  %}

Pregunta estudiante dado un dia
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| dia | string |  Ej: 2018-01-31, es con formato YYYY-MM-DD  |
	
| paraleloId | string |    |
	

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
      "calificacion": 0,
      "texto": "Mi primera pregunta 2",
      "createdAt": "2018-02-01T05:00:00.000Z",
      "id": "HyXu0RGlLz"
    }
  ],
  "codigoEstado": 200
}
```
{% endapi%}


{% api "Pregunta profesor por id", method="GET", url="/api/att/profesor/preguntaProfesor/:id"  %}


### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| id | string |    |
	

### Response:

```json
{
  "estado": true,
  "datos": {
    "creador": {
      "correo": "mheredia@espol.edu.ec",
      "tipo": "titular",
      "nombres": "TAMARA",
      "apellidos": "HEREDIA"
    },
    "respuestas": [
      {
        "creador": {
          "correo": "kenjoale@espol.edu.ec",
          "nombres": "KENNETH JOSUE",
          "apellidos": "ALEJANDRO SOLORZANO"
        },
        "id": "HyQd0CzlLG",
        "calificacion": 0,
        "texto": "Mi respuesstas de pregunta 3",
        "createdAt": "2018-02-01T05:00:00.000Z"
      }
    ],
    "texto": "Pregunta Profesor",
    "createdAt": "2018-02-01T05:00:00.000Z",
    "id": "HkM_RAGg8G"
  },
  "codigoEstado": 200
}
```
{% endapi%}



