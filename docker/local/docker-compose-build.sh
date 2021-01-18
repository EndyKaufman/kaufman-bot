export UID=$(id -u)
export GID=$(id -g)
docker-compose -f ./docker/local/docker-compose-build.yml build