DOCKER_COMPOSE := docker compose
DB_SERVICE:=db
MIGRATION_SERVICE:=migration
BACKEND_SERVICE:=backend
DB_NAME := treasure_app
DB_PORT := 5432
DB_USER := root
DB_PASSWORD := p@ssword
FLYWAY_CONF?=-url=jdbc:postgresql://$(DB_SERVICE):$(DB_PORT)/$(DB_NAME) -user=$(DB_USER) -password=$(DB_PASSWORD)

code:
	code app.code-workspace

setup/first: check-local-environment compose/up migrate/up openapi/generate

compose/up: 
	$(DOCKER_COMPOSE) up -d

run/backend:
	make -C backend start

run/frontend:
	make -C frontend/ start

lint/backend:
	make -C backend lint

lint/frontend:
	make -C frontend lint

.PHONY: compose/down
compose/down:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans --rmi local

.PHONY: compose/logs
compose/logs:
	$(DOCKER_COMPOSE) logs -f

.PHONY: psql
psql:
	$(DOCKER_COMPOSE) exec $(DB_SERVICE) psql -U $(DB_USER) -d $(DB_NAME)

exec/sql-seed:
	for file in $(shell ls database/seed); do \
		make exec/sql SQL_FILE_PATH=database/seed/$$file; \
	done

SQL_FILE_PATH :=
exec/sql:
	$(DOCKER_COMPOSE) exec $(DB_SERVICE) psql -U $(DB_USER) -d $(DB_NAME) -f $(SQL_FILE_PATH)

.PHONY: migrate/info
migrate/info:
	$(DOCKER_COMPOSE) run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) -locations="filesystem:./sql" info

.PHONY: migrate/up
migrate/up:
	$(DOCKER_COMPOSE) run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) -locations="filesystem:./sql" migrate

.PHONY: migrate/repair
migrate/repair:
	$(DOCKER_COMPOSE) run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) -locations="filesystem:./sql" repair

.PHONY: openapi/generate
openapi/generate: openapi/generate/backend openapi/generate/frontend

.PHONY: openapi/generate/backend
openapi/generate/backend:
	npx openapi-typescript@6.7.6 openapi/openapi.yaml --output backend/src/openapi/schema.ts

.PHONY: openapi/generate/frontend
openapi/generate/frontend:
	npx openapi-typescript@6.7.6 openapi/openapi.yaml --output frontend/src/openapi/schema.ts

check-local-environment:
	@echo "🐳 Treasure 2024 動作環境チェック (エラーが出た場合は README.md を確認してください) 🦀"
	@echo
	@(which node && node --version | grep ^v22) > /dev/null && echo "✅ Node.js "`node --version` || echo "❌ Node.js: Node.js のバージョンは v22.x でなくてはなりません (現在のバージョン: `node --version`)"
	@which gcc > /dev/null && echo "✅ gcc" || echo "❌ gcc がインストールされていません"
	@which make > /dev/null && echo "✅ make" || echo "❌ make がインストールされていません"
	@which docker > /dev/null && echo "✅ docker" || echo "❌ docker がインストールされていません"


.PHONY: ecs/*

GROUP   :=
TASK_ID := $(shell aws-vault exec treasure-$(GROUP) -- aws ecs list-tasks --cluster $(GROUP) --service-name $(GROUP) --query 'taskArns[0]')

ecs/exec:
	aws-vault exec treasure-${GROUP} -- aws ecs execute-command \
	--cluster ${GROUP} \
	--task ${TASK_ID} \
	--container "${GROUP}-backend" \
	--interactive \
	--command /bin/sh
