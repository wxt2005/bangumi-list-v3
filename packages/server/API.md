# API

## Bangumi

### POST /api/v2/bangumi/update

### GET /api/v2/bangumi/season

```
?start=2013q4
```

```json
{
  "version": 1633008766334,
  "items": [
    "2021q1",
    "2021q2"
  ]
}
```

### GET /api/v2/bangumi/site

```
?type=onair
```


```json
{
  "bangumi": {
    "title": "番组计划",
    "urlTemplate": "https://bangumi.tv/subject/{{id}}",
    "type": "info"
  },
  "acfun": {
    "title": "AcFun",
    "urlTemplate": "https://www.acfun.cn/bangumi/aa{{id}}",
    "regions": ["CN"],
    "type": "onair"
  }
}
```

### GET /api/v2/bangumi/season/:season

* `:season`: 2021q1, 2020q2...

```json
{
  "id": 222,
  "title": "ぐんまちゃん",
  "titleTranslate": {
    "zh-Hans": [
      "群马酱"
    ]
  },
  "type": "tv",
  "lang": "ja",
  "officialSite": "https://gunmachan-official.jp/animation/",
  "begin": "2021-10-02T23:00:00.000Z",
  "broadcast": "R/2021-10-02T23:00:00.000Z/P7D",
  "end": "",
  "comment": "",
  "sites": [
    {
      "site": "bangumi",
      "id": "341168",
      "url": "https://bgm.tv/subject/297954"
    },
    {
      "site": "gamer",
      "id": "112046",
      "begin": "2021-04-10T18:38:00.000Z",
      "broadcast": "R/2021-04-10T18:38:00.000Z/P7D"
    },
    {
      "site": "muse_hk",
      "id": "PLuxqoToY7Uch24ToiTn-Yl1UyX7r-RFzB",
      "begin": "2021-04-10T18:38:00.000Z",
      "broadcast": "R/2021-04-10T18:38:00.000Z/P7D"
    }
  ]
}
```

## User

### POST /api/v2/user/login

```
username: xxxx
password: xxxx
```

### POST /api/v2/user/logout


### GET /api/v2/user/preference

```json
{
  "newOnly": false,
  "autoSwitch": false,
  "newTab": false,
  "japaneseTitle": false,
  "watchingOnly": false,
  "nextDay": 24,
  "bangumiDomain": "bangumi.tv",
  "hideSite": [
    "acfun"
  ]
}
```

### PUT /api/v2/user/preference

```json
{
  "newOnly": false,
  "autoSwitch": false,
  "newTab": false,
  "japaneseTitle": false,
  "watchingOnly": false,
  "nextDay": 24,
  "bangumiDomain": "bangumi.tv",
  "hideSite": [
    "acfun"
  ]
}
```


```json
{
  "hideSite": []
}
```

### PATCH /api/v2/user/preference

```json
{
  "newOnly": false
}
```

```json
{
  "hideSite": [
    "acfun"
  ]
}
```

### GET /api/v2/user/bangumi

```json
{
  "watching": [
    111,
    222
  ],
  "hide": [
    111,
    222
  ]
}
```

### PUT /api/v2/user/bangumi

```json
{
  "watching": []
}
```

### PATCH /api/v2/user/bangumi

```json
{
  "watching": [
    111
  ]
}
```

### DELETE /api/v2/user/bangumi

```json
{
  "watching": [
    111
  ]
}
```