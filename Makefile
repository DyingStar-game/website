# =============================================================================
# DyingStar Website - Makefile
# =============================================================================

# Colors for output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

EXECUTOR := docker compose

# if podman is available, use it instead of docker
ifneq (, $(shell which podman 2>/dev/null))
$(info ❗❗ Using podman for compose commands❗❗)
EXECUTOR := podman compose
endif

COMPOSE := $(EXECUTOR) -f docker/docker-compose.yml

DEV_SERVICE := dev
APP_SERVICE := app
MEILISEARCH_SERVICE := meilisearch

# =============================================================================
# CP/PO/Others Profile - Simple site testing
# =============================================================================

.PHONY: start
start: ## Start the complete application (install, build, start) for testing
	@echo "$(CYAN)🚀 Starting DyingStar Website for testing...$(RESET)"
	@echo "$(YELLOW)This will install dependencies, build, and start the application$(RESET)"
	@$(COMPOSE) up $(APP_SERVICE) --build

.PHONY: stop
stop: ## Stop all running services
	@echo "$(CYAN)🛑 Stopping all services...$(RESET)"
	@$(COMPOSE) down

# =============================================================================
# Dev Profile - Development commands
# =============================================================================

.PHONY: up
up: ## Start only MeiliSearch for development (no app)
	@echo "$(CYAN)🔧 Starting development environment (MeiliSearch only)...$(RESET)"
	@$(COMPOSE) up $(MEILISEARCH_SERVICE) $(DEV_SERVICE) -d
	@echo "$(GREEN)✅ Development environment ready!$(RESET)"
	@echo "$(YELLOW)MeiliSearch: http://localhost:7700$(RESET)"
	@echo "$(YELLOW)Use 'make pnpm <command>' to run pnpm commands$(RESET)"

.PHONY: down
down: ## Stop development environment
	@echo "$(CYAN)🛑 Stopping development environment...$(RESET)"
	@$(COMPOSE) down

# Generic pnpm command runner
.PHONY: pnpm
pnpm: ## Run any pnpm command (usage: make pnpm install, make pnpm dev, etc.)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)❌ Please provide a pnpm command. Usage: make pnpm <command>$(RESET)"; \
		echo "$(YELLOW)Examples: make pnpm install, make pnpm dev, make pnpm build$(RESET)"; \
		exit 1; \
	fi
	@echo "$(CYAN)📦 Running: pnpm $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
	@$(COMPOSE) exec $(DEV_SERVICE) sh -c "corepack enable && corepack install && pnpm $(filter-out $@,$(MAKECMDGOALS))"

# News sync from Discord. Runs on the host (not in Docker) because it relies on
# the local `claude` CLI. Flags go through ARGS, make would parse them otherwise.
.PHONY: news-sync
news-sync: ## Import Discord #news posts as MDX (usage: make news-sync ARGS="--dry-run --limit=1")
	@echo "$(CYAN)📰 Running: pnpm news:sync $(ARGS)$(RESET)"
	@pnpm news:sync $(ARGS)

# =============================================================================
# Utility commands
# =============================================================================

.PHONY: logs
logs: ## Show logs for all services
	@$(COMPOSE) logs -f

.PHONY: logs-app
logs-app: ## Show logs for app service only
	@$(COMPOSE) logs -f $(APP_SERVICE)

.PHONY: logs-dev
logs-dev: ## Show logs for dev service only
	@$(COMPOSE) logs -f $(DEV_SERVICE)

.PHONY: logs-meilisearch
logs-meilisearch: ## Show logs for MeiliSearch only
	@$(COMPOSE) logs -f $(MEILISEARCH_SERVICE)

.PHONY: shell
shell: ## Open shell in dev container
	@echo "$(CYAN)🐚 Opening shell in dev container...$(RESET)"
	@$(COMPOSE) exec $(DEV_SERVICE) sh

.PHONY: status
status: ## Show status of all services
	@echo "$(CYAN)📊 Service Status:$(RESET)"
	@$(COMPOSE) ps

.PHONY: clean-volumes
clean-volumes: ## Remove all volumes (WARNING: This will delete all data!)
	@echo "$(RED)⚠️  This will delete all Docker volumes and data!$(RESET)"
	@read -p "Are you sure? (y/N) " answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		$(COMPOSE) down -v; \
		echo "$(GREEN)✅ Volumes cleaned$(RESET)"; \
	else \
		echo "$(YELLOW)Cancelled$(RESET)"; \
	fi

# =============================================================================
# Help
# =============================================================================

.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)DyingStar Website - Available Commands:$(RESET)"
	@echo ""
	@echo "$(YELLOW)CP/PO/Others Profile (Simple Testing):$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(start|stop)"
	@echo ""
	@echo "$(YELLOW)Dev Profile (Development):$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(up|down|pnpm|news-sync)"
	@echo ""
	@echo "$(YELLOW)Utilities:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | grep -E "(logs|shell|status|clean-volumes)"
	@echo ""
	@echo "$(YELLOW)Examples:$(RESET)"
	@echo "  $(CYAN)make start$(RESET)           # Start app for testing (CP/PO/Others)"
	@echo "  $(CYAN)make up$(RESET)             # Start dev environment (Dev)"
	@echo "  $(CYAN)make pnpm dev$(RESET)       # Start Next.js dev server"
	@echo "  $(CYAN)make pnpm build$(RESET)     # Build the application"
	@echo "  $(CYAN)make install$(RESET)        # Install dependencies"

# Default target
.DEFAULT_GOAL := help

# Allow arguments to be passed to make commands
%:
	@: