.PHONY: help install dev build preview deploy clean generate-index test test-watch test-ui test-coverage
.PHONY: docker-build docker-dev docker-dev-bg docker-test docker-test-watch docker-test-coverage docker-down docker-clean docker-logs docker-shell docker-rebuild

help:
	@echo "Available commands:"
	@echo ""
	@echo "Local Development:"
	@echo "  make install        - Install dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build for production"
	@echo "  make preview        - Preview production build"
	@echo "  make deploy         - Deploy to GitHub Pages"
	@echo "  make generate-index - Generate brands index from YAML files"
	@echo "  make test           - Run all tests"
	@echo "  make test-watch     - Run tests in watch mode"
	@echo "  make test-ui        - Run tests with UI"
	@echo "  make test-coverage  - Run tests with coverage report"
	@echo "  make clean          - Clean build artifacts"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build         - Build Docker images"
	@echo "  make docker-dev           - Start development server in Docker"
	@echo "  make docker-dev-bg        - Start dev server in background"
	@echo "  make docker-test          - Run tests in Docker"
	@echo "  make docker-test-watch    - Run tests in watch mode"
	@echo "  make docker-test-coverage - Run tests with coverage"
	@echo "  make docker-down          - Stop Docker containers"
	@echo "  make docker-clean         - Remove containers, volumes, and images"
	@echo "  make docker-logs          - Show Docker logs"
	@echo "  make docker-shell         - Open shell in dev container"
	@echo "  make docker-rebuild       - Rebuild and restart containers"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

deploy:
	npm run deploy

generate-index:
	npm run generate-index

test:
	npm test

test-watch:
	npm run test:watch

test-ui:
	npm run test:ui

test-coverage:
	npm run test:coverage

clean:
	rm -rf dist node_modules coverage

# Docker Commands
docker-build:
	docker-compose build --no-cache

docker-dev:
	docker-compose up dev

docker-dev-bg:
	docker-compose up -d dev

docker-test:
	docker-compose run --rm test

docker-test-watch:
	docker-compose run --rm test npm run test:watch

docker-test-coverage:
	docker-compose run --rm test npm run test:coverage

docker-down:
	docker-compose down

docker-clean:
	docker-compose down -v --rmi local

docker-logs:
	docker-compose logs -f dev

docker-shell:
	docker-compose run --rm dev sh

docker-rebuild:
	docker-compose down && docker-compose build --no-cache && docker-compose up dev
