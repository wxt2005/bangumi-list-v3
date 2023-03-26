#!/bin/sh

HOST=127.0.0.1 PORT=3001 npm run start -w packages/server &
HOST=127.0.0.1 PORT=3000 API_HOST=http://127.0.0.1:3001 npm run start -w packages/next &

wait -n

exit $?
