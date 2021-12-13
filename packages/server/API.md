# API

## Bangumi

### POST /api/v1/bangumi/update

### GET /api/v1/bangumi/season

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

### GET /api/v1/bangumi/site

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

### GET /api/v1/bangumi/archive/:season

* `:season`: 2021q1, 2020q2...

```json
{
  "id": "ba98fe6f3ebf0d1f5cfd1c2249c2b229",
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

### GET /api/v1/bangumi/onair

```json
{
  "id": "ba98fe6f3ebf0d1f5cfd1c2249c2b229",
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

### POST /api/v1/user/signup

```json
{
  "email": "mail@example.com",
  "password": "passowrd"
}
```

### POST /api/v1/user/login

```json
{
  "email": "mail@example.com",
  "password": "passowrd"
}
```

```json
{
  "token": "xxx"
}
```

### POST /api/v1/user/logout

### GET /api/v1/user/me

```json
{
  "id": "c6943395537863ad80b325882e7993e7",
  "email": "mail@example.com"
}
```

### PATCH /api/v1/user/me

```json
{
  "oldPassword": "xxx",
  "newPassword": "xxx"
}
```

## Preference

### GET /api/v1/preference/common

```json
{
  "newOnly": false,
  "autoSwitch": false,
  "newTab": false,
  "japaneseTitle": false,
  "watchingOnly": false,
  "nextDay": 24,
  "bangumiDomain": "bangumi.tv",
  "hiddenSite": [
    "acfun"
  ]
}
```

### PATCH /api/v1/preference/common

```json
{
  "newOnly": false
}
```

```json
{
  "hiddenSite": [
    "acfun"
  ]
}
```

### GET /api/v1/preference/bangumi

```
?season=2013q4
```

```json
{
  "watching": [
    111,
    222
  ],
  "hidden": [
    111,
    222
  ]
}
```

### PATCH /api/v1/preference/bangumi

```
?season=2013q4
```

```json
{
  "watching": [
    111
  ]
}
```
