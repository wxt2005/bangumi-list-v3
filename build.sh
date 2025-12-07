#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

npm install
npm run build -w packages/server
API_HOST=http://127.0.0.1:3001 npm run build -w packages/client
