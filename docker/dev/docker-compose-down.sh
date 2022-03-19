#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g) 
docker-compose -f ./docker/dev/docker-compose.yml down