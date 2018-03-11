# Api DOCS
{% for doc in docs %}

{{blockInicio}} api "{{ doc.nombre }}", method="{{ doc.metodo }}", url="{{ doc.url }}" {{blockFin}}

{{ doc.descripcion }}

{% if doc.params %}
	{% for params in doc.params %}
### Params:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| {{params.nombre}} | {{params.tipo}}  |  {{params.descripcion}}  |
	{% endfor %}
{% endif %}

{% if doc.body %}
	{% for body in doc.body %}
### Body:
| Name       | Type    | Desc |
| :--------- | :------ | :-------|
| {{body.nombre}} | {{body.tipo}}  |  {{body.descripcion}}  |
	{% endfor %}
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

{{blockInicio}} endapi {{blockFin}}

{% endfor %}