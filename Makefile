# Variables
DOCKER_COMPOSE_DEV_FILE=compose-dev.yml

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build          - Build the Docker container"
	@echo "  make build-dev      - Build the development Docker container"
	@echo "  make up             - Run the Docker container"
	@echo "  make up-dev         - Run the development Docker container"
	@echo "  make build-up       - Build and run the Docker container"
	@echo "  make build-up-dev   - Build and run the development Docker container"
	@echo "  make start          - Start the development Docker container"
	@echo "  make start-dev      - Start the development Docker container"
	@echo "  make stop           - Stop the Docker container"
	@echo "  make stop-dev       - Stop the development Docker container"
	@echo "  make down           - Stop and remove the development Docker container"
	@echo "  make down-dev       - Stop and remove the development Docker container"
	@echo "  make restart        - Restart the Docker container"
	@echo "  make restart-dev    - Restart the development Docker container"
	@echo "  make logs           - Show container logs"
	@echo "  make logs-dev       - Show development container logs"

# Build the Docker image
build:
	docker compose build
	docker compose create

# Build the development Docker image and create container
build-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} build
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} create

# Run the Docker container
up:
	docker compose up

# Run the development Docker container
up-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} up

# Build and run the Docker container
build-up:
	docker compose up --build

# Build and run the development Docker container
build-up-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} up --build

# Start the Docker container
start:
	docker compose start

# Start the development Docker container
start-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} start

# Stop the Docker container
stop:
	docker compose stop

# Stop the development Docker container
stop-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} stop

down:
	docker compose down

# Clean the development Docker container
down-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} down

# Restart the Docker container
restart:
	docker compose restart

# Restart the development Docker container
restart-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} restart

# Show logs from the Docker container
logs:
	docker compose logs

logs-dev:
	docker compose -f ${DOCKER_COMPOSE_DEV_FILE} logs