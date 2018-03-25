# Api DOCS
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
        "_id": "H1wAKcB5G",
        "correo": "kenjoale@espol.edu.ec",
        "nombres": "KENNETH JOSUE",
        "apellidos": "ALEJANDRO SOLORZANO"
      },
      "destacada": false,
      "_id": "SJd0KcS5f",
      "texto": "Mi primera pregunta estudiante 1",
      "paralelo": "H1wAKcB5G",
      "createdAt": "2018-03-25T21:51:11.625Z",
      "updatedAt": "2018-03-25T21:51:11.625Z"
    },
    {
      "creador": {
        "_id": "H1wAKcB5G",
        "correo": "johelsar@espol.edu.ec",
        "nombres": "JOHARA ELVIRA",
        "apellidos": "SARMIENTO TAPIA"
      },
      "destacada": false,
      "_id": "S1xd0Ycr5G",
      "texto": "Mi primera pregunta estudiante 2",
      "paralelo": "H1wAKcB5G",
      "createdAt": "2018-03-25T21:51:11.825Z",
      "updatedAt": "2018-03-25T21:51:11.825Z"
    }
  ],
  "codigoEstado": 200
}
```



### ERRORS:
{% endapi%}



