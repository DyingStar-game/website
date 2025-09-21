# Colors
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RESET := \033[0m

# Docker commands
DOCKER_RUN := docker run --rm -v $(shell pwd):/app -u $(shell id -u):$(shell id -g) -w /app
DOCKER_NODE := $(DOCKER_RUN) node:22-alpine
DOCKER_COMPOSE := docker compose -f docker/docker-compose.yml

# Check if node_modules exists
NODE_MODULES_EXISTS := $(shell test -d node_modules && echo 1 || echo 0)

# Check if .env file exists
ENV_FILE_EXISTS := $(shell test -f .env.local -o -f .env && echo 1 || echo 0)

# Function to ensure node_modules exists
define ensure_node_modules
	@if [ ! -d "node_modules" ]; then \
		echo "$(YELLOW)Node modules not found. Installing dependencies...$(RESET)"; \
		$(DOCKER_NODE) npm ci --progress=true; \
		echo "$(GREEN)Dependencies installed successfully.$(RESET)"; \
	fi
endef

# Function to ensure .env file exists
define ensure_env_file
	@if [ "$(ENV_FILE_EXISTS)" = "0" ]; then \
		echo "$(YELLOW)No .env file found. You need to create one for the application to work properly.$(RESET)"; \
		echo "$(YELLOW)You can create it by copying the .env.example file:$(RESET)"; \
		echo "$(CYAN)cp .env.example .env.local$(RESET)"; \
		echo "$(YELLOW)Then edit it to set your environment variables.$(RESET)"; \
		read -p "Do you want to create .env.local from .env.example now? (y/n) " answer; \
		if [ "$$answer" = "y" ]; then \
			cp .env.example .env.local; \
			echo "$(GREEN).env.local created from .env.example. Please edit it with your configuration.$(RESET)"; \
		else \
			echo "$(YELLOW)Please create a .env file before running the application.$(RESET)"; \
			exit 1; \
		fi; \
	fi
endef

install-node-modules:
	@$(ensure_node_modules)

# Run development server
.PHONY: start-dev dev
start-dev dev:
	@echo "$(CYAN)Starting development server...$(RESET)"
	$(call ensure_node_modules)
	$(call ensure_env_file)
	@UID=$(shell id -u) GID=$(shell id -g) COMPOSE_BAKE=true $(DOCKER_COMPOSE) build --no-cache
	@UID=$(shell id -u) GID=$(shell id -g) COMPOSE_BAKE=true $(DOCKER_COMPOSE) up

# Build the application
.PHONY: build
build:
	@echo "$(CYAN)Building the application...$(RESET)"
	$(call ensure_node_modules)
	$(call ensure_env_file)
	$(DOCKER_NODE) npm run build

# Clean build artifacts
.PHONY: clean
clean:
	@echo "$(CYAN)Cleaning build artifacts...$(RESET)"
	$(call ensure_node_modules)
	$(DOCKER_NODE) npm run clean

# Add a dependency
.PHONY: add-dependency
add-dependency:
	@echo "$(CYAN)Adding dependency: $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
	$(call ensure_node_modules)
	$(DOCKER_NODE) npm install $(filter-out $@,$(MAKECMDGOALS)) --progress=true
	@echo "$(GREEN)✅ Dependencies added successfully!$(RESET)"
	@exit 0

# Add a dev dependency
.PHONY: add-dev-dependency
add-dev-dependency:
	@echo "$(CYAN)Adding dev dependency: $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
	$(call ensure_node_modules)
	$(DOCKER_NODE) npm install --save-dev $(filter-out $@,$(MAKECMDGOALS)) --progress=true
	@echo "$(GREEN)✅ Dev dependencies added successfully!$(RESET)"
	@exit 0

# Remove a dependency (works for both regular and dev dependencies)
.PHONY: rm-dependency
rm-dependency:
	@echo "$(CYAN)Removing dependency: $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
	$(call ensure_node_modules)
	$(DOCKER_NODE) npm uninstall $(filter-out $@,$(MAKECMDGOALS)) --progress=true
	@echo "$(GREEN)✅ Dependencies removed successfully!$(RESET)"
	@exit 0

# Run linter
.PHONY: lint
lint:
	@echo "$(CYAN)Running linter...$(RESET)"
	$(call ensure_node_modules)
	$(DOCKER_NODE) npm run lint

# Special rule to handle arguments passed to make command
# This is needed for the filter-out approach to work correctly
%:
	@: