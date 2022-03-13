# [2022-02-12 20:14] Create NX empty project

I decided to try to keep a twitter history of rewriting one of the projects, I'm starting...

## Creating an empty NX project

> npx create-nx-workspace

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npx create-nx-workspace
Need to install the following packages:
  create-nx-workspace
Ok to proceed? (y) y
✔ Workspace name (e.g., org name)     · kaufman-bot
✔ What to create in the new workspace · empty
✔ Use Nx Cloud? (It's free and doesn't require registration.) · No

>  NX  Nx is creating your workspace.

  To make sure the command works reliably in all environments, and that the preset is applied correctly,
  Nx will run "npm install" several times. Please wait.

✔ Installing dependencies with npm
✔ Nx has successfully created the workspace.
```

#kaufmanbot #nx

# [2022-02-12 20:56] Add nestjs nx plugin, create server app and core lib

## Install nestjs plugin to nx monorepo

> npm install -D @nrwl/nest

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm install -D @nrwl/nest

added 158 packages, and audited 623 packages in 18s

78 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Add nx script to package.json

```
"scripts": {
    "nx": "nx",
    "start": "nx serve",
    "build": "nx build",
    "test": "nx test"
},
```

## Create server

> npm run -- nx g @nrwl/nest:app server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:app server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:app" "server"

UPDATE workspace.json
UPDATE nx.json
CREATE jest.config.js
CREATE jest.preset.js
UPDATE package.json
UPDATE .vscode/extensions.json
CREATE apps/server/src/app/.gitkeep
CREATE apps/server/src/assets/.gitkeep
CREATE apps/server/src/environments/environment.prod.ts
CREATE apps/server/src/environments/environment.ts
CREATE apps/server/src/main.ts
CREATE apps/server/tsconfig.app.json
CREATE apps/server/tsconfig.json
CREATE apps/server/project.json
CREATE .eslintrc.json
CREATE apps/server/.eslintrc.json
CREATE apps/server/jest.config.js
CREATE apps/server/tsconfig.spec.json
CREATE apps/server/src/app/app.controller.spec.ts
CREATE apps/server/src/app/app.controller.ts
CREATE apps/server/src/app/app.module.ts
CREATE apps/server/src/app/app.service.spec.ts
CREATE apps/server/src/app/app.service.ts

added 230 packages, removed 5 packages, changed 3 packages, and audited 848 packages in 43s

105 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

up to date, audited 848 packages in 3s

105 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Create core library

> npm run -- nx g @nrwl/nest:lib core/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib core/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "core/server"

CREATE libs/core/server/README.md
CREATE libs/core/server/.babelrc
CREATE libs/core/server/src/index.ts
CREATE libs/core/server/tsconfig.json
CREATE libs/core/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/core/server/project.json
UPDATE workspace.json
CREATE libs/core/server/.eslintrc.json
CREATE libs/core/server/jest.config.js
CREATE libs/core/server/tsconfig.spec.json
CREATE libs/core/server/src/lib/core-server.module.ts
```

#kaufmanbot #nx #nestjs

# [2022-02-12 22:12] Local build and run nestjs application

## Update nx

The current version of nx contains bugs, need update it

> npx nx migrate @nrwl/workspace

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npx nx migrate @nrwl/workspace
Fetching meta data about packages.
It may take a few minutes.
Fetching @nrwl/workspace@latest
Fetching prettier@^2.5.1
Fetching @nrwl/cli@13.8.1
Fetching @nrwl/eslint-plugin-nx@13.8.1
Fetching @nrwl/jest@13.8.1
Fetching @nrwl/linter@13.8.1
Fetching @nrwl/nest@13.8.1
Fetching @nrwl/node@13.8.1
Fetching @nrwl/tao@13.8.1
Fetching @nrwl/workspace@13.8.1
Fetching prettier@2.5.1

>  NX  The migrate command has run successfully.

- package.json has been updated
- migrations.json has been generated

>  NX  Next steps:

- Make sure package.json changes make sense and then run 'npm install'
- Run 'nx migrate --run-migrations'
- To learn more go to https://nx.dev/using-nx/updating-nx
- You may run "nx connect-to-nx-cloud" to get faster builds, GitHub integration, and more. Check out https://nx.app
```

> npm i

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i

added 1 package, removed 103 packages, changed 7 packages, and audited 746 packages in 4s

76 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

> npm run nx -- migrate --run-migrations

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- migrate --run-migrations

> kaufman-bot@0.0.0 nx
> nx "migrate" "--run-migrations"


>  NX  Running 'npm install' to make sure necessary packages are installed


up to date, audited 746 packages in 3s

76 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

>  NX  Running migrations from 'migrations.json'

Running migration set-default-base-if-not-set
Successfully finished set-default-base-if-not-set
---------------------------------------------------------
Running migration 13-0-0-config-locations
Successfully finished 13-0-0-config-locations
---------------------------------------------------------
Running migration set-parallel-default
Successfully finished set-parallel-default
---------------------------------------------------------
Running migration 13-3-0-tsc-location
Successfully finished 13-3-0-tsc-location
---------------------------------------------------------
Running migration 13-6-0-remove-old-task-runner-options
Successfully finished 13-6-0-remove-old-task-runner-options
---------------------------------------------------------

>  NX  Successfully finished running migrations from 'migrations.json'
```

## Build sources

> npm run nx -- build server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- build server

> kaufman-bot@0.0.0 nx
> nx "build" "server"


> nx run server:build

chunk (runtime: main) main.js (main) 2.76 KiB [entry] [rendered]
webpack compiled successfully (ba0f882f8a8c0d5f)

 ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target build for project server (4s)
```

## Start built application

> node ./dist/apps/server/main.js

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ node ./dist/apps/server/main.js
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG [NestFactory] Starting Nest application...
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG [InstanceLoader] AppModule dependencies initialized +31ms
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG [RoutesResolver] AppController {/api}: +6ms
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG [RouterExplorer] Mapped {/api, GET} route +3ms
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG [NestApplication] Nest application successfully started +3ms
[Nest] 1439017  - 02/12/2022, 9:14:11 PM     LOG 🚀 Application is running on: http://localhost:3333/api
```

## Check applications

> curl http://localhost:3333/api

```
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ curl http://localhost:3333/api
{"message":"Welcome to server!"}endy@endy-virtual-machine:~/Projects/current/kaufman-bot$
```

#kaufmanbot #nx #nestjs #deploy

# [2022-02-12 22:58] Deploy nestjs application to netfly (Failure)

## Login in netlify with github account

https://www.netlify.com/

Import an existing project from a Git repository

Set config options

**Base directory**
EMPTY

**Build command**
npm run nx -- build server

**Publish directory**
/dist/apps/server/

And click **Deploy site**

## Check deployed files

Netlife created for store static files or run server less functions, current deploy is static nodejs files :)

> curl https://inspiring-wing-dfa35d.netlify.app/main.js

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ curl https://inspiring-wing-dfa35d.netlify.app/main.js
/******/ (() => { // webpackBootstrap
/******/        "use strict";
/******/        var __webpack_modules__ = ({

/***/ "./apps/server/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./apps/server/src/app/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    common_1.Controller(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./apps/server/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_controller_1 = __webpack_require__("./apps/server/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./apps/server/src/app/app.service.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        imports: [],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/server/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let AppService = class AppService {
    getData() {
        return { message: 'Welcome to server!' };
    }
};
AppService = tslib_1.__decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/        });
/************************************************************************/
/******/        // The module cache
/******/        var __webpack_module_cache__ = {};
/******/
/******/        // The require function
/******/        function __webpack_require__(moduleId) {
/******/                // Check if module is in cache
/******/                var cachedModule = __webpack_module_cache__[moduleId];
/******/                if (cachedModule !== undefined) {
/******/                        return cachedModule.exports;
/******/                }
/******/                // Create a new module (and put it into the cache)
/******/                var module = __webpack_module_cache__[moduleId] = {
/******/                        // no module.id needed
/******/                        // no module.loaded needed
/******/                        exports: {}
/******/                };
/******/
/******/                // Execute the module function
/******/                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/                // Return the exports of the module
/******/                return module.exports;
/******/        }
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/server/src/app/app.module.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        const port = process.env.PORT || 3333;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map
```

It was the wrong way, I'll choose another, sorry guys :)

#kaufmanbot #nx #netlify

# [2022-02-12 23:20] Deploy nestjs application to vercel (Failure)

## Import repo

Login to https://vercel.com/login with github account

Navigate to https://vercel.com/new

Create new application and import exists git repository

## Configure Project

**FRAMEWORK PRESET**
Other

**BUILD COMMAND**
npm run nx -- build server

**OUTPUT DIRECTORY**
/dist/apps/server/

**INSTALL COMMAND**
npm i --force

Click to **Deploy**

## Check deployed files

After it we have static site with nodejs code) as netfly

> curl https://kaufman-bot.vercel.app/main.js

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ curl https://kaufman-bot.vercel.app/main.js
/******/ (() => { // webpackBootstrap
/******/        "use strict";
/******/        var __webpack_modules__ = ({

/***/ "./apps/server/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./apps/server/src/app/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    common_1.Controller(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./apps/server/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_controller_1 = __webpack_require__("./apps/server/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./apps/server/src/app/app.service.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    common_1.Module({
        imports: [],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/server/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let AppService = class AppService {
    getData() {
        return { message: 'Welcome to server!' };
    }
};
AppService = tslib_1.__decorate([
    common_1.Injectable()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/        });
/************************************************************************/
/******/        // The module cache
/******/        var __webpack_module_cache__ = {};
/******/
/******/        // The require function
/******/        function __webpack_require__(moduleId) {
/******/                // Check if module is in cache
/******/                var cachedModule = __webpack_module_cache__[moduleId];
/******/                if (cachedModule !== undefined) {
/******/                        return cachedModule.exports;
/******/                }
/******/                // Create a new module (and put it into the cache)
/******/                var module = __webpack_module_cache__[moduleId] = {
/******/                        // no module.id needed
/******/                        // no module.loaded needed
/******/                        exports: {}
/******/                };
/******/
/******/                // Execute the module function
/******/                __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/                // Return the exports of the module
/******/                return module.exports;
/******/        }
/******/
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const app_module_1 = __webpack_require__("./apps/server/src/app/app.module.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        const port = process.env.PORT || 3333;
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map
```

(Failure)

It was the wrong way, I'll choose another :)

## Create Vercel config for correct deploy as nodejs app

Create file vercel.json in root

```
{
  "version": 2,
  "name": "kaufman-bot",
  "builds": [
    {
      "src": "dist/apps/server/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/apps/server/main.js"
    }
  ]
}
```

(Failure)

It was the wrong way, I'll choose another :)

## Try change config in package.json for correct build

Change scripts in package.json

```
"scripts": {
  "nx": "nx",
  "start": "node dist/apps/server/main.js",
  "build": "npm run nx -- build server",
  "test": "nx test"
},
```

Remove all deploy configs from settings in vercel dashboard

Remove builds from vercel config file

```
{
  "version": 2,
  "name": "kaufman-bot",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/apps/server/main.js"
    }
  ]
}

```

(Failure)

It was the wrong way, I'll choose another :)

#kaufmanbot #nx #vercel

# [2022-02-13 00:26] Deploy nestjs application to heroku (Success)

## Login in heroku

https://www.heroku.com/

## Create new application in heroku

https://dashboard.heroku.com/new-app

![Create new application in heroku](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lo3ee72i1pw9qr7g8zby.png)

## Connect exists repository from github to created application

https://dashboard.heroku.com/apps/kaufman-bot/deploy/github

![Connect exists repository from github to created application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/91eazbm7g1j7pfdxgys7.png)

## Set branch name if not main

![Set branch name if not main](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5hdpz599t79um8mnhoj0.png)

And click to **Enable Automatic Deploys**

After it click to deploy
![After it click to deploy ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/29d8lx4meeya4hcazaid.png)

Wait...

## Check output of site

> curl https://kaufman-bot.herokuapp.com/api

```
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ curl https://kaufman-bot.herokuapp.com/api
{"message":"Welcome to server!"}endy@endy-virtual-machine:~/Projects/current/kaufman-bot$
```

It was easy!!!

#kaufmanbot #nx #heroku

# [2022-02-13 13:42] Add support telegram bot to nestjs with nestjs-telegraf

## Add library to application

> npm i --save nestjs-telegraf telegraf

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save nestjs-telegraf telegraf

added 12 packages, and audited 758 packages in 13s

77 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Create token for bot

Find user @BotFather in telegram and create new bot

![Find user @BotFather in telegram and create new bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tvnznmev9xu84zver72y.png)

Create .env.local file in root folder and write this token

```sh
TELEGRAM_BOT_TOKEN=5125823512:AAGfQnaPNYnIFh4z8e2A689tubxtoxSjwQg
```

![.env.local](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vck9mt94tv5dedm8u8uj.png)

Update .gitignore file

```sh
...
# Env files
*.env.*
```

![.gitignore](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5oncbzto8pet7s8kpi2s.png)

## Add env to heroku dashboard

Go to https://dashboard.heroku.com/apps/kaufman-bot/settings

Open envs panel
![envs panel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lw03wtuhqiqidhnqfz8g.png)

Add token to env
![Add token to env](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j7d4by0cyi97fj9aff0e.png)

## Write first code in nestjs application

Update app.module.ts file

```ts
import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Update app.service.ts file

```ts
import { Injectable } from '@nestjs/common';
import { Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }
}
```

## Update scripts for run application

```sh
"scripts": {
    "nx": "nx",
    "start": "node dist/apps/server/main.js",
    "build": "npm run nx -- build server",
    "test": "nx test",
    "serve": "npm run nx -- serve server",
    "serve:local": "export $(xargs < ./.env.local) && npm run serve"
}
```

![Update scripts for run application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9qgl8xje3s1vr2lvqi6t.png)

## Run and test send message from telegram

> npm run serve:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run serve:local

> kaufman-bot@0.0.0 serve:local
> export $(xargs < ./.env.local) && npm run serve


> kaufman-bot@0.0.0 serve
> npm run nx -- serve server


> kaufman-bot@0.0.0 nx
> nx "serve" "server"


> nx run server:serve

chunk (runtime: main) main.js (main) 5.13 KiB [entry] [rendered]
webpack compiled successfully (1cb24aed742cbdb9)
Starting inspector on localhost:9229 failed: address already in use
Issues checking in progress...
[Nest] 1495282  - 02/13/2022, 12:11:12 PM     LOG [NestFactory] Starting Nest application...
[Nest] 1495282  - 02/13/2022, 12:11:12 PM     LOG [InstanceLoader] TelegrafModule dependencies initialized +79ms
[Nest] 1495282  - 02/13/2022, 12:11:12 PM     LOG [InstanceLoader] DiscoveryModule dependencies initialized +3ms
[Nest] 1495282  - 02/13/2022, 12:11:12 PM     LOG [InstanceLoader] AppModule dependencies initialized +5ms
[Nest] 1495282  - 02/13/2022, 12:11:13 PM     LOG [InstanceLoader] TelegrafCoreModule dependencies initialized +287ms
[Nest] 1495282  - 02/13/2022, 12:11:13 PM     LOG [RoutesResolver] AppController {/api}: +6ms
[Nest] 1495282  - 02/13/2022, 12:11:13 PM     LOG [RouterExplorer] Mapped {/api, GET} route +4ms
[Nest] 1495282  - 02/13/2022, 12:11:13 PM     LOG [NestApplication] Nest application successfully started +4ms
[Nest] 1495282  - 02/13/2022, 12:11:13 PM     LOG 🚀 Application is running on: http://localhost:3333/api
No issues found.
```

![nx run server:serve](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z00aamitt0sl2sk2rwla.png)

Open telegram and find you bot
![Open telegram and find you bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f4atd0lcjqw5qqe3gbcn.png)

Click to start message
![Click to start message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y5yix2i24p2z5lcnk3l6.png)

Test other feature
![Test other feature](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n9140jru3ej2a338uso9.png)

## Deploy to heroku and test

Commit all changes

![Commit all changes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlff7p8nah4razd4ez5d.png)

Stop local version of bot
![Stop local version of bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w6pqlo8vz0i9o662hpsz.png)

Remove vercel integrations if it exists
![Remove vercel integrations if it exists](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nze2gmpq2gjbtavi4voc.png)

![Remove vercel integrations if it exists2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k7oyaz55ir028sb9lwhe.png)

![Remove vercel integrations if it exists3](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hm2bwyrpe40bjum9j64i.png)

If application not deploy automatic, change settings in heroku and click to manual deploy

![manual deploy](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5bk4ja40r5259acmdeqm.png)

Wait...

Send message to bot

![Send message to bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/37scr64040cr7mvufusm.png)

#kaufmanbot #nestjs #telegram #nestjstelegraf

# [2022-02-13 21:13] Add env-var, lint-staged and etc. for nx workspace

## Add env-var

> npm i --save env-var

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save env-var

added 1 package, and audited 759 packages in 3s

77 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Add lint-staged

> npx mrm@2 lint-staged

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npx mrm@2 lint-staged
Running lint-staged...
Update package.json
Installing lint-staged and husky...

added 30 packages, and audited 789 packages in 5s

92 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
husky - Git hooks installed
husky - created .husky/pre-commit
```

## Add rucken

> npm i --save-dev rucken

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev rucken

added 84 packages, removed 5 packages, and audited 868 packages in 21s

105 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Update package.json

Update scripts sections

```json
"scripts": {
    "rucken": "rucken",
    "nx": "nx",
    "start": "node dist/apps/server/main.js",
    "build": "npm run nx -- build server",
    "test": "nx test",
    "serve": "npm run nx -- serve server",
    "serve:local": "export $(xargs < ./.env.local) && npm run serve",
    "prepare": "husky install",
    "lint": "npm run tsc:lint && nx workspace-lint && npm run nx -- run-many --target=lint --all",
    "lint:fix": "npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all",
    "tsc:lint": "tsc --noEmit -p tsconfig.base.json",
    "generate": "npm run rucken -- prepare && npm run lint:fix"
},
```

## Update lint-staged section

```json
"lint-staged": {
    "*.{js,ts}": "eslint --fix",
    "*.{js,ts,css,scss,md}": "prettier --ignore-unknown --write"
}
```

## Update tsconfig.base.json

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2017", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "allowSyntheticDefaultImports": true,
    "strictNullChecks": true,
    "noImplicitOverride": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "noImplicitAny": false,
    "paths": {
      "@kaufman-bot/core/server": ["libs/core/server/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

## Change work with env in code

Update main.ts

```ts
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import env from 'env-var';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = env.get('PORT').default(3333).asPortNumber();
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
```

Update app.module.ts

```ts
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Run generate

> npm run generate

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run generate

> kaufman-bot@0.0.0 generate
> npm run rucken -- prepare && npm run lint:fix


> kaufman-bot@0.0.0 rucken
> rucken "prepare"

[2022-02-13T19:52:47.639] [INFO] MakeTsListService: prepare - Start create list files...
[2022-02-13T19:52:47.641] [INFO] MakeTsListService: prepare - Config: {"indexFileName":"index","excludes":["*node_modules*","*public_api.ts*","*.spec*","environment*","*test*","*e2e*","*.stories.ts","*.d.ts"]}
[2022-02-13T19:52:47.641] [DEBUG] MakeTsListService: prepare - Process library "core-server" in libs/core/server/src
[2022-02-13T19:52:47.642] [INFO] MakeTsListService: prepare - End of create list files...
[2022-02-13T19:52:47.643] [INFO] VersionUpdaterService: prepare - Start update versions...
[2022-02-13T19:52:47.643] [INFO] VersionUpdaterService: prepare - Config: {"updatePackageVersion":true}
[2022-02-13T19:52:47.643] [DEBUG] VersionUpdaterService: prepare - Process project "core-server" in libs/core/server
[2022-02-13T19:52:47.644] [INFO] VersionUpdaterService: prepare - Start for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/core/server/package.json"}
[2022-02-13T19:52:47.645] [INFO] VersionUpdaterService: prepare - End of for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/core/server/package.json"}
[2022-02-13T19:52:47.645] [DEBUG] VersionUpdaterService: prepare - Process project "server" in apps/server
[2022-02-13T19:52:47.645] [INFO] VersionUpdaterService: prepare - Start for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"apps/server/package.json"}
[2022-02-13T19:52:47.646] [INFO] VersionUpdaterService: prepare - Error Wrong body of file apps/server/package.json
[2022-02-13T19:52:47.646] [INFO] VersionUpdaterService: prepare - End of for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"apps/server/package.json"}
[2022-02-13T19:52:47.646] [INFO] VersionUpdaterService: prepare - End of update versions...
[2022-02-13T19:52:47.646] [INFO] Extracti18nService: prepare - Start create translate files...
[2022-02-13T19:52:47.646] [INFO] Extracti18nService: prepare - Config: {"locales":["en"],"markers":["getText","dictionary"]}
[2022-02-13T19:52:47.647] [INFO] Extracti18nService: prepare - Process applications...
[2022-02-13T19:52:47.647] [DEBUG] Extracti18nService: prepare - server apps/server/src
[2022-02-13T19:52:48.765] [INFO] Extracti18nService: prepare - Process libraries...
[2022-02-13T19:52:48.766] [DEBUG] Extracti18nService: prepare - core-server libs/core/server/src
[2022-02-13T19:52:50.428] [INFO] Extracti18nService: prepare - End of create translate files...
[2022-02-13T19:52:50.429] [INFO] GettextService: prepare - Start create translate files...
[2022-02-13T19:52:50.429] [INFO] GettextService: prepare - Config: {"po2jsonOptions":{"format":"mf"},"pattern":"**/*.@(ts|js|tsx|jsx)","locales":["en"],"defaultLocale":"en","markers":["getText","dictionary"]}
[2022-02-13T19:52:50.430] [DEBUG] GettextService: prepare - core-server libs/core/server/src
[2022-02-13T19:52:50.468] [DEBUG] GettextService: prepare - server apps/server/src
[2022-02-13T19:52:50.506] [INFO] GettextService: prepare - End of create translate files...
[2022-02-13T19:52:50.507] [INFO] Extracti18nService: prepare - Start create translate files...
[2022-02-13T19:52:50.508] [INFO] Extracti18nService: prepare - Config: {"locales":["en"],"markers":["getText","dictionary"]}
[2022-02-13T19:52:50.509] [INFO] Extracti18nService: prepare - Process applications...
[2022-02-13T19:52:50.509] [DEBUG] Extracti18nService: prepare - server apps/server/src
[2022-02-13T19:52:51.640] [INFO] Extracti18nService: prepare - Process libraries...
[2022-02-13T19:52:51.640] [DEBUG] Extracti18nService: prepare - core-server libs/core/server/src
[2022-02-13T19:52:53.296] [INFO] Extracti18nService: prepare - End of create translate files...

> kaufman-bot@0.0.0 lint:fix
> npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all


> kaufman-bot@0.0.0 tsc:lint
> tsc --noEmit -p tsconfig.base.json


    ✔  nx run core-server:lint (1s)
    ✔  nx run server:lint  [local cache]

 —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 2 projects (2s)

         With additional flags:
           --fix=true

   Nx read the output from the cache instead of running the command for 1 out of 2 tasks.


 >  NX   Running affected:* commands with --all can result in very slow builds.

   --all is not meant to be used for any sizable project or to be used in CI.

   Learn more about checking only what is affected: https://nx.dev/latest/angular/cli/affected#affected.

.eslintrc.json 26ms
.prettierrc 22ms
.vscode/extensions.json 3ms
apps/server/.eslintrc.json 6ms
apps/server/jest.config.js 14ms
apps/server/project.json 6ms
apps/server/src/app/app.controller.spec.ts 40ms
apps/server/src/app/app.controller.ts 11ms
apps/server/src/app/app.module.ts 9ms
apps/server/src/app/app.service.spec.ts 13ms
apps/server/src/app/app.service.ts 25ms
apps/server/src/assets/i18n/en.json 4ms
apps/server/src/assets/i18n/en.vendor.json 4ms
apps/server/src/environments/environment.prod.ts 4ms
apps/server/src/environments/environment.ts 5ms
apps/server/src/main.ts 21ms
apps/server/tsconfig.app.json 7ms
apps/server/tsconfig.json 4ms
apps/server/tsconfig.spec.json 4ms
jest.config.js 7ms
jest.preset.js 5ms
libs/core/server/.babelrc 3ms
libs/core/server/.eslintrc.json 5ms
libs/core/server/jest.config.js 5ms
libs/core/server/package.json 3ms
libs/core/server/project.json 6ms
libs/core/server/README.md 39ms
libs/core/server/src/i18n/en.json 2ms
libs/core/server/src/index.ts 4ms
libs/core/server/src/lib/core-server.module.ts 7ms
libs/core/server/tsconfig.json 3ms
libs/core/server/tsconfig.lib.json 3ms
libs/core/server/tsconfig.spec.json 4ms
migrations.json 6ms
nx.json 6ms
package-lock.json 352ms
package.json 42ms
README.md 36ms
STEPS.md 98ms
tools/tsconfig.tools.json 5ms
transloco.config.js 10ms
transloco.config.json 5ms
tsconfig.base.json 3ms
workspace.json 5ms
```

![npm run generate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h51snvgf37ip85d9vcr7.png)

## Commit changes

#kaufmanbot #env #lintstaged #rucken

# [2022-02-20 21:20] Create scraper plugin for telegram bot on nestjs

## Create empty plugin

Add new library plugins

> npm run -- nx g @nrwl/nest:lib plugins/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib plugins/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "plugins/server"

CREATE libs/plugins/server/README.md
CREATE libs/plugins/server/.babelrc
CREATE libs/plugins/server/src/index.ts
CREATE libs/plugins/server/tsconfig.json
CREATE libs/plugins/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/plugins/server/project.json
UPDATE workspace.json
CREATE libs/plugins/server/.eslintrc.json
CREATE libs/plugins/server/jest.config.js
CREATE libs/plugins/server/tsconfig.spec.json
CREATE libs/plugins/server/src/lib/plugins-server.module.ts
```

Create config interface file ./libs/plugin/server/src/lib/scraper/scraper-config/scraper.config.ts

```ts
export const SCRAPER_CONFIG = 'SCRAPER_CONFIG';

export interface ScraperConfig {
  uri: string;
  timeout?: number;
  contentSelector: string;
  contentLength?: number;
  contentCodepage?: string;
  spyWords: string[];
  removeWords?: string[];
  help: string;
  helpLocale?: { [locale: string]: string };
}
```

Add enum commands for work plugin libs/plugin/server/src/lib/scraper/scraper-types/scraper-commands.ts

```ts
export enum ScraperCommandsEnum {
  help = 'help',
}
```

Add plugin service without logic libs/plugins/server/src/lib/scraper/scraper-services/scraper.service.ts

```ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Message as Msg, On, Update } from 'nestjs-telegraf';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';
import { ScraperCommandsEnum } from '../scraper-types/scraper-commands';

@Update()
@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig
  ) {}

  @On('text')
  async onMessage(@Msg() msg) {
    const locale = msg.from?.language_code || null;
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      msg.text.toLowerCase().includes(spyWord.toLowerCase())
    );
    if (spyWord) {
      if (
        msg.text.includes(`/${ScraperCommandsEnum.help}`) ||
        msg.text.includes(ScraperCommandsEnum.help)
      ) {
        const replayHelpMessage =
          (locale && this.scraperConfig.helpLocale?.[locale]) ||
          this.scraperConfig.help;
        return replayHelpMessage;
      }

      const preparedText = msg.text
        .split(spyWord)
        .join('')
        .split('  ')
        .join('')
        .trim();

      const replayMessage = await this.scrap(preparedText);

      if (replayMessage) {
        return replayMessage;
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private scrap(text: string) {
    return Promise.resolve(text);
  }
}
```

Update module file, add service libs/plugins/server/src/lib/scraper/scraper.module.ts

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { ScraperConfig, SCRAPER_CONFIG } from './scraper-config/scraper.config';
import { ScraperService } from './scraper-services/scraper.service';

@Module({})
export class ScraperModule {
  static forRoot(config: ScraperConfig): DynamicModule {
    return {
      module: ScraperModule,
      providers: [
        {
          provide: SCRAPER_CONFIG,
          useValue: config,
        },
        ScraperService,
      ],
    };
  }
}
```

Generate all need files for include lib to app

> npm run generate

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run generate

> kaufman-bot@0.0.0 generate
> npm run rucken -- prepare && npm run lint:fix


> kaufman-bot@0.0.0 rucken
> rucken "prepare"

[2022-02-20T15:17:21.816] [INFO] MakeTsListService: prepare - Start create list files...
[2022-02-20T15:17:21.818] [INFO] MakeTsListService: prepare - Config: {"indexFileName":"index","excludes":["*node_modules*","*public_api.ts*","*.spec*","environment*","*test*","*e2e*","*.stories.ts","*.d.ts"]}
[2022-02-20T15:17:21.819] [DEBUG] MakeTsListService: prepare - Process library "core-server" in libs/core/server/src
[2022-02-20T15:17:21.819] [DEBUG] MakeTsListService: prepare - Process library "plugins-server" in libs/plugins/server/src
[2022-02-20T15:17:21.819] [INFO] MakeTsListService: prepare - End of create list files...
[2022-02-20T15:17:21.819] [INFO] VersionUpdaterService: prepare - Start update versions...
[2022-02-20T15:17:21.820] [INFO] VersionUpdaterService: prepare - Config: {"updatePackageVersion":true}
[2022-02-20T15:17:21.820] [DEBUG] VersionUpdaterService: prepare - Process project "core-server" in libs/core/server
[2022-02-20T15:17:21.820] [INFO] VersionUpdaterService: prepare - Start for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/core/server/package.json"}
[2022-02-20T15:17:21.821] [INFO] VersionUpdaterService: prepare - End of for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/core/server/package.json"}
[2022-02-20T15:17:21.821] [DEBUG] VersionUpdaterService: prepare - Process project "plugins-server" in libs/plugins/server
[2022-02-20T15:17:21.821] [INFO] VersionUpdaterService: prepare - Start for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/plugins/server/package.json"}
[2022-02-20T15:17:21.822] [INFO] VersionUpdaterService: prepare - End of for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"libs/plugins/server/package.json"}
[2022-02-20T15:17:21.822] [DEBUG] VersionUpdaterService: prepare - Process project "server" in apps/server
[2022-02-20T15:17:21.822] [INFO] VersionUpdaterService: prepare - Start for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"apps/server/package.json"}
[2022-02-20T15:17:21.822] [INFO] VersionUpdaterService: prepare - Error Wrong body of file apps/server/package.json
[2022-02-20T15:17:21.823] [INFO] VersionUpdaterService: prepare - End of for {"rootConfigPath":"/home/endy/Projects/current/kaufman-bot/package.json","appConfigPath":"apps/server/package.json"}
[2022-02-20T15:17:21.823] [INFO] VersionUpdaterService: prepare - End of update versions...
[2022-02-20T15:17:21.823] [INFO] Extracti18nService: prepare - Start create translate files...
[2022-02-20T15:17:21.823] [INFO] Extracti18nService: prepare - Config: {"locales":["en"],"markers":["getText","dictionary"]}
[2022-02-20T15:17:21.823] [INFO] Extracti18nService: prepare - Process applications...
[2022-02-20T15:17:21.823] [DEBUG] Extracti18nService: prepare - server apps/server/src
[2022-02-20T15:17:22.757] [INFO] Extracti18nService: prepare - Process libraries...
[2022-02-20T15:17:22.758] [DEBUG] Extracti18nService: prepare - core-server libs/core/server/src
[2022-02-20T15:17:23.651] [DEBUG] Extracti18nService: prepare - plugins-server libs/plugins/server/src
[2022-02-20T15:17:24.987] [INFO] Extracti18nService: prepare - End of create translate files...
[2022-02-20T15:17:24.987] [INFO] GettextService: prepare - Start create translate files...
[2022-02-20T15:17:24.987] [INFO] GettextService: prepare - Config: {"po2jsonOptions":{"format":"mf"},"pattern":"**/*.@(ts|js|tsx|jsx)","locales":["en"],"defaultLocale":"en","markers":["getText","dictionary"]}
[2022-02-20T15:17:24.988] [DEBUG] GettextService: prepare - core-server libs/core/server/src
[2022-02-20T15:17:25.011] [DEBUG] GettextService: prepare - plugins-server libs/plugins/server/src
[2022-02-20T15:17:25.037] [DEBUG] GettextService: prepare - server apps/server/src
[2022-02-20T15:17:25.057] [INFO] GettextService: prepare - End of create translate files...
[2022-02-20T15:17:25.057] [INFO] Extracti18nService: prepare - Start create translate files...
[2022-02-20T15:17:25.057] [INFO] Extracti18nService: prepare - Config: {"locales":["en"],"markers":["getText","dictionary"]}
[2022-02-20T15:17:25.058] [INFO] Extracti18nService: prepare - Process applications...
[2022-02-20T15:17:25.058] [DEBUG] Extracti18nService: prepare - server apps/server/src
[2022-02-20T15:17:25.961] [INFO] Extracti18nService: prepare - Process libraries...
[2022-02-20T15:17:25.961] [DEBUG] Extracti18nService: prepare - core-server libs/core/server/src
[2022-02-20T15:17:26.716] [DEBUG] Extracti18nService: prepare - plugins-server libs/plugins/server/src
[2022-02-20T15:17:28.030] [INFO] Extracti18nService: prepare - End of create translate files...

> kaufman-bot@0.0.0 lint:fix
> npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all


> kaufman-bot@0.0.0 tsc:lint
> tsc --noEmit -p tsconfig.base.json


    ✔  nx run plugins-server:lint (1s)
    ✔  nx run core-server:lint (1s)
    ✔  nx run server:lint  [local cache]

 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 3 projects (2s)

         With additional flags:
           --fix=true

   Nx read the output from the cache instead of running the command for 1 out of 3 tasks.


 >  NX   Running affected:* commands with --all can result in very slow builds.

   --all is not meant to be used for any sizable project or to be used in CI.

   Learn more about checking only what is affected: https://nx.dev/latest/angular/cli/affected#affected.

.eslintrc.json 17ms
.prettierrc 16ms
.vscode/extensions.json 2ms
apps/server/.eslintrc.json 5ms
apps/server/jest.config.js 11ms
apps/server/project.json 6ms
apps/server/src/app/app.controller.spec.ts 29ms
apps/server/src/app/app.controller.ts 8ms
apps/server/src/app/app.module.ts 9ms
apps/server/src/app/app.service.spec.ts 9ms
apps/server/src/app/app.service.ts 19ms
apps/server/src/assets/i18n/en.json 2ms
apps/server/src/assets/i18n/en.vendor.json 3ms
apps/server/src/environments/environment.prod.ts 4ms
apps/server/src/environments/environment.ts 4ms
apps/server/src/main.ts 16ms
apps/server/tsconfig.app.json 6ms
apps/server/tsconfig.json 4ms
apps/server/tsconfig.spec.json 4ms
jest.config.js 5ms
jest.preset.js 2ms
libs/core/server/.babelrc 3ms
libs/core/server/.eslintrc.json 2ms
libs/core/server/jest.config.js 5ms
libs/core/server/package.json 3ms
libs/core/server/project.json 3ms
libs/core/server/README.md 22ms
libs/core/server/src/i18n/en.json 1ms
libs/core/server/src/index.ts 3ms
libs/core/server/src/lib/core-server.module.ts 3ms
libs/core/server/tsconfig.json 3ms
libs/core/server/tsconfig.lib.json 3ms
libs/core/server/tsconfig.spec.json 3ms
libs/plugins/server/.babelrc 2ms
libs/plugins/server/.eslintrc.json 2ms
libs/plugins/server/jest.config.js 5ms
libs/plugins/server/package.json 2ms
libs/plugins/server/project.json 6ms
libs/plugins/server/README.md 6ms
libs/plugins/server/src/i18n/en.json 1ms
libs/plugins/server/src/index.ts 2ms
libs/plugins/server/src/lib/plugins-server.module.ts 7ms
libs/plugins/server/src/lib/scraper/scraper-config/scraper.config.ts 5ms
libs/plugins/server/src/lib/scraper/scraper-services/scraper.service.ts 20ms
libs/plugins/server/src/lib/scraper/scraper-types/scraper-commands.ts 3ms
libs/plugins/server/src/lib/scraper/scraper.module.ts 5ms
libs/plugins/server/tsconfig.json 3ms
libs/plugins/server/tsconfig.lib.json 3ms
libs/plugins/server/tsconfig.spec.json 3ms
migrations.json 5ms
nx.json 3ms
package-lock.json 227ms
package.json 2ms
README.md 44ms
STEPS.md 105ms
tools/tsconfig.tools.json 4ms
transloco.config.js 11ms
transloco.config.json 4ms
tsconfig.base.json 4ms
workspace.json 4ms
```

Add ScraperModule to main AppModule

```ts
import { ScraperModule } from '@kaufman-bot/plugins/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    ScraperModule.forRoot({
      contentCodepage: '',
      contentLength: 0,
      contentSelector: '',
      help: 'Scraper help message',
      spyWords: ['scraper'],
      timeout: 0,
      uri: '',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Test from telegram

```
IL'shat Khamitov, [20.02.2022 18:28]
scraper /help

KaufmanBotDevelop, [20.02.2022 18:28]
Scraper help message

IL'shat Khamitov, [20.02.2022 18:29]
scraper help

KaufmanBotDevelop, [20.02.2022 18:29]
Scraper help message

IL'shat Khamitov, [20.02.2022 18:29]
scraper trim message please

KaufmanBotDevelop, [20.02.2022 18:29]
trim message please
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p05uhty5jkyijkunz161.png)

## Add logic for scrap and use it for get rate for USD/EUR

Install all need deps

> npm install --save axios cheerio html-to-text jschardet encoding charset mustache

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm install --save axios cheerio html-to-text jschardet encoding charset mustache

added 15 packages, and audited 883 packages in 6s

109 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Update service libs/plugins/server/src/lib/scraper/scraper-services/scraper.service.ts

```ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import charset from 'charset';
import cheerio from 'cheerio';
import encoding from 'encoding';
import htmlToText from 'html-to-text';
import jschardet from 'jschardet';
import { render } from 'mustache';
import { Message as Msg, On, Update } from 'nestjs-telegraf';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';
import { ScraperCommandsEnum } from '../scraper-types/scraper-commands';

@Update()
@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig
  ) {}

  @On('text')
  async onMessage(@Msg() msg) {
    const locale = msg.from?.language_code || null;
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      msg.text.toLowerCase().includes(spyWord.toLowerCase())
    );
    if (spyWord) {
      if (
        msg.text.includes(`/${ScraperCommandsEnum.help}`) ||
        msg.text.includes(ScraperCommandsEnum.help)
      ) {
        const replayHelpMessage =
          (locale && this.scraperConfig.helpLocale?.[locale]) ||
          this.scraperConfig.help;
        return replayHelpMessage;
      }

      const preparedText = msg.text
        .split(spyWord)
        .join('')
        .split('  ')
        .join('')
        .trim();

      const replayMessage = await this.scrap(locale, preparedText);

      if (replayMessage) {
        return replayMessage;
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private async scrap(locale: string, text: string) {
    /*const parsedVariables = parse(this.scraperConfig.uri)
      .filter((arr) => arr[0] === 'name')
      .map((arr) => arr[1]);
    const otherText = text;*/

    const replaceVariables = { text: encodeURIComponent(text.trim()), locale };
    (this.scraperConfig.removeWords || []).forEach((removeWord: string) => {
      text = text
        .replace(new RegExp(removeWord, 'ig'), '')
        .replace(new RegExp(' {2}', 'ig'), ' ')
        .trim();
    });
    const textArray = text.split(' ');
    if (textArray.length > 0) {
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text ${textArrayIndex + 1}`] = textArrayItem;
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text${textArrayIndex + 1}`] =
          textArrayItem.toLowerCase();
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`TEXT${textArrayIndex + 1}`] =
          textArrayItem.toUpperCase();
      });
    }
    const repalcedUri = render(this.scraperConfig.uri, replaceVariables);
    // const replacedText = render(text, replaceVariables);

    const axiosInstance = axios.create({
      timeout: this.scraperConfig.timeout,
      responseEncoding: this.scraperConfig.contentCodepage || 'binary',
    });

    try {
      const response = await axiosInstance.get(repalcedUri);
      const $ = cheerio.load(response.data);
      let content = this.scraperConfig.contentSelector
        .split(',')
        .map((selector: string) => htmlToText.fromString($(selector).html()))
        .join('\n\n');

      const enc =
        charset(response.headers, response.data) ||
        jschardet.detect(response.data).encoding.toLowerCase();

      if (enc !== 'utf8') {
        content = encoding
          .convert(Buffer.from(content, 'binary'), 'utf8', enc, true)
          .toString('utf8');
      }
      return content;
    } catch (err) {
      this.logger.error(err, err.stack);
      return err.toString();
    }
  }
}
```

Update app module

```ts
import { ScraperModule } from '@kaufman-bot/plugins/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    ScraperModule.forRoot({
      contentSelector:
        '#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > form > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod',
      help: 'Scraper help message',
      spyWords: ['scraper'],
      removeWords: ['to', 'convert', 'please'],
      uri: 'https://www.xe.com/currencyconverter/convert/?Amount={{TEXT1}}&From={{TEXT2}}&To={{TEXT3}}',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Test from telegram

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/aggtn76vyl7bzwexh91d.png)

#kaufmanbot #nestjs #scraper #currency

# [2022-02-21 09:29] Deploy nestjs project to VPS with dokku

## Buy VPS

Search VPS or VDS in google

https://www.google.com/search?q=vps+vds+server

I choice this https://ztv.su/aff.php?aff=526 for Russia

Go to https://ztv.su/register.php?language=english
![Reg user](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qqsko6kljq6o6ybq15gj.png)

After login
![After login](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7vfgsx54s4qv3d2omg4w.png)

Click to create new server
![Click to create new server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bgtu8to2yww6yzb8n6mp.png)

Open menu
![Open menu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b2929mmv4dsut8hx56ov.png)

Select SSD type of VPS
![Select SSD type of VPS](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x6nx3p2y972mbsnn9l3i.png)

Select type of server
![Select type of server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t1a19l3utm3efpy8vihx.png)

Select OS Ubuntu as OS for this server
![Select OS Ubuntu as OS for this server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yy0wsxi4aedxane9em4f.png)

Order confirmation after pay
![Order confirmation after pay](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lgvhgmqyzpxvrvnstu2s.png)

Go to main dashboard https://ztv.su/clientarea.php

Wait 20 minuts...

## Tune remote access

Click to new your server
![Click to new your server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r2i9vwh63duiklz0coyp.png)

Copy ip and password
![Copy ip and password](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1tqtumji02cqq93otyur.png)

Open vscode and install ms-vscode-remote.vscode-remote-extensionpack
![Open vscode and install ms-vscode-remote.vscode-remote-extensionpack](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g177phknsg4o99xpywby.png)

Add your local SSH key to new VPS from Windows PC

```sh
PS C:\Users\Admin> cat ~/.ssh/id_rsa.pub | ssh root@enter-server-ip-address "mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys && chmod -R go= ~/.ssh && cat >> ~/.ssh/authorized_keys"
The authenticity of host 'enter-server-ip-address (enter-server-ip-address)' can't be established.
ECDSA key fingerprint is SHA256:ShA-KeyY.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'enter-server-ip-address' (ECDSA) to the list of known hosts.
root@enter-server-ip-address's password:
```

![Add your local SSH key to new VPS from Windows PC](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wdihccxm62jmzszc7430.png)

Connect to remote server with vscode
![Connect to remote server with vscode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lmjxrh6q8zqbviymwr6o.png)

Click to PLUS and add new connection to ssh server
![Click to PLUS and add new connection to ssh server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f674gy5g0s6jtxo9dt35.png)

Select Linux platform
![Select Linux platform](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ouk5zyhnvvctjj686a3t.png)

After connect you can see remote console and ip of server in left buttom panel
![After connect you can see remote console and ip of server in left buttom panel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kmkohyr1x7cq1t06hsoz.png)

## Tune server

Install all needed software

Update OS

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt autoremove
sudo apt install -f
```

Install dokku to server

> wget https://raw.githubusercontent.com/dokku/dokku/v0.26.8/bootstrap.sh
> sudo DOKKU_TAG=v0.26.8 bash bootstrap.sh

Wait...

## Create application and add deploy script from github

Create application

> dokku apps:create kaufman-bot

```
root@vpsXXXX:~# dokku apps:create kaufman-bot
-----> Creating kaufman-bot...
```

Create ssh key for github in VPS

> mkdir github
> ssh-keygen -C "github" -f github/id_rsa

```
root@vpsXXXX:~# mkdir github
root@vpsXXXX:~# ssh-keygen -C "github" -f github/id_rsa
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in github/id_rsa
Your public key has been saved in github/id_rsa.pub
The key fingerprint is:
SHA256:HASH github
The key's randomart image is:
+---[RSA 3072]----+
|  .o*oo.         |
+----[SHA256]-----+
```

Add created public key to VPS authorized_keys

> cat github/id_rsa.pub >> ~/.ssh/authorized_keys

Add created public key to dokku

> dokku ssh-keys:add github ./github/id_rsa.pub

Show and copy private key
cat > github/id_rsa
![Show and copy private key](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vh3lmminbruzpinh9qc1.png)

Create environment in github
![Create environment in github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kwlr80qw8p2t2f87hrr8.png)

Add created key to github
![Add created key to github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qeh5fqjpq01545bteagu.png)

Add server address to secret env in github
![Add server address to secret env in github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4wln3qj90njqj6guumxh.png)

Add ci config for github .github/workflows/develop.deploy.yml

```yaml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Push to dokku
        uses: dokku/github-action@master
        with:
          branch: 'feature/73'
          git_remote_url: 'ssh://dokku@${{secrets.HOST}}:22/kaufman-bot'
          ssh_private_key: ${{secrets.SSH_PRIVATE_KEY}}
```

Add environment values in dokku server

> dokku config:set kaufman-bot TELEGRAM_BOT_TOKEN=........................

```sh
root@vpsXXXX:~# dokku config:set kaufman-bot TELEGRAM_BOT_TOKEN=........................
-----> Setting config vars
       TELEGRAM_BOT_TOKEN:  ........................
-----> Restarting app kaufman-bot
 !     App image (dokku/kaufman-bot:latest) not found
```

![Add environment values in dokku server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m7bv5s68h3dd15tlyba1.png)

Run redeploy failed pipeline in github
![Run redeploy failed pipeline in github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i22x5czkfzhk750wngc4.png)

After correct deploy, pipeline mark as green badge
![After correct deploy, pipeline mark as green badge](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ocvnj1t7hcrgloz1t5vd.png)

Disable bot in heroku

![Disable bot in heroku](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/woecwwfxrshuc5ol2pue.png)

Test from telegram
![Test from telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hkcfjy7yb4p0vlk3jr82.png)

#kaufmanbot #nestjs #dokku #vps

# [2022-02-13 10:25] NestJS Telegram bot, fix error: 409: Conflict: terminated by other getUpdates request

After deploy i have error on server

> dokku logs kaufman-bot

```sh
root@vpsXXXX:~# dokku logs kaufman-bot
2022-02-21T04:47:54.805369331Z app[web.1]:
2022-02-21T04:47:54.805447585Z app[web.1]: > kaufman-bot@0.0.0 start /app
2022-02-21T04:47:54.805456814Z app[web.1]: > node dist/apps/server/main.js
2022-02-21T04:47:54.805462429Z app[web.1]:
2022-02-21T04:47:55.814014072Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:55 AM     LOG [NestFactory] Starting Nest application...
2022-02-21T04:47:55.879257923Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:55 AM     LOG [InstanceLoader] TelegrafModule dependencies initialized +102ms
2022-02-21T04:47:55.879823802Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:55 AM     LOG [InstanceLoader] ScraperModule dependencies initialized +1ms
2022-02-21T04:47:55.880439058Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:55 AM     LOG [InstanceLoader] DiscoveryModule dependencies initialized +0ms
2022-02-21T04:47:55.881300807Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:55 AM     LOG [InstanceLoader] AppModule dependencies initialized +1ms
2022-02-21T04:47:56.099608409Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:56 AM     LOG [InstanceLoader] TelegrafCoreModule dependencies initialized +219ms
2022-02-21T04:47:56.107084992Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:56 AM     LOG [RoutesResolver] AppController {/api}: +7ms
2022-02-21T04:47:56.111708653Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:56 AM     LOG [RouterExplorer] Mapped {/api, GET} route +5ms
2022-02-21T04:47:56.118433520Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:56 AM     LOG [NestApplication] Nest application successfully started +7ms
2022-02-21T04:47:56.122906904Z app[web.1]: [Nest] 189  - 02/21/2022, 4:47:56 AM     LOG 🚀 Application is running on: http://localhost:5000/api
2022-02-21T04:48:00.985747154Z app[web.1]: (node:189) UnhandledPromiseRejectionWarning: Error: 409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running
2022-02-21T04:48:00.985810814Z app[web.1]:     at Telegram.callApi (/app/node_modules/telegraf/lib/core/network/client.js:264:19)
2022-02-21T04:48:00.985819571Z app[web.1]:     at processTicksAndRejections (internal/process/task_queues.js:95:5)
2022-02-21T04:48:00.985826394Z app[web.1]:     at async Polling.[Symbol.asyncIterator] (/app/node_modules/telegraf/lib/core/network/polling.js:27:33)
2022-02-21T04:48:00.985849961Z app[web.1]:     at async Polling.loop (/app/node_modules/telegraf/lib/core/network/polling.js:70:30)
2022-02-21T04:48:00.985856303Z app[web.1]: (Use `node --trace-warnings ...` to show where the warning was created)
2022-02-21T04:48:00.985872448Z app[web.1]: (node:189) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
2022-02-21T04:48:00.985936312Z app[web.1]: (node:189) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

![dokku logs kaufman-bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4hkved5su9r88x36e7eu.png)

For solve this error change libs/plugins/server/src/lib/scraper/scraper-services/scraper.service.ts

```ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import charset from 'charset';
import cheerio from 'cheerio';
import encoding from 'encoding';
import htmlToText from 'html-to-text';
import jschardet from 'jschardet';
import { render } from 'mustache';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';
import { ScraperCommandsEnum } from '../scraper-types/scraper-commands';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig
  ) {}

  async onMessage(msg) {
    const locale = msg.from?.language_code || null;
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      msg.text.toLowerCase().includes(spyWord.toLowerCase())
    );
    if (spyWord) {
      if (
        msg.text.includes(`/${ScraperCommandsEnum.help}`) ||
        msg.text.includes(ScraperCommandsEnum.help)
      ) {
        const replayHelpMessage =
          (locale && this.scraperConfig.helpLocale?.[locale]) ||
          this.scraperConfig.help;
        return replayHelpMessage;
      }

      const preparedText = msg.text
        .split(spyWord)
        .join('')
        .split('  ')
        .join('')
        .trim();

      const replayMessage = await this.scrap(locale, preparedText);

      if (replayMessage) {
        return replayMessage;
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private async scrap(locale: string, text: string) {
    /*const parsedVariables = parse(this.scraperConfig.uri)
      .filter((arr) => arr[0] === 'name')
      .map((arr) => arr[1]);
    const otherText = text;*/

    const replaceVariables = { text: encodeURIComponent(text.trim()), locale };
    (this.scraperConfig.removeWords || []).forEach((removeWord: string) => {
      text = text
        .replace(new RegExp(removeWord, 'ig'), '')
        .replace(new RegExp(' {2}', 'ig'), ' ')
        .trim();
    });
    const textArray = text.split(' ');
    if (textArray.length > 0) {
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text ${textArrayIndex + 1}`] = textArrayItem;
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text${textArrayIndex + 1}`] =
          textArrayItem.toLowerCase();
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`TEXT${textArrayIndex + 1}`] =
          textArrayItem.toUpperCase();
      });
    }
    const repalcedUri = render(this.scraperConfig.uri, replaceVariables);
    // const replacedText = render(text, replaceVariables);

    const axiosInstance = axios.create({
      timeout: this.scraperConfig.timeout,
      responseEncoding: this.scraperConfig.contentCodepage || 'binary',
    });

    try {
      const response = await axiosInstance.get(repalcedUri);

      const $ = cheerio.load(response.data);
      let content = this.scraperConfig.contentSelector
        .split(',')
        .map((selector: string) => htmlToText.fromString($(selector).html()))
        .join('\n\n');

      const enc =
        charset(response.headers, response.data) ||
        jschardet.detect(response.data).encoding.toLowerCase();

      if (enc !== 'utf8') {
        content = encoding
          .convert(Buffer.from(content, 'binary'), 'utf8', enc, true)
          .toString('utf8');
      }
      return content;
    } catch (err) {
      this.logger.error(err, err.stack);
      return err.toString();
    }
  }
}
```

Change libs/plugins/server/src/lib/scraper/scraper.module.ts

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { ScraperConfig, SCRAPER_CONFIG } from './scraper-config/scraper.config';
import { ScraperService } from './scraper-services/scraper.service';

@Module({})
export class ScraperModule {
  static forRoot(config: ScraperConfig): DynamicModule {
    return {
      module: ScraperModule,
      providers: [
        {
          provide: SCRAPER_CONFIG,
          useValue: config,
        },
        ScraperService,
      ],
      exports: [ScraperService],
    };
  }
}
```

And change apps/server/src/app/app.service.ts

```ts
import { ScraperService } from '@kaufman-bot/plugins/server';
import { Injectable } from '@nestjs/common';
import { Hears, Help, On, Start, Update, Message } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  constructor(private readonly scraperService: ScraperService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }

  @On('text')
  async onMessage(@Message() msg) {
    const scraperReplayMessage = await this.scraperService.onMessage(msg);
    return scraperReplayMessage;
  }
}
```

#kaufmanbot #nestjstelegraf #errors

# [2022-02-26 13:08] Handling nodejs errors in a NestJS application using a telegram bot as an example

Update file **apps/server/src/main.ts**

```ts
//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import env from 'env-var';
import { AppModule } from './app/app.module';

const logger = new Logger('Application');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = env.get('PORT').default(3333).asPortNumber();
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

try {
  bootstrap().catch((err) => {
    logger.error(err, err.stack);
  });
} catch (err) {
  logger.error(err, err.stack);
}

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    logger.log('exit: clean');
  }
  if (exitCode || exitCode === 0) {
    if (exitCode !== 0) {
      logger.error(exitCode, exitCode.stack);
    } else {
      logger.log(`exit: code - ${exitCode}`);
    }
  }
  if (options.exit) {
    process.exit();
  }
}
```

![Console with error](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/615bjnj837mtbfta67x4.png)

#kaufmanbot #node #nestjs #errors

# [2022-02-26 13:15] Create CurrencyConverterModule for telegram bot on NestJS using ScraperModule

Create new library currency-converter

> npm run -- nx g @nrwl/nest:lib currency-converter/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib currency-converter/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "currency-converter/server"

CREATE libs/currency-converter/server/README.md
CREATE libs/currency-converter/server/.babelrc
CREATE libs/currency-converter/server/src/index.ts
CREATE libs/currency-converter/server/tsconfig.json
CREATE libs/currency-converter/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/currency-converter/server/project.json
UPDATE workspace.json
CREATE libs/currency-converter/server/.eslintrc.json
CREATE libs/currency-converter/server/jest.config.js
CREATE libs/currency-converter/server/tsconfig.spec.json
CREATE libs/currency-converter/server/src/lib/currency-converter-server.module.ts
```

Create new library html-scraper

> npm run -- nx g @nrwl/nest:lib html-scraper/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib html-scraper/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "html-scraper/server"

CREATE libs/html-scraper/server/README.md
CREATE libs/html-scraper/server/.babelrc
CREATE libs/html-scraper/server/src/index.ts
CREATE libs/html-scraper/server/tsconfig.json
CREATE libs/html-scraper/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/html-scraper/server/project.json
UPDATE workspace.json
CREATE libs/html-scraper/server/.eslintrc.json
CREATE libs/html-scraper/server/jest.config.js
CREATE libs/html-scraper/server/tsconfig.spec.json
CREATE libs/html-scraper/server/src/lib/html-scraper-server.module.ts
```

Copy exists scraper module to libs/html-scraper/server

> cp -Rf ./libs/plugins/server/src/lib/scraper/\* ./libs/html-scraper/server/src/lib
> rm -r ./libs/html-scraper/server/src/lib/html-scraper-server.module.ts
> npm run generate

Change imports in **apps/server/src/app/app.module.ts**

```ts
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    ScraperModule.forRoot({
      contentSelector:
        '#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > form > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod',
      help: 'Scraper help message',
      spyWords: ['scraper'],
      removeWords: ['to', 'convert', 'please'],
      uri: 'https://www.xe.com/currencyconverter/convert/?Amount={{TEXT1}}&From={{TEXT2}}&To={{TEXT3}}',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Change imports in **apps/server/src/app/app.service.ts**

```ts
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, Help, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly scraperService: ScraperService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }

  @On('text')
  async onMessage(@Message() msg) {
    try {
      const scraperReplayMessage = await this.scraperService.onMessage(msg);
      return scraperReplayMessage;
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
```

Remove old library

> npm run -- nx g @nrwl/workspace:remove plugins-server
> npm run generate

Install needed libraries

> npm i --save class-validator-multi-lang class-transformer-global-storage

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save class-validator-multi-lang class-transformer-global-storage

added 4 packages, and audited 888 packages in 4s

109 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Create new service **libs/currency-converter/server/src/lib/currency-converter-services/currency-converter.service.ts**

```ts
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyConverterService {
  constructor(private readonly scraperService: ScraperService) {}

  async onMessage(msg) {
    const result = await this.scraperService.onMessage(msg);
    if (result && /^[.,0-9]+$/.test(result.split(' ')[0])) {
      return result.split(' ')[0];
    }
    return result;
  }
}
```

Create new module **libs/currency-converter/server/src/lib/currency-converter.module.ts**

```ts
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CurrencyConverterService } from './currency-converter-services/currency-converter.service';

@Module({})
export class CurrencyConverterModule {
  static forRoot(): DynamicModule {
    return {
      module: CurrencyConverterModule,
      imports: [
        ScraperModule.forRoot({
          contentSelector:
            '#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > form > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod',
          help: getText('Currency converter'),
          spyWords: [getText('convert')],
          removeWords: [getText('to'), getText('please')],
          uri: 'https://www.xe.com/currencyconverter/convert/?Amount={{TEXT1}}&From={{TEXT2}}&To={{TEXT3}}',
        }),
      ],
      providers: [CurrencyConverterService],
      exports: [ScraperModule, CurrencyConverterService],
    };
  }
}
```

Add new files to index.ts in libraries and prepare translate words

> npm run generate

Update **apps/server/src/app/app.module.ts**

```ts
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    CurrencyConverterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Update **apps/server/src/app/app.service.ts**

```ts
import { CurrencyConverterService } from '@kaufman-bot/currency-converter/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, Help, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly currencyConverterService: CurrencyConverterService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }

  @On('text')
  async onMessage(@Message() msg) {
    try {
      const replayMessage = await this.currencyConverterService.onMessage(msg);
      return replayMessage;
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
```

Test from telegram
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/psk75zs5ejlgxtupjkfq.png)

#kaufmanbot #nestjs #modules #currency

# [2022-02-13 16:07] Create facts generator for telegram bot with NestJS

You need to go to google and find a site with a free joke generator, the site must not be a SPA

https://www.google.com/search?q=random+fact+generator

I chose the second
![I chose the second](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p69zgwvol0kkq6jwmli1.png)

Create new library facts-generator

> npm run -- nx g @nrwl/nest:lib facts-generator/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib facts-generator/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "facts-generator/server"

CREATE libs/facts-generator/server/README.md
CREATE libs/facts-generator/server/.babelrc
CREATE libs/facts-generator/server/src/index.ts
CREATE libs/facts-generator/server/tsconfig.json
CREATE libs/facts-generator/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/facts-generator/server/project.json
UPDATE workspace.json
CREATE libs/facts-generator/server/.eslintrc.json
CREATE libs/facts-generator/server/jest.config.js
CREATE libs/facts-generator/server/tsconfig.spec.json
CREATE libs/facts-generator/server/src/lib/facts-generator-server.module.ts
```

Go to the site and define a selector for fact text
![Go to the site and define a selector for fact text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jzyuw7ysmzhoon1dqtcu.png)

Go to developer console panel and check selector
![Go to developer console panel and check selector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yzynntj2xmkb4bbgrljo.png)

Create file **libs/facts-generator/server/src/lib/facts-generator-services/facts-generator.service.ts**

```ts
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactsGeneratorService {
  constructor(private readonly scraperService: ScraperService) {}

  async onMessage(msg) {
    let result = await this.scraperService.onMessage(msg);
    if (result !== null) {
      result = result.replace('\n\nTweet [http://twitter.com/share]', '');
    }
    return result;
  }
}
```

Create file **libs/facts-generator/server/src/lib/facts-generator.module.ts**

```ts
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';

@Module({})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          contentSelector: '#z',
          help: getText('Random facts generator'),
          spyWords: [getText('facts')],
          removeWords: [getText('get'), getText('please')],
          uri: 'http://randomfactgenerator.net/',
        }),
      ],
      providers: [FactsGeneratorService],
      exports: [ScraperModule, FactsGeneratorService],
    };
  }
}
```

Run generate all needed files

> npm run generate

Update file **apps/server/src/app/app.module.ts**

```ts
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Update file **apps/server/src/app/app.service.ts**

```ts
import { CurrencyConverterService } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorService } from '@kaufman-bot/facts-generator/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, Help, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly currencyConverterService: CurrencyConverterService,
    private readonly factsGeneratorService: FactsGeneratorService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }

  @On('text')
  async onMessage(@Message() msg) {
    try {
      let replayMessage = await this.currencyConverterService.onMessage(msg);
      if (replayMessage === null) {
        replayMessage = this.factsGeneratorService.onMessage(msg);
      }
      return replayMessage;
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
```

Test from telegram
![Test from telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nfdj6ukeq3ahzlpdqqly.png)

#kaufmanbot #facts #generator #nestjs

# [2022-03-07 01:24] Add multi-language support for telegram bot on NestJS

A lot of changes, I didn’t copy and paste the whole process, I’ll just give a link to the commit, everything is there.

## Links

https://github.com/EndyKaufman/kaufman-bot/commit/641320a74c27e74e46d7da31fbf64348a8978384 - commit with current changes

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Significant changes:

1. Added a new lib for switching languages ​​LanguageSwitherModule
2. Updated old libs and added support for multiple languages
3. Moved general things about processing commands into a separate module

![Significant changes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f1jc68dbi6ades74vvz8.png)

## Screenshots with new logic

![Screenshots with new logic](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vjrpzjwho7c6qvk2a03w.png)

In the next post there will be instructions on how to add new dictionaries with translations...

#kaufmanbot #nestjs #languages #multi

# [2022-03-09 2:06] Add new dictionaries with translations to NestJS application using poedit.net

## Links

https://poedit.net/ - desktop editor for po dictionaries

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://github.com/EndyKaufman/kaufman-bot -source code

## Prepare

Add required libraries if they were not previously installed

> npm i --save-dev rucken
> npm i --save class-validator-multi-lang

Update scripts in package.json if not changed before

```json
  "scripts": {
    ...
    "rucken": "rucken",
    "generate": "npm run rucken -- prepare --locales=en,ru && npm run lint:fix"
    ...
  },
```

## Using Poedit to create dictionaries with translations

Start preparing and generating the necessary files

> npm run generate

Install the translation software for your operating room from https://poedit.net/

I installed for Ubuntu operating system

Run the program and select catalog manager
![Run the program and select catalog manager](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/05em4xgpk00xu4zj5smn.png)

Add folder with project
![Add folder with project](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bosjdi5twqu6dhboi0uy.png)

Set name of project
![Set name of project](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iw74hxo79jncof94vbfx.png)

Add libs and apps folders
![Add libs and apps folders](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pq0og3rw6rl9g2a0zerh.png)

We see all possible translations
![We see all possible translations](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lz8tzmzd3r2xnjdcmlzr.png)

Click on the line with a red circle where not everything is translated
![Click on the line with a red circle where not everything is translated](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/66dbf70b8voxvgk5tsxo.png)

Select suggestion or enter you version of translate
![Select suggestion or enter you version of translate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/leb6gsg48nq65ccuzcr0.png)

Update all dictionaries
![Update all dictionaries
](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/id3qzkd2zodfqnxlxlf5.png)

Run preparing and generating the necessary files

> npm run generate

![Run preparing and generating the necessary files](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yu7wtxkfsf0r0ds245mi.png)

Test from telegram
![Test from telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1n3xnkrullwdoyros73a.png)

Switch language in telegram
![Switch language in telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b3ztv9udemgizi7567ky.png)

In the next post I will use nestjs-custom-injector...

#kaufmanbot #nestjs #translates #poedit

# [2022-03-13 13:43] Use nestjs-custom-injector to create dynamic handlers in NestJS when creating a telegram bot

## Links

https://github.com/EndyKaufman/kaufman-bot - source code

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Installation

> npm i --save nestjs-custom-injector

## Create BotCommandsModule

Module with basic types and utilities, contains a launcher for processing bot commands

### Create an enum with basic commands

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-enum.ts_

```ts
import { getText } from 'class-validator-multi-lang';

export const BotCommandsEnum = {
  help: getText('help'),
  get: getText('get'),
};
```

### Create types of possible return values ​​for bot command handlers

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-provider-action-result-type.ts_

```ts
export type BotCommandsProviderActionResultType<T> =
  | { type: 'markdown'; markdown: string }
  | { type: 'text'; text: string }
  | { type: 'message'; message: T }
  | null;
```

### Create a common interface for providers with bot command handlers

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-provider.interface.ts_

```ts
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';

export const BOT_COMMANDS_PROVIDER = Symbol('BOT_COMMANDS_PROVIDER');

export type BotCommandsProviderActionMsg = Update.MessageUpdate['message'] & {
  text: string;
};

export type BotCommandsProviderActionContext = Context<Update.MessageUpdate>;

export interface BotCommandsProvider {
  onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;

  onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
```

### Creating a hook interface for pre processing of bot commands

_libs/core/server/src/lib/bot-commands/bot-commands-types/on-before-bot-commands.interface.ts_

```ts
import {
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
} from './bot-commands-provider.interface';

export interface OnBeforeBotCommands {
  onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg>;
}
```

### Creating a hook interface for post processing of bot commands

_libs/core/server/src/lib/bot-commands/bot-commands-types/on-after-bot-commands.interface.ts_

```ts
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';
import {
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
} from './bot-commands-provider.interface';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(
    result: TResult,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<{ result: TResult; msg: TMsg }>;
}
```

### Create a service with the main commands necessary in the process of the bot commands

_libs/core/server/src/lib/bot-commands/bot-commands-services/bot-commands-tools.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { render } from 'mustache';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';

@Injectable()
export class BotСommandsToolsService {
  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  generateHelpMessage(
    locale: string,
    name: string,
    descriptions: string,
    usage: string[]
  ) {
    const usageWithLocalized = Array.from(
      new Set([
        ...usage,
        ...usage.map((u) => this.translatesService.translate(u, locale)),
      ])
    );
    const replayHelpMessage = [
      `__${this.translatesService.translate(name, locale)}__`,
      this.translatesService.translate(descriptions, locale),
      `${this.translatesService.translate(
        getText('usage'),
        locale
      )}: ${usageWithLocalized.map((u) => `_${u}_`).join(', ')}`,
    ].join('\n');
    return replayHelpMessage;
  }

  private translateByLowerCase(
    key: string,
    locale?: string,
    context: unknown = {}
  ) {
    this.initLowerCaseTranslates();
    const lowerCaseKey = key.toLowerCase();
    if (!this.lowerCaseTranslates) {
      throw new Error(`lowerCaseTranslates not set`);
    }
    const value =
      (locale && this.lowerCaseTranslates?.[locale]?.[lowerCaseKey]) ||
      lowerCaseKey;
    return value ? render(value, context) : value;
  }

  private initLowerCaseTranslates() {
    if (!this.lowerCaseTranslates) {
      this.lowerCaseTranslates = {};
      Object.keys(this.translatesStorage.translates).forEach(
        (translateLocale) => {
          if (!this.lowerCaseTranslates) {
            throw new Error(`lowerCaseTranslates not set`);
          }
          this.lowerCaseTranslates[translateLocale] = {};
          Object.keys(
            this.translatesStorage.translates[translateLocale]
          ).forEach((translateKey) => {
            if (!this.lowerCaseTranslates?.[translateLocale]) {
              throw new Error(
                `lowerCaseTranslates by locale "${translateLocale}" not set`
              );
            }
            this.lowerCaseTranslates[translateLocale][
              translateKey.toLowerCase()
            ] =
              this.translatesStorage.translates[translateLocale][
                translateKey
              ].toLowerCase();
          });
        }
      );
    }
  }

  clearCommands(text: string, commands: string[], locale: string) {
    const words = text.split(' ');
    const lowerCasedWords = words.map((c) => c.toLowerCase());
    const lowerCasedCommands = commands.map((c) => c.toLowerCase());
    lowerCasedCommands.forEach((command) => {
      lowerCasedWords.forEach((word, wordIndex) => {
        if (command === word) {
          words[wordIndex] = '';
        }
        if (`/${command}` === word) {
          words[wordIndex] = '';
        }
        if (this.translateByLowerCase(command, locale) === word) {
          words[wordIndex] = '';
        }
        if (`/${this.translateByLowerCase(command, locale)}` === word) {
          words[wordIndex] = '';
        }
      });
    });
    return words.join(' ').split('  ').join(' ');
  }

  checkCommands(text: string, commands: string[], locale?: string) {
    const lowerCasedText = (text || '').toLowerCase();
    const lowerCasedCommands = commands.map((c) => c.toLowerCase());
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText.includes(command) ||
          lowerCasedText.includes(`/${command}`)
      )
    ) {
      return true;
    }
    if (
      lowerCasedCommands.find(
        (command) =>
          lowerCasedText.includes(this.translateByLowerCase(command, locale)) ||
          lowerCasedText.includes(
            `/${this.translateByLowerCase(command, locale)}`
          )
      )
    ) {
      return true;
    }
    return false;
  }
}
```

### Create a bot command launcher service

_libs/core/server/src/lib/bot-commands/bot-commands-services/bot-commands.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import { BotCommandsEnum } from '../bot-commands-types/bot-commands-enum';
import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type';
import {
  BotCommandsProvider,
  BotCommandsProviderActionContext,
  BotCommandsProviderActionMsg,
  BOT_COMMANDS_PROVIDER,
} from '../bot-commands-types/bot-commands-provider.interface';
import { OnAfterBotCommands } from '../bot-commands-types/on-after-bot-commands.interface';
import { OnBeforeBotCommands } from '../bot-commands-types/on-before-bot-commands.interface';
import { BotСommandsToolsService } from './bot-commands-tools.service';
@Injectable()
export class BotСommandsService implements BotCommandsProvider {
  @CustomInject(BOT_COMMANDS_PROVIDER, { multi: true })
  private botCommandsProviders!: (BotCommandsProvider &
    Partial<OnBeforeBotCommands> &
    Partial<OnAfterBotCommands>)[];

  constructor(
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const allResults: string[] = [];
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];

      const result = await botCommandsProvider.onHelp(msg, ctx);

      if (result !== null && result.type === 'text') {
        allResults.push(result.text);
      }

      if (result !== null && result.type === 'markdown') {
        allResults.push(result.markdown);
      }
    }
    return {
      type: 'markdown',
      markdown: allResults.join('\n\n'),
    };
  }

  async onMessage<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    msg = await this.processOnBeforeBotCommands(msg, ctx);

    const len = this.botCommandsProviders.length;
    let result: BotCommandsProviderActionResultType<TMsg> = null;
    for (let i = 0; i < len; i++) {
      if (!result) {
        const botCommandsProvider = this.botCommandsProviders[i];

        result = await botCommandsProvider.onMessage(msg, ctx);
      }
    }

    if (
      result === null &&
      this.botСommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        msg.from.language_code
      )
    ) {
      return this.onHelp(msg, ctx);
    }

    const afterBotCommand = await this.processOnAfterBotCommands(
      result,
      msg,
      ctx
    );
    return afterBotCommand.result;
  }

  async processOnBeforeBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<TMsg> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onBeforeBotCommands)
        msg = await botCommandsProvider.onBeforeBotCommands(msg, ctx);
    }
    return msg;
  }

  async processOnAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(
    result: TResult,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext
  ): Promise<{ result: TResult; msg: TMsg }> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onAfterBotCommands) {
        const afterBotCommand = await botCommandsProvider.onAfterBotCommands<
          TMsg,
          TResult
        >(result, msg, ctx);
        result = afterBotCommand.result;
        msg = afterBotCommand.msg;
      }
    }
    return { result, msg };
  }
}
```

### Create a module BotCommandsModule

_libs/core/server/src/lib/bot-commands/bot-commands.module.ts_

```ts
import { Module } from '@nestjs/common';
import { TranslatesModule } from 'nestjs-translates';
import { BotСommandsToolsService } from './bot-commands-services/bot-commands-tools.service';
import { BotСommandsService } from './bot-commands-services/bot-commands.service';

@Module({
  imports: [TranslatesModule],
  providers: [BotСommandsToolsService, BotСommandsService],
  exports: [TranslatesModule, BotСommandsToolsService, BotСommandsService],
})
export class BotCommandsModule {}
```

### Remove the old module folder with utilities if it was

_libs/core/server/src/lib/command-tools_

### Let's start generating a list of files and extracting words for translation

> npm run generate

## Update LanguageSwitherModule

Update the bot command files to work with localization

### Update enum with commands

_libs/language-swither/server/src/lib/language-swither-types/language-swither-commands.ts_

```ts
import { getText } from 'class-validator-multi-lang';

export const LanguageSwitherCommandsEnum = {
  set: getText('set'),
  change: getText('change'),
  ['quick change']: getText('quick change'),
  my: getText('my'),
  current: getText('current'),
};
```

### Update the configuration file

_libs/language-swither/server/src/lib/language-swither-config/language-swither.config.ts_

```ts
export const LANGUAGE_SWITHER_CONFIG = 'LANGUAGE_SWITHER_CONFIG';

export const DEFAULT_LANGUAGE = 'en';

export interface LanguageSwitherConfig {
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  removeWords?: string[];
}
```

### Update service to switch languages

Add the use of an interface to properly define class methods

Add the use of a pre-hook to determine and store the user's language

_libs/language-swither/server/src/lib/language-swither-services/language-swither.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from '../language-swither-config/language-swither.config';
import { LanguageSwitherCommandsEnum } from '../language-swither-types/language-swither-commands';

@Injectable()
export class LanguageSwitherService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(LanguageSwitherService.name);

  private readonly languageOfUsers: Record<number, string> = {};

  constructor(
    @Inject(LANGUAGE_SWITHER_CONFIG)
    private readonly languageSwitherConfig: LanguageSwitherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly commandToolsService: BotСommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale =
      this.languageOfUsers[msg.from?.id] ||
      msg.from?.language_code ||
      DEFAULT_LANGUAGE;
    if (msg.from?.id && !this.languageOfUsers[msg.from?.id]) {
      this.languageOfUsers[msg.from?.id] = locale;
    } else {
      if (locale) {
        msg.from.language_code = locale;
      }
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.languageSwitherConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.languageOfUsers[msg.from?.id];
    const spyWord = this.languageSwitherConfig.spyWords.find((spyWord) =>
      this.commandToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.commandToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          markdown: this.commandToolsService.generateHelpMessage(
            locale,
            this.languageSwitherConfig.name,
            this.languageSwitherConfig.descriptions,
            this.languageSwitherConfig.usage
          ),
        };
      }

      const preparedText = this.commandToolsService.clearCommands(
        msg.text,
        [
          spyWord,
          ...Object.keys(LanguageSwitherCommandsEnum),
          ...(this.languageSwitherConfig.removeWords || []),
        ],
        locale
      );

      const processedMsg = await this.process(msg, locale, preparedText);

      if (typeof processedMsg === 'string') {
        return {
          type: 'text',
          text: processedMsg,
        };
      }
      if (processedMsg) {
        return { type: 'message', message: processedMsg };
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private async process<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, locale: string, text: string) {
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [
          LanguageSwitherCommandsEnum.set,
          LanguageSwitherCommandsEnum.change,
          LanguageSwitherCommandsEnum['quick change'],
        ],
        locale
      )
    ) {
      if (
        !Object.keys(this.translatesStorage.translates)
          .map((key) => key.toLowerCase())
          .includes(text.trim().toLowerCase())
      ) {
        const currentLocale = this.languageOfUsers[msg.from?.id];
        return this.translatesService.translate(
          getText(
            `locale "{{locale}}" not founded, current locale: "{{currentLocale}}"`
          ),
          currentLocale,
          {
            locale: text.trim().toLowerCase(),
            currentLocale,
          }
        );
      }
      const inputLocale =
        Object.keys(this.translatesStorage.translates).find((lang) =>
          text
            .split(' ')
            .find((key) => key.toLowerCase() === lang.toLowerCase())
        ) || locale;
      locale = inputLocale || locale;
      msg.from.language_code = inputLocale || locale;
      this.languageOfUsers[msg.from?.id] = inputLocale || locale;

      return this.translatesService.translate(
        getText(`locale changed, current locale: "{{locale}}"`),
        locale,
        {
          locale,
        }
      );
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [LanguageSwitherCommandsEnum.my, LanguageSwitherCommandsEnum.current],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`you locale: {{locale}}`),
        locale,
        { locale }
      );
    }
    return msg;
  }
}
```

### Update the module and add character token usage to add provider

_libs/language-swither/server/src/lib/language-swither.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from './language-swither-config/language-swither.config';
import { LanguageSwitherService } from './language-swither-services/language-swither.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class LanguageSwitherModule {
  static forRoot(): DynamicModule {
    return {
      module: LanguageSwitherModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [LanguageSwitherModule],
          providers: [
            {
              provide: LANGUAGE_SWITHER_CONFIG,
              useValue: <LanguageSwitherConfig>{
                name: getText('Language swither'),
                usage: [
                  getText('my locale'),
                  getText('change locale to ru'),
                  getText('locale help'),
                ],
                descriptions: getText(
                  'Commands for setting and changing the current user language'
                ),
                spyWords: [getText('lang'), getText('locale')],
                removeWords: [
                  getText('change'),
                  getText('please'),
                  getText('to'),
                ],
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: LanguageSwitherService,
            },
          ],
          exports: [LANGUAGE_SWITHER_CONFIG],
        }),
      ],
    };
  }
}
```

## Update FactsGeneratorModule

### Update service

Add the use of an interface to properly define class methods

_libs/facts-generator/server/src/lib/facts-generator-services/facts-generator.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactsGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (
      this.botСommandsToolsService.checkCommands(
        msg.text,
        [...Object.keys(BotCommandsEnum)],
        locale
      )
    ) {
      const result = await this.scraperService.onMessage(msg);
      try {
        if (result?.type === 'text') {
          return {
            type: 'text',
            text: result.text
              .replace('\n\nTweet [http://twitter.com/share]', '')
              .split('\\"')
              .join('"')
              .split('\n')
              .join(' '),
          };
        }
        return result;
      } catch (err) {
        console.debug(result);
        console.error(err, err.stack);
        throw err;
      }
    }
    return null;
  }
}
```

### Update the module and add character token usage to add provider

_libs/facts-generator/server/src/lib/facts-generator.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          name: getText('Facts generator'),
          descriptions: getText('Command to generate text with a random fact'),
          usage: [getText('get facts'), getText('facts help')],
          contentSelector: '#z',
          spyWords: [getText('facts')],
          removeWords: [getText('get'), getText('please')],
          uri: 'http://randomfactgenerator.net/',
        }),
      ],
      providers: [
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: FactsGeneratorService,
        },
      ],
      exports: [ScraperModule],
    };
  }
}
```

## Update CurrencyConverterModule

### Update service

Add the use of an interface to properly define class methods

_libs/currency-converter/server/src/lib/currency-converter-services/currency-converter.service.ts_

```ts
import {
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CurrencyConverterService implements BotCommandsProvider {
  constructor(private readonly scraperService: ScraperService) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const result = await this.scraperService.onMessage(msg);
    if (
      result?.type === 'text' &&
      /^[.,0-9]+$/.test(result.text.split(' ')[0])
    ) {
      return {
        type: 'text',
        text: result.text.split(' ')[0],
      };
    }
    return result;
  }
}
```

### Update the module and add character token usage to add provider

_libs/currency-converter/server/src/lib/currency-converter.module.ts_

```ts
import { BOT_COMMANDS_PROVIDER } from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CurrencyConverterService } from './currency-converter-services/currency-converter.service';

@Module({})
export class CurrencyConverterModule {
  static forRoot(): DynamicModule {
    return {
      module: CurrencyConverterModule,
      imports: [
        ScraperModule.forRoot({
          name: getText('Currency converter'),
          descriptions: getText('Command to convert one currency to another'),
          usage: [getText('convert 1 usd to eur'), getText('converter help')],
          contentSelector:
            '#__next > div:nth-child(2) > div.fluid-container__BaseFluidContainer-qoidzu-0.gJBOzk > section > div:nth-child(2) > div > main > form > div:nth-child(2) > div:nth-child(1) > p.result__BigRate-sc-1bsijpp-1.iGrAod',
          spyWords: [getText('convert'), getText('converter')],
          removeWords: [getText('to'), getText('please')],
          uri: 'https://www.xe.com/currencyconverter/convert/?Amount={{TEXT1}}&From={{TEXT2}}&To={{TEXT3}}',
        }),
      ],
      providers: [
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: CurrencyConverterService,
        },
      ],
      exports: [ScraperModule],
    };
  }
}
```

## Generating a list of files and extracting words for translation

> npm run generate

## Check all logic for correct work from telegram

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zybimmn0hrma94gk1kuk.png)

In the next post there will be instructions on how to add dev infrastructure to docker compose...

Use nestjs-custom-injector to create dynamic handlers in NestJS when creating a telegram bot
Add up to 4 tagsMaximum 4 selections
Selected items:

#nestjs #kaufmanbot #providers #multi
