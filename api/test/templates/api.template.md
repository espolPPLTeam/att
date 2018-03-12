# Api DOCS
{% for doc in docs %}

{{blockInicio}} api "{{ doc.nombre }}", method="{{ doc.metodo }}", url="{{ doc.url }}" {{blockFin}}

{{ doc.descripcion }}

{% if doc.params %}
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| {% for params in doc.params %}
| {{params.nombre}} | {{params.tipo}} |  {{params.descripcion}}  | {% endfor %}
{% endif %}

{% if doc.body %}
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------| {% for body in doc.body %}
| {%if body.margen %}<{{body.margen}}> {{body.nombre}} </{{body.margen}}>{% else %} {{body.nombre}} {% endif %} | {{body.tipo}}  |  {{body.descripcion}}  | {% endfor %}
{% endif %}

{% if doc.request %}
### Request:

```json
{{ doc.request }}
```
{% endif %}

{% if doc.response %}
### Response:

```json
{{ doc.response }}
```
{% endif %}


### ERRORS:
{% if doc.errors %}
	{% for error in doc.errors %}
__{{ error.nombre }}__

{{ error.descripcion }}

{% if error.request %}
_request_

```js
{{ error.request }}
```
{% endif %}

{% if error.response %}
_response_

```js
{{ error.response }}
```
{% endif %}

	{% endfor %}
{% endif %}

{{blockInicio}} endapi {{blockFin}}

{% endfor %}

