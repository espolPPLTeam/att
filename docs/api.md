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
  "paraleloId": "BJlB39S0nG",
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
    "paralelo": "BJlB39S0nG",
    "creador": {
      "correo": "kenjoale@espol.edu.ec",
      "nombres": "KENNETH JOSUE",
      "matricula": "201602281",
      "apellidos": "ALEJANDRO SOLORZANO"
    },
    "destacada": false,
    "id": "S1U3qBR2G"
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
  "preguntaId": "BygwhcHR3f",
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
        "id": "Hygun5rC3f"
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
        "id": "Hygun5rC3f"
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
    "paraleloId": "H1bt29B02M",
    "misPreguntasHoy": [
      {
        "texto": "Mi primera pregunta",
        "createdAt": "2018-04-25T18:36:33.317Z"
      }
    ],
    "preguntaProfesor": {
      "texto": "Pregunta Profesor",
      "preguntaId": "Hy939rC2M",
      "fechaCreadaPregunta": "2018-04-25T18:36:33.530Z",
      "fechaCreadaRespuesta": "2018-04-25T18:36:34.011Z",
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
  "paraleloId": "r1ZTn9BC3z",
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
    "id": "Sk02cHAhG"
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
  "paraleloId": "HkeRhcBAnG",
  "preguntaId": "BJlka9rAhz",
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
    "paraleloId": "HkeRhcBAnG",
    "preguntaId": "BJlka9rAhz",
    "texto": "Esta pregunta no tiene sentido",
    "createdAt": "2018-04-25T18:36:39.111Z",
    "updatedAt": "2018-04-25T18:36:39.111Z",
    "id": "BJbyT9HC3z"
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
  "respuestaId": "Hkl65BC3f",
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
  "preguntaId": "BkxZa9HCnf",
  "paraleloId": "BJxg6cHA2M",
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
    "paraleloId": "BJxg6cHA2M",
    "preguntaId": "BkxZa9HCnf",
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
        "paralelo": "SJeG6cS0hf",
        "createdAt": "2018-04-25T18:36:42.475Z",
        "updatedAt": "2018-04-25T18:36:42.475Z",
        "id": "HkfM6qS02M"
      }
    ],
    "preguntaProfesor": {
      "creador": {
        "correo": "mheredia@espol.edu.ec",
        "tipo": "titular",
        "nombres": "TAMARA",
        "apellidos": "HEREDIA"
      },
      "createdAt": "2018-04-25T18:36:42.707Z",
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
          "paraleloId": "SJeG6cS0hf",
          "preguntaId": "HymacHA2G",
          "texto": "Mi respuesta",
          "createdAt": "2018-04-25T18:36:42.918Z",
          "updatedAt": "2018-04-25T18:36:42.918Z",
          "id": "B1g769BChf"
        }
      ],
      "id": "HymacHA2G"
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



