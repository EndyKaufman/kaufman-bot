#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=kaufman-bot-postgres-volume --label=kaufman-bot-postgres-volume
# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d kaufman-bot-postgres
# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done
# Create all need application databases by exists match evn key and nx app name
# for app: "server" - env: SERVER_POSTGRES_URL
# for app: "core-server" - env: CORE_SERVER_POSTGRES_URL
npm run rucken -- postgres
# Run migrate database for specific database
export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
# Change database host for applications
export POSTGRES_HOST=kaufman-bot-postgres
# Update all egnerated files
npm run generate
# Start all services
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d
