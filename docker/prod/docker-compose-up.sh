export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./docker/prod/docker-compose.yml up -d --build