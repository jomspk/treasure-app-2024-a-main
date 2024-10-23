export DATABASE_URL := postgresql://root:p@ssword@localhost:5432/treasure_app
export DATABASE_HOST := localhost
export DATABASE_NAME := treasure_app
export DATABASE_USER := root
export DATABASE_PASSWORD := p@ssword
export DATABASE_PORT := 5432

UNAME := $(shell uname -s)
BASE64_CMD := base64

ifeq ($(UNAME),Darwin)
ifneq ($(shell which gbase64 2>/dev/null),)
BASE64_CMD := gbase64
else
BASE64_CMD := base64 -i
endif
else
BASE64_CMD := base64
endif

export GOOGLE_SERVICE_ACCOUNT_KEY_JSON_BASE64 := $(shell $(BASE64_CMD) ./google_service_account_key.json 2>/dev/null || echo "")
export OPENAI_API_KEY := $(shell cat ./openai_api_key 2>/dev/null || echo "")

deps:
	npm install

start: deps
	npm run dev

test:
	npm run test

lint:
	npm run lint
