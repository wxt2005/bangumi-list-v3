# syntax=docker/dockerfile:1

FROM node:20.18.0-bookworm

ARG GA_ID

ENV TZ=Asia/Shanghai
ENV NEXT_PUBLIC_GA_ID=${GA_ID}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app
COPY . .

EXPOSE 3000

RUN ./build.sh

CMD [ "/bin/sh", "./start.sh" ]
