#!/bin/sh

npm install
npm run build -w packages/server
API_HOST=http://127.0.0.1:3001 npm run build -w packages/client
