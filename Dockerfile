# syntax=docker/dockerfile:1

FROM node:17-alpine

ARG GA_ID

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY . .

EXPOSE 3000

RUN npm install && npm run build
RUN npm prune --production

CMD [ "npm", "start" ]
