# Api DOCS


{% api "Profesores Obtener Datos", method="GET", url="/api/att/profesor/paralelos/:profesorCorreo" %}

Da los paralelos para que se pueda escribir en la pagina principal los paralelos


	
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| profesorCorreo | String  |   ---   |
	







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
        "_id": "rJvzzffKz",
        "curso": "2",
        "nombre": "FÍSICA II"
      }
    ]
  },
  "codigoEstado": 200
}
```


{% endapi %}

