COMPOSE = docker-compose

run:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down