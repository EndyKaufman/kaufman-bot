#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=kaufman-bot-postgres-volume --label=kaufman-bot-postgres-volume
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d