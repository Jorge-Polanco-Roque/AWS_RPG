# The Architect's Codex - Makefile
# Convenient commands for managing the cosmic horror AWS study game

.PHONY: help install build start start-dev start-prod stop clean logs test backup deploy status

# Colors
PURPLE = \033[0;35m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m

# Default target
help: ## Show this help message
	@echo -e "$(PURPLE)"
	@echo " _____ _            _            _     _ _            _   _       "
	@echo "|_   _| |_ ___     /_\\  _ _ __ _| |_ _| |_ ___ __ _ __| |_( )___  "
	@echo "  | | | ' \\/ -_)   / _ \\| '_/ _| ' \\| |  _/ -_) _| |  _|/(_-<  "
	@echo "  |_| |_||_\\___|  /_/ \\_\\_| \\__|_||_|_|\\__\\___\\__|_|\\__| /__/  "
	@echo ""
	@echo "   ___              _      ___         _           "
	@echo "  / __|___ ___ _ __ (_)__  / __|___  __| |_____ __ "
	@echo " | (__/ _ (_-< '  \\| / _| | (__/ _ \\/ _\\` / -_) \\ / "
	@echo "  \\___\\___/__/_|_|_|_\\__|  \\___\\___/\\__,_\\___/_\\_\\ "
	@echo -e "$(NC)"
	@echo -e "$(GREEN)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies for both server and client
	@echo -e "$(YELLOW)🔮 Installing cosmic dependencies...$(NC)"
	npm install
	cd client && npm install
	@echo -e "$(GREEN)✅ Dependencies installed!$(NC)"

build: ## Build the application
	@echo -e "$(YELLOW)🔨 Building the cosmic application...$(NC)"
	docker-compose build
	@echo -e "$(GREEN)✅ Build completed!$(NC)"

start: ## Start the application (quick start on port 3030)
	@echo -e "$(YELLOW)🚀 Quick starting The Architect's Codex on port 3030...$(NC)"
	docker-compose up -d
	@echo -e "$(GREEN)✅ Application started!$(NC)"
	@echo -e "$(BLUE)📡 Access at: http://localhost:3030$(NC)"

start-dev: ## Start in development mode with live reload
	@echo -e "$(YELLOW)👨‍💻 Starting development environment...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo -e "$(GREEN)✅ Development environment started!$(NC)"
	@echo -e "$(BLUE)📡 Backend: http://localhost:3030$(NC)"
	@echo -e "$(BLUE)🌐 Frontend: http://localhost:3000$(NC)"
	@echo -e "$(BLUE)🗄️  PgAdmin: http://localhost:5050$(NC)"

start-prod: ## Start in production mode with full stack
	@echo -e "$(YELLOW)🏭 Starting production environment...$(NC)"
	@if [ ! -f .env ]; then \
		echo -e "$(YELLOW)⚠️  Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
		echo -e "$(YELLOW)⚠️  Please configure .env file before running again!$(NC)"; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml up -d
	@echo -e "$(GREEN)✅ Production environment started!$(NC)"
	@echo -e "$(BLUE)📡 Application: http://localhost:3030$(NC)"
	@echo -e "$(BLUE)🌐 Nginx: http://localhost:80$(NC)"

stop: ## Stop all services
	@echo -e "$(YELLOW)🛑 Stopping all cosmic services...$(NC)"
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.prod.yml down
	@echo -e "$(GREEN)✅ All services stopped!$(NC)"

clean: ## Clean up containers, images, and volumes
	@echo -e "$(YELLOW)🧹 Cleaning up the cosmic realm...$(NC)"
	@echo -e "$(YELLOW)⚠️  This will remove all data! Continue? [y/N]$(NC)" && read ans && [ $${ans:-N} = y ]
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f
	@echo -e "$(GREEN)✅ Cleanup completed!$(NC)"

logs: ## View application logs
	@echo -e "$(YELLOW)📊 Viewing cosmic logs...$(NC)"
	docker-compose logs -f

logs-dev: ## View development logs
	@echo -e "$(YELLOW)📊 Viewing development logs...$(NC)"
	docker-compose -f docker-compose.dev.yml logs -f

logs-prod: ## View production logs
	@echo -e "$(YELLOW)📊 Viewing production logs...$(NC)"
	docker-compose -f docker-compose.prod.yml logs -f

status: ## Check status of all services
	@echo -e "$(YELLOW)🔍 Checking cosmic service status...$(NC)"
	@echo -e "$(BLUE)Main Services:$(NC)"
	docker-compose ps
	@echo -e "$(BLUE)Development Services:$(NC)"
	docker-compose -f docker-compose.dev.yml ps
	@echo -e "$(BLUE)Production Services:$(NC)"
	docker-compose -f docker-compose.prod.yml ps

health: ## Check application health
	@echo -e "$(YELLOW)🏥 Checking application health...$(NC)"
	@if curl -f -s http://localhost:3030/api/game/cosmic-entities > /dev/null 2>&1; then \
		echo -e "$(GREEN)✅ Application is healthy!$(NC)"; \
	else \
		echo -e "$(YELLOW)⚠️  Application health check failed$(NC)"; \
	fi

test: ## Run tests (when implemented)
	@echo -e "$(YELLOW)🧪 Running cosmic tests...$(NC)"
	npm test
	cd client && npm test

backup: ## Create a backup
	@echo -e "$(YELLOW)💾 Creating cosmic backup...$(NC)"
	./scripts/deploy.sh backup
	@echo -e "$(GREEN)✅ Backup completed!$(NC)"

deploy: ## Deploy to production with health checks
	@echo -e "$(YELLOW)🚀 Deploying The Architect's Codex...$(NC)"
	./scripts/deploy.sh deploy

rollback: ## Rollback to previous version
	@echo -e "$(YELLOW)⏪ Rolling back to previous cosmic state...$(NC)"
	./scripts/deploy.sh rollback

shell: ## Access application container shell
	@echo -e "$(YELLOW)🐚 Accessing cosmic shell...$(NC)"
	docker-compose exec architects-codex sh

shell-dev: ## Access development container shell
	@echo -e "$(YELLOW)🐚 Accessing development shell...$(NC)"
	docker-compose -f docker-compose.dev.yml exec architects-codex sh

db-shell: ## Access database shell (production)
	@echo -e "$(YELLOW)🗄️  Accessing cosmic database...$(NC)"
	docker-compose -f docker-compose.prod.yml exec postgres psql -U cosmic_user -d cosmic_codex

db-shell-dev: ## Access database shell (development)
	@echo -e "$(YELLOW)🗄️  Accessing development database...$(NC)"
	docker-compose -f docker-compose.dev.yml exec postgres-dev psql -U cosmic_user -d cosmic_codex_dev

update: ## Update dependencies and rebuild
	@echo -e "$(YELLOW)🔄 Updating cosmic dependencies...$(NC)"
	npm update
	cd client && npm update
	docker-compose build --no-cache
	@echo -e "$(GREEN)✅ Update completed!$(NC)"

restart: stop start ## Restart the application

restart-dev: ## Restart development environment
	@make stop
	@make start-dev

restart-prod: ## Restart production environment
	@make stop
	@make start-prod

interactive: ## Start interactive setup script
	@echo -e "$(PURPLE)🌌 Starting interactive cosmic setup...$(NC)"
	./scripts/start.sh

# Port configuration targets
port-3030: ## Configure for port 3030 (default)
	@echo -e "$(BLUE)🔧 Already configured for port 3030$(NC)"

port-8080: ## Configure for port 8080
	@echo -e "$(YELLOW)🔧 Configuring for port 8080...$(NC)"
	sed -i 's/3030:5000/8080:5000/g' docker-compose.yml
	sed -i 's/3030:5000/8080:5000/g' docker-compose.dev.yml
	sed -i 's/3030:5000/8080:5000/g' docker-compose.prod.yml
	@echo -e "$(GREEN)✅ Configured for port 8080$(NC)"

port-4000: ## Configure for port 4000
	@echo -e "$(YELLOW)🔧 Configuring for port 4000...$(NC)"
	sed -i 's/3030:5000/4000:5000/g' docker-compose.yml
	sed -i 's/3030:5000/4000:5000/g' docker-compose.dev.yml
	sed -i 's/3030:5000/4000:5000/g' docker-compose.prod.yml
	@echo -e "$(GREEN)✅ Configured for port 4000$(NC)"