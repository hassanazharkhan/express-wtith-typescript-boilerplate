#!/usr/bin/env bash

X_ENV=$(node -r ts-node/register -e 'console.log(require("./src/config.ts").default.env)')
X_DB_HOST=$(node -r ts-node/register -e 'console.log(require("./src/config.ts").default.database.host)')
X_DB_PORT=$(node -r ts-node/register -e 'console.log(require("./src/config.ts").default.database.port)')

./wait-for-it.sh $X_DB_HOST:$X_DB_PORT

[[ "$X_ENV" == "development" ]] && npm run typeorm schema:sync

npm run typeorm migration:run && \
  eval "$@"
