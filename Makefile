pwd = $(shell pwd)
docker-run-nodejs = docker run -ti --rm -v=$(pwd):/usr/src/service/ -w=/usr/src/service --env-file=./.env node

install:
		$(docker-run-nodejs) npm i

models:
		docker exec -ti node node ./scripts/models.js

queries:
		docker exec -ti node node ./scripts/queries.js

migration:
		docker exec -ti node node ./scripts/migration.js

export:
		docker exec -ti node node ./scripts/export.js

import:
		docker exec -ti node node ./scripts/import.js

dev:
		docker-compose up
