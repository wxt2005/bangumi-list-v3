# syntax=docker/dockerfile:1

FROM node:19-alpine

ARG GA_ID

ENV TZ=Asia/Shanghai
ENV NEXT_PUBLIC_GA_ID=${GA_ID}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY . .

EXPOSE 3000

RUN ./build.sh

CMD [ "/bin/sh", "./start.sh" ]
