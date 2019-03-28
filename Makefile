pwd = $(shell pwd)
docker-run-nodejs = docker run -ti --rm -v=$(pwd):/usr/src/service/ -w=/usr/src/service --env-file=./.env node

install:
		$(docker-run-nodejs) npm i

models:
		docker exec -ti node node ./scripts/models.js

query:
		docker exec -ti node node ./scripts/queries.js

migration:
		docker exec -ti node node ./scripts/migration.js

dev:
		docker-compose up
