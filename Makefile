# Raccourcis de developpement ROBOMOW TYCOON
.PHONY: help install dev dev-down build test lint typecheck format clean db-reset db-studio logs

help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Installe toutes les dependances npm
	npm install

dev: ## Lance la stack complete (postgres + backend + frontend) via docker compose
	docker compose up

dev-down: ## Arrete la stack docker
	docker compose down

dev-clean: ## Arrete et supprime volumes (DB reset)
	docker compose down -v

build: ## Build tous les workspaces
	npm run build

test: ## Execute tous les tests
	npm run test

lint: ## Lint tous les workspaces
	npm run lint

typecheck: ## Type-check tous les workspaces
	npm run typecheck

format: ## Formate avec Prettier
	npm run format

clean: ## Nettoie node_modules et dist
	rm -rf node_modules **/node_modules **/dist **/build **/coverage

db-reset: ## Reset complet de la DB (migrations + seed)
	docker compose exec backend npx prisma migrate reset --schema=prisma/schema.prisma --force

db-studio: ## Ouvre Prisma Studio
	docker compose exec backend npx prisma studio --schema=prisma/schema.prisma

logs: ## Suit les logs backend
	docker compose logs -f backend
