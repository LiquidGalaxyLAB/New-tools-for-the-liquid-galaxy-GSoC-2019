# Manage KML

## List KML's

```js
lgKML.get('/kml/manage/list')
```
Return the kml list:
```json
[
  {
      "id": 0,
      "name": "kml.kml",
      "path": "/home/xemyst/kmlApi/kml.kml"
  },
  {
      "id": 1,
      "name": "send.kml",
      "path": "/home/xemyst/kmlApi/send.kml"
  },
  {
      "id": 1,
      "name": "send2.kml",
      "path": "/home/xemyst/kmlApi/send2.kml"
  },
]
```

## Get current KML

```js
lgKML.get('/kml/manage/current')
```
Return the id of the current KML

## Change current KML

```js
lgKML.put('/kml/manage/:id')
```
Return a "OKAY" to confirm the change operation

## Update KML List

```js
lgKML.put('/kml/manage')
```
Return the updated kml list

```json
[
    {
        "id": 0,
        "name": "kml.kml",
        "path": "/home/xemyst/kmlApi/kml.kml"
    },
    {
        "id": 1,
        "name": "send.kml",
        "path": "/home/xemyst/kmlApi/send.kml"
    },
    {
        "id": 2,
        "name": "send2.kml",
        "path": "/home/xemyst/kmlApi/send2.kml"
    }
]
```

## Delete one KML

```js
lgKML.delete('/kml/manage/:id')
```
will return the new kml list

```json
[
    {
        "id": 0,
        "name": "kml.kml",
        "path": "/home/xemyst/kmlApi/kml.kml"
    },
    {
        "id": 1,
        "name": "send.kml",
        "path": "/home/xemyst/kmlApi/send.kml"
    }
]
```
