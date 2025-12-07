# bangumi-list-v3

## Development

```bash
$ npm install
$ cp packages/server/.env.example packages/server/.env
$ npm run dev
```

* Client pages hosted on `http://localhost:3000/`
* Server API hosted on `http://localhost:3000/api/v1/`. Please check [API Doc](./packages/server/API.md)
* For working with Prisma ORM and database migrations, see [Prisma Development Guide](./packages/server/PRISMA.md)

## Install dependency

```bash
$ npm install local-dependency -w packages/client
$ npm install shared-dependency
```

## Release

```bash
$ npm run build
$ npm run start
```

## Docker

```bash
$ docker build --tag wxt2005/bangumi-list-v3:latest --build-arg GA_ID=UA-xxx .
$ docker run -p 3000:3000 --env-file .env  -v /path/to/run:/app/.run -d wxt2005/bangumi-list-v3
```
