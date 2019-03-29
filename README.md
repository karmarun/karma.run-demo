# KARMA DEMO

## setup dev environment
* `make install` runs npm install in the docker image
* `docker-compose up`

## models
* `make models` runs scripts/models.js

## queries
* `make queries` runs scripts/queries.js

## maigration
* `make migration` runs scripts/migration.js

## export db
* `make export` runs scripts/export.js

## karma editor
* open http://localhost:3000
* please rebuild the docker image if you've made changes in the editor.(client|server).config.ts files