#!/bin/sh

# Ensure the log directory exists before the server opens its log file
mkdir -p "${LOG_DIR:-${RUNTIME_DIR:-packages/server/.run}/logs}"

HOST=127.0.0.1 PORT=3001 npm run start -w packages/server &
HOST=127.0.0.1 PORT=3000 API_HOST=http://127.0.0.1:3001 npm run start -w packages/client &

wait

exit $?
