#!/bin/sh
echo Show kaufman-bot docker logs
var1=$(docker logs kaufman-bot-service)
if grep -q "Express server is listening on" <<<"$var1"; then
  echo "ok"
else 
  echo $var1
  exit 1
fi