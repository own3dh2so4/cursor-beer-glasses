.PHONY: help install dev build preview deploy clean generate-index test test-watch test-ui test-coverage

help:
	@echo "Available commands:"
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

