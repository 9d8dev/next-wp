# Variables
IMAGE_NAME = wp-nextjs
IMAGE_TAG = latest
CONTAINER_NAME = wp-nextjs-container
HOST_PORT = 3000
CONTAINER_PORT = 3000
DOCKERFILE = Dockerfile
NODE_VERSION = 22.14.0-alpine
NODE_ENV=production

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make build          - Build the production Docker image"
	@echo "  make build-dev      - Build the development Docker image and create container"
	@echo "  make run            - Run the production Docker container"
	@echo "  make run-dev        - Build and run the development Docker container"
	@echo "  make start-dev      - Start the development Docker container"
	@echo "  make build-run      - Build and run the production Docker container"
	@echo "  make stop           - Stop the production Docker container"
	@echo "  make stop-dev       - Stop the development Docker container"
	@echo "  make down-dev       - Stop and remove the development Docker container"
	@echo "  make restart        - Restart the production Docker container"
	@echo "  make restart-dev    - Restart the development Docker container"
	@echo "  make logs           - Show production container logs"
	@echo "  make clean          - Remove production Docker image and container"

# Build the production Docker image
build:
	docker build \
		--build-arg NODE_VERSION=$(NODE_VERSION) \
		-f $(DOCKERFILE) -t $(IMAGE_NAME):$(IMAGE_TAG) .

# Build the development Docker image and create container
build-dev:
	docker compose build
	docker compose create

# Run the production Docker container
run:
	@docker rm -f $(CONTAINER_NAME) 2>/dev/null || true
	docker run --name $(CONTAINER_NAME) -p $(HOST_PORT):$(CONTAINER_PORT) $(IMAGE_NAME):$(IMAGE_TAG)

# Build and run the development Docker container
run-dev:
	docker compose up --build

# Start the development Docker container
start-dev:
	docker compose start

# Build and run the production Docker container in one step
build-run: build run

# Stop the production Docker container
stop:
	docker stop $(CONTAINER_NAME)

# Stop the development Docker container
stop-dev:
	docker compose stop

# Clean the development Docker container
down-dev:
	docker compose down

# Restart the production Docker container
restart: stop run

# Restart the development Docker container
restart-dev:
	docker compose restart

# Show logs from the production Docker container
logs:
	docker logs -f $(CONTAINER_NAME)

# Clean up by removing production Docker image and container
clean:
	-docker rm -f $(CONTAINER_NAME)
	-docker rmi $(IMAGE_NAME):$(IMAGE_TAG)

# Clean up by removing production Docker container
clean-container:
	docker rm -f $(CONTAINER_NAME)

# Clean up by removing production Docker image and container
clean-image:
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG)