ls ./tmp -l --block-size=MB

VERSION="$(cat VERSION.txt)"

docker rmi $(docker images -f "dangling=true" -q)

docker load < ./tmp/$PROJECT_NAME-bot-$HOST_TYPE.tar.gz
ID="$(docker images | grep $PROJECT_NAME'/bot' | head -n 1 | awk '{print $3}')"
docker tag "$ID" localhost:32000/$PROJECT_NAME/bot:$VERSION
docker rmi $PROJECT_NAME/bot:local
docker push localhost:32000/$PROJECT_NAME/bot:$VERSION

#/snap/bin/microk8s ctr image import ./tmp/$PROJECT_NAME-bot-$HOST_TYPE.tar