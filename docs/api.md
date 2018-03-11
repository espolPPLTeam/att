{% api "Profesores Obtener Datos", method="GET", url="/api/att/profesor/paralelos/:profesorCorreo %}

Obtiene los datos basicos de los profesores incluido los paralelos que esta asignado

### Params:
| Name       | Type    | Desc                                                |
| :--------- | :------ | :-------------------------------------------------- |
| correoProfesor | String  |                        |
### Response:

```json
{
	nombres: 'joel'
}
```

{% endapi %}

{% api "Preguntas Estudiantes Hoy", method="GET", url="/api/att/profesor/paralelos" %}
{% endapi %}

{% api "Crear Pregunta", method="POST", url="/api/att/profesor/paralelos" %}
{% endapi %}

{% api "Destacar pregunta destacarPregunta", method="PUT", url="/api/att/profesor/paralelos" %}
{% endapi %}

<!-- # GET Profesores Obtener Datos

__URL__ 

```txt
/api/att/profesor/paralelos
```

__QUERY PARAMS__

__ESQUEMA__

_response_

{% include "./mocks/profesoresDatos.md" %}

# GET Preguntas Estudiantes Hoy

# POST Crear Pregunta

# PUT Destacar pregunta destacarPregunta -->

<!-- 
_request_

```js
```

__BODY__ -->

<!-- {% api "List App Pages", method="POST", url="https://www.magloft.com/api/portal/v1/app_pages/:app_id/page/:page" %}

This endpoint **returns** a list of all `app pages` that belong to the magazine

### Parameters:

| Name       | Type    | Desc                                                |
| :--------- | :------ | :-------------------------------------------------- |
| **app_id** | String  | App ID to list app pages for                        |
| **page**   | Integer | The page to list                                    |
| per_page   | Integer | Number of items to show per page                    |
| order_by   | Symbol  | Field to sort results by                            |
| order_dir  | Symbol  | Direction (asc, desc) to sort results by            |
| filter     | String  | Text filter to search pages by name, title and html |

### Response:

```json
{
  "id": 1234,
  "title": "Welcome to MagLoft"
}
```

{% endapi %} -->