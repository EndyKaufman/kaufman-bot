#!/bin/bash
rm -rf ./dist

npm run nx -- run-many --target=build --all --skip-nx-cache

rm -rf ./integrations/app

cd ./integrations
npx --yes create-nx-workspace@13.8.1 --name=app --preset=empty --interactive=false --nx-cloud=false
cd ../

yes | cp -R ./integrations/default/package.json ./integrations/app/package.json

rm -rf ./integrations/app/lib
mkdir ./integrations/app/lib
cp -Rf ./dist/libs/* ./integrations/app/lib
cp -Rf google-credentials.json ./integrations/app

cd ./integrations/app
npm i --force
npm install --save-dev @nrwl/nest@13.8.1 @nrwl/node@13.8.1 @ngneat/transloco-keys-manager --force
npm install --save env-var grammy @ngneat/transloco @ngneat/transloco-locale class-validator-multi-lang --force
cd ../../

npx --yes replace-json-property ./integrations/app/lib/bot-in-groups/server/package.json version 0.0.0
cd ./integrations/app/lib/bot-in-groups/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/core/server/package.json version 0.0.0
cd ./integrations/app/lib/core/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/currency-converter/server/package.json version 0.0.0
cd ./integrations/app/lib/currency-converter/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/debug-messages/server/package.json version 0.0.0
cd ./integrations/app/lib/debug-messages/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/dialogflow/server/package.json version 0.0.0
cd ./integrations/app/lib/dialogflow/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/facts-generator/server/package.json version 0.0.0
cd ./integrations/app/lib/facts-generator/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/first-meeting/server/package.json version 0.0.0
cd ./integrations/app/lib/first-meeting/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/html-scraper/server/package.json version 0.0.0
cd ./integrations/app/lib/html-scraper/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/jokes-generator/server/package.json version 0.0.0
cd ./integrations/app/lib/jokes-generator/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/language-swither/server/package.json version 0.0.0
cd ./integrations/app/lib/language-swither/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/quotes-generator/server/package.json version 0.0.0
cd ./integrations/app/lib/quotes-generator/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/short-commands/server/package.json version 0.0.0
cd ./integrations/app/lib/short-commands/server && npm pack . && cd ../../../../../

npx --yes replace-json-property ./integrations/app/lib/schematics/package.json version 0.0.0
cd ./integrations/app/lib/schematics && npm pack . && cd ../../../../

cd ./integrations/app
npm i --force
npm install --save-dev --no-cache ../../integrations/app/lib/schematics/kaufman-bot-schematics-0.0.0.tgz --force
npm run nx -- g @kaufman-bot/schematics:application bot --bot-name=Adam
npm i --force
npm install --save --no-cache ../../integrations/app/lib/core/server/kaufman-bot-core-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/debug-messages/server/kaufman-bot-debug-messages-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/language-swither/server/kaufman-bot-language-swither-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/short-commands/server/kaufman-bot-short-commands-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/html-scraper/server/kaufman-bot-html-scraper-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/currency-converter/server/kaufman-bot-currency-converter-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/dialogflow/server/kaufman-bot-dialogflow-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/facts-generator/server/kaufman-bot-facts-generator-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/jokes-generator/server/kaufman-bot-jokes-generator-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/quotes-generator/server/kaufman-bot-quotes-generator-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/first-meeting/server/kaufman-bot-first-meeting-server-0.0.0.tgz --force
npm install --save --no-cache ../../integrations/app/lib/bot-in-groups/server/kaufman-bot-bot-in-groups-server-0.0.0.tgz --force
npm run nx -- g @kaufman-bot/schematics:library ping-pong
npm i --force
tsc --noEmit -p tsconfig.base.json
npm run nx -- build bot

cd ../../
