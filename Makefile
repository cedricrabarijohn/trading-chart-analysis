.PHONY: help build dev up down restart logs clean install test lint prod-build prod-up prod-down

# Default target
help:
	@echo "📊 Chart Analysis - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development server with hot-reload"
	@echo "  make up           - Start development container"
	@echo "  make down         - Stop development container"
	@echo "  make restart      - Restart development container"
	@echo "  make logs         - View development container logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod-build   - Build production Docker image"
	@echo "  make prod-up      - Start production container"
	@echo "  make prod-down    - Stop production container"
	@echo ""
	@echo "Utilities:"
	@echo "  make install      - Install dependencies locally"
	@echo "  make build        - Build the Next.js application locally"
	@echo "  make lint         - Run linter"
	@echo "  make clean        - Clean build artifacts and containers"
	@echo "  make shell        - Open shell in running dev container"
	@echo ""

# Development commands
dev:
	@echo "🚀 Starting development server..."
	docker compose up chart-analysis-dev

up:
	@echo "⚡ Starting development container..."
	docker compose up -d chart-analysis-dev
	@echo "✅ Development server running at http://localhost:3000"

down:
	@echo "🛑 Stopping development container..."
	docker compose down

restart: down up
	@echo "🔄 Development container restarted"

logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker compose logs -f chart-analysis-dev

# Production commands
prod-build:
	@echo "🏗️  Building production image..."
	docker compose build chart-analysis

prod-up:
	@echo "🚀 Starting production container..."
	docker compose up -d chart-analysis
	@echo "✅ Production server running at http://localhost:3000"

prod-down:
	@echo "🛑 Stopping production container..."
	docker compose stop chart-analysis

# Local development (without Docker)
install:
	@echo "📦 Installing dependencies..."
	pnpm install

build:
	@echo "🏗️  Building application..."
	pnpm build

lint:
	@echo "🔍 Running linter..."
	pnpm lint

# Utility commands
shell:
	@echo "🐚 Opening shell in development container..."
	docker compose exec chart-analysis-dev sh

clean:
	@echo "🧹 Cleaning up..."
	docker compose down -v
	rm -rf .next node_modules out dist
	@echo "✨ Cleanup complete"

# Environment setup
env:
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file from env-example..."; \
		cp env-example .env; \
		echo "⚠️  Please update .env with your API keys"; \
	else \
		echo "ℹ️  .env file already exists"; \
	fi
