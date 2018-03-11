# Api DOCS

{{blockInicio}} api "{{ nombre }}", method="{{ metodo }}", url="{{ url }}" {{blockFin}}

{{ descripcion }}

```json
{{ persona }}
```
{% if params %}
### Params:
| Name       | Type    | Desc                                                |
| :--------- | :------ | :-------------------------------------------------- |
| correoProfesor | String  |                        |
{% endif %}

{% if body %}
### Body:
| Name       | Type    | Desc                                                |
| :--------- | :------ | :-------------------------------------------------- |
| nombres | String  |                        |
{% endif %}

{% if request %}
### Request:

```json
{
	nombres: 'joel'
}
```
{% endif %}

{% if response %}
### Response:

```json
{
	nombres: 'joel'
}
```
{% endif %}

{{blockInicio}} endapi {{blockFin}}