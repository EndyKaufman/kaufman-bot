export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./docker/dev/docker-compose.yml up -d