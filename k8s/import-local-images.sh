ls ./tmp -l --block-size=MB
gzip --decompress ./tmp/$PROJECT_NAME-bot-$HOST_TYPE.tar.gz
/snap/bin/microk8s ctr image rm docker.io/$PROJECT_NAME/bot:$HOST_TYPE
/snap/bin/microk8s ctr image import ./tmp/$PROJECT_NAME-bot-$HOST_TYPE.tar