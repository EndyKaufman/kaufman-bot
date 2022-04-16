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

### Generating a list of files and extracting words for translation

> npm run generate

## Update application files

### Update app service

_apps/server/src/app/app.service.ts_

```ts
import {
  BotCommandsProviderActionMsg,
  BotСommandsService,
} from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botСommandsService: BotСommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
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
  async onMessage(ctx) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.botСommandsService.onMessage(msg);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      ctx.reply(result.text);
      return;
    }
  }
}
```

### Update app module

_apps/server/src/app/app.module.ts_

```ts
import { BotCommandsModule } from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    BotCommandsModule,
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Check all logic for correct work from telegram

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zybimmn0hrma94gk1kuk.png)

In the next post there will be instructions on how to add dev infrastructure to docker compose...

#nestjs #kaufmanbot #providers #multi

# [2022-03-19 16:10] Add dev and prod infrastructure on docker compose for NestJS application

In the future, various databases and other self-host solutions will be needed for the application to work; in order not to experience problems with installing and running such services, you need to add developer infrastructure

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Installing the required software

I have an Ubuntu operating system and I describe all the solutions only for this operating system
For other operating systems, look for the instructions yourself

### Docker

https://docs.docker.com/engine/install/ubuntu/

```sh
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
dockerd-rootless-setuptool.sh install
sudo chown $USER /var/run/docker.sock
sudo systemctl restart docker
```

### Docker compose

https://docs.docker.com/compose/install/#install-compose

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
```

## Prepare common files

### Create dockerignore file in root directory

_.dockerignore_

```sh
node_modules
tmp
```

### Add additional scripts to packge.json

_package.json_

```json
...
    "docker:dev:down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-down.sh",
    "docker:dev:restart": "npm run docker:dev:down && npm run docker:dev:up",
    "docker:dev:up": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-up.sh",
    "docker:prod:build-sources": "npm run build",
    "docker:prod:down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/prod/docker-compose-down.sh",
    "docker:prod:restart": "npm run docker:prod:down && npm run docker:prod:up",
    "docker:prod:up": "export $(xargs < ./.env.local) > /dev/null 2>&1 && npm run docker:prod:build-sources && ./docker/prod/docker-compose-up.sh"
...
```

## Create developer infrastructure

### Add docker compose file

_docker/dev/docker-compose.yml_

```yaml
version: '3'
networks:
  kaufman-bot-network:
    ipam:
      config:
        - subnet: '172.6.0.0/16'

services:
  kaufman-bot-server:
    image: node:16-alpine
    user: ${CURRENT_UID}
    container_name: 'kaufman-bot-server'
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - PORT=3000
    ports:
      - '3000:3000'
      - '9229:9229'
    working_dir: '/app'
    volumes:
      - ./../../:/app
    networks:
      - kaufman-bot-network
    command: 'npm run serve'
    tty: true
```

### Add up script file

_docker/dev/docker-compose-up.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d
```

### Add down script file

_docker/dev/docker-compose-down.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker-compose -f ./docker/dev/docker-compose.yml down
```

## Create production infrastructure

### Add docker compose file

_docker/prod/docker-compose.yml_

```yaml
version: '3'
networks:
  kaufman-bot-network:
    ipam:
      config:
        - subnet: '172.6.0.0/16'

services:
  kaufman-bot-server:
    image: node:16-alpine
    user: ${CURRENT_UID}
    container_name: 'kaufman-bot-server'
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - PORT=3000
    ports:
      - '3000:3000'
      - '9229:9229'
    working_dir: '/app'
    volumes:
      - ./../../:/app
    networks:
      - kaufman-bot-network
    command: 'npm run start'
    tty: true
```

### Add up script file

_docker/prod/docker-compose-up.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker-compose -f ./docker/prod/docker-compose.yml --compatibility up -d
```

### Add down script file

_docker/prod/docker-compose-down.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker-compose -f ./docker/prod/docker-compose.yml down
```

## Run and test from telegram

### Start dev infra

> npm run docker:dev:up

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run docker:dev:up

> kaufman-bot@0.0.0 docker:dev:up
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-up.sh

Creating network "dev_kaufman-bot-network" with the default driver
Creating kaufman-bot-server ... done

```

### Check status of created containers

> docker status

```sh
CONTAINER ID   NAME                 CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O     PIDS
ea93db120ed3   kaufman-bot-server   0.34%     304.4MiB / 13.57GiB   2.19%     3.67MB / 158kB   0B / 49.2kB   59
```

![Check status of created containers](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tbdta96bm1lrzay9it7i.png)

### Show all logs of containers

> docker-compose -f ./docker/dev/docker-compose.yml logs

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ docker-compose  -f ./docker/dev/docker-compose.yml logs
Attaching to kaufman-bot-server
kaufman-bot-server    |
kaufman-bot-server    | > kaufman-bot@0.0.0 serve
kaufman-bot-server    | > npm run nx -- serve server
kaufman-bot-server    |
kaufman-bot-server    |
kaufman-bot-server    | > kaufman-bot@0.0.0 nx
kaufman-bot-server    | > nx "serve" "server"
kaufman-bot-server    |
kaufman-bot-server    |
kaufman-bot-server    | > nx run server:serve
kaufman-bot-server    |
kaufman-bot-server    | chunk (runtime: main) main.js (main) 49.7 KiB [entry] [rendered]
kaufman-bot-server    | webpack compiled successfully (5a171399d4564c11)
kaufman-bot-server    | Debugger listening on ws://localhost:9229/78012d34-483b-4d11-ace7-7d4bd30708e9
kaufman-bot-server    | For help, see: https://nodejs.org/en/docs/inspector
kaufman-bot-server    | Issues checking in progress...
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [NestFactory] Starting Nest application...
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] TelegrafModule dependencies initialized +57ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] TranslatesModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] LanguageSwitherModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] LanguageSwitherModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] DiscoveryModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] CustomInjectorCoreModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] TranslatesModuleCore dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] TranslatesModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] BotCommandsModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] ScraperModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] ScraperModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] CustomInjectorModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] FactsGeneratorModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] CurrencyConverterModule dependencies initialized +0ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] AppModule dependencies initialized +1ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [InstanceLoader] TelegrafCoreModule dependencies initialized +292ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [RoutesResolver] AppController {/api}: +5ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [RouterExplorer] Mapped {/api, GET} route +2ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [TranslatesBootstrapService] onModuleInit
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [TranslatesStorage] Add 2 translates for locale: en
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [TranslatesStorage] Add 2 translates for locale: ru
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [NestApplication] Nest application successfully started +2ms
kaufman-bot-server    | [Nest] 57  - 03/19/2022, 10:57:17 AM     LOG [Application] ���� Application is running on: http://localhost:3000/api
kaufman-bot-server    | No issues found.
```

![Show all logs of containers](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/huzea7l9xmj2rj3zeuxh.png)

### Check work from telegram

![Check work from telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uf733hw63tw9hwi9gdgf.png)

### Stop dev infra

> npm run docker:dev:down

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run docker:dev:down

> kaufman-bot@0.0.0 docker:dev:down
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-down.sh

Stopping kaufman-bot-server ... done
Removing kaufman-bot-server ... done
Removing network dev_kaufman-bot-network
```

![Stop dev infra](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p9rqkltfbdvq1ngw6mai.png)

The next post will be adding a database to dev infra and dokku infra...

#nestjs #kaufmanbot #docker #infrastructure

# [2022-03-19 19:33] Add postgres to docker compose and dokku infrastructure for telegram bot in NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://github.com/dokku/dokku-postgres - dokku-postgres plugin for docker compose

https://github.com/EndyKaufman/postgres-default - 13 postgres with enabled extensions

## Add postgres to dev and prod infrastructure

Setting up a database for prod and dev infra is the same, I describe only for dev infra

### Update docker compose file

_docker/dev/docker-compose.yml_

```yaml
version: '3'
networks:
  kaufman-bot-network:
    ipam:
      config:
        - subnet: '172.6.0.0/16'

volumes:
  kaufman-bot-postgres-volume:
    external: true

services:
  kaufman-bot-postgres:
    image: 'endykaufman/postgres-default'
    container_name: 'kaufman-bot-postgres'
    environment:
      - POSTGRES_USER=${ROOT_POSTGRES_USER}
      - POSTGRES_PASSWORD=${ROOT_POSTGRES_PASSWORD}
      - POSTGRES_DB=postgres
    env_file:
      - ../../.env.local
    ports:
      - '5432:5432'
    volumes:
      - kaufman-bot-postgres-volume:/var/lib/postgresql/data
    networks:
      - kaufman-bot-network

  kaufman-bot-server:
    image: node:16-alpine
    user: ${CURRENT_UID}
    container_name: 'kaufman-bot-server'
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - PORT=3000
    ports:
      - '3000:3000'
      - '9229:9229'
    working_dir: '/app'
    volumes:
      - ./../../:/app
    networks:
      - kaufman-bot-network
    command: 'npm run serve'
    tty: true
    depends_on:
      - kaufman-bot-postgres
```

### Update you env file

_.env.local_

```sh
TELEGRAM_BOT_TOKEN=1111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ROOT_POSTGRES_USER=postgres
ROOT_POSTGRES_PASSWORD=postgres
```

### Update up script

_docker/dev/docker-compose-up.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=kaufman-bot-postgres-volume --label=kaufman-bot-postgres-volume
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d
```

### Add second down script with drop volume

_docker/dev/docker-compose-clean-down.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker-compose -f ./docker/dev/docker-compose.yml down
docker volume rm kaufman-bot-postgres-volume --force
```

### For prod infra, we do the same thing only in other folders

![For prod infra, we do the same thing only in other folders](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w60ivgy7xa2tsl17fuiq.png)

### Add new scripts to package.json

_package.json_

```json
...
    "docker:dev:clean-down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-clean-down.sh",
    "docker:dev:clean-restart": "npm run docker:dev:clean-down && npm run docker:dev:up",
    "docker:prod:clean-down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/prod/docker-compose-clean-down.sh",
    "docker:prod:clean-restart": "npm run docker:prod:clean-down && npm run docker:prod:up"
...
```

### Restart dev infra

> npm run docker:dev:clean-restart

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run docker:dev:clean-restart

> kaufman-bot@0.0.0 docker:dev:clean-restart
> npm run docker:dev:clean-down && npm run docker:dev:up


> kaufman-bot@0.0.0 docker:dev:clean-down
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-clean-down.sh

Stopping kaufman-bot-server   ... done
Stopping kaufman-bot-postgres ... done
Removing kaufman-bot-server   ... done
Removing kaufman-bot-postgres ... done
Removing network dev_kaufman-bot-network
kaufman-bot-postgres-volume

> kaufman-bot@0.0.0 docker:dev:up
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-up.sh

kaufman-bot-postgres-volume
Creating network "dev_kaufman-bot-network" with the default driver
Creating kaufman-bot-postgres ... done
Creating kaufman-bot-server   ... done
```

![Restart dev infra](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9ukfd430eps5ohtklfoz.png)

### Check database

Connect to container with database

> docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh
> ![Connect to container with database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w5cemke0uyph6m00nlfc.png)

Switch user

> su postgres

Run psql mode

> psql

Select database name

> SELECT current_database();

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh
# su postgres
postgres@48966265f189:/$ psql
psql (13.3 (Debian 13.3-1.pgdg100+1))
Type "help" for help.

postgres=# SELECT current_database();
 current_database
------------------
 postgres
(1 row)

postgres=#
```

![Check database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ufeeo3kb3dett48ze3k9.png)

## Add postgres to dukku infrastructure (on server)

### Install dokku-postgres

Now we connect via ssh to our server on Ubuntu and set up work with postgres

> sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres

```
root@vps17825:~# sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
-----> Cloning plugin repo https://github.com/dokku/dokku-postgres.git to /var/lib/dokku/plugins/available/postgres
Cloning into 'postgres'...
remote: Enumerating objects: 2356, done.
remote: Counting objects: 100% (417/417), done.
remote: Compressing objects: 100% (276/276), done.
remote: Total 2356 (delta 244), reused 267 (delta 118), pack-reused 1939
Receiving objects: 100% (2356/2356), 483.24 KiB | 3.48 MiB/s, done.
Resolving deltas: 100% (1580/1580), done.
-----> Plugin postgres enabled
Adding user dokku to group adm
Starting nginx (via systemctl): nginx.service.
14.1: Pulling from library/postgres
5eb5b503b376: Pull complete
daa0467a6c48: Pull complete
7cf625de49ef: Pull complete
bb8afcc973b2: Pull complete
c74bf40d29ee: Pull complete
2ceaf201bb22: Pull complete
1255f255c0eb: Pull complete
d27501cd0cca: Pull complete
ff5b6d09a5d0: Pull complete
f635aec27645: Pull complete
a165c6729250: Pull complete
b0aa4f86b611: Pull complete
9efc4664d9d2: Pull complete
Digest: sha256:3162a6ead070474b27289f09eac4c865e75f93847a2d7098f718ee5a721637c4
Status: Downloaded newer image for postgres:14.1
docker.io/library/postgres:14.1
1.31.1-uclibc: Pulling from library/busybox
76df9210b28c: Pull complete
Digest: sha256:cd421f41ebaab52ae1ac91a8391ddbd094595264c6e689954b79b3d24ea52f88
Status: Downloaded newer image for busybox:1.31.1-uclibc
docker.io/library/busybox:1.31.1-uclibc
0.3.3: Pulling from dokku/ambassador
aad63a933944: Pull complete
2888dfab2eb5: Pull complete
51ccf60e0642: Pull complete
Digest: sha256:87c0214e190e7f6975953027157a8933701596b4b864ff66dd3cc3f6ead5c38d
Status: Downloaded newer image for dokku/ambassador:0.3.3
docker.io/dokku/ambassador:0.3.3
0.10.3: Pulling from dokku/s3backup
aad63a933944: Already exists
6654c5b7b2dc: Pull complete
26abcd9faf98: Pull complete
d1a36cd3ba61: Pull complete
9517d44e685b: Pull complete
32e8b2c4797f: Pull complete
Digest: sha256:3651f8ef12000206df55fec8ad4860d6f26b2b5af1308c0e2358253641626024
Status: Downloaded newer image for dokku/s3backup:0.10.3
docker.io/dokku/s3backup:0.10.3
0.4.3: Pulling from dokku/wait
aad63a933944: Already exists
3409ea528c35: Pull complete
88e35d065209: Pull complete
Digest: sha256:5eb9da766abdd5e8cedbde9870acd4b54c1c7e63e72c99e338b009d06f808f04
Status: Downloaded newer image for dokku/wait:0.4.3
docker.io/dokku/wait:0.4.3
-----> Priming bash-completion cache
root@vps17825:~#
```

### Create database service

I am using my custom build with UUID extension enabled https://hub.docker.com/r/endykaufman/postgres-default

> dokku postgres:create global-postgres --image "endykaufman/postgres-default" --image-version latest --root-password=ROOT_PASSWORD --password=ADMIN_PASSWORD

```sh
root@vps17825:~# dokku postgres:create global-postgres --image "endykaufman/postgres-default" --root-password=ROOT_PASSWORD --password=ADMIN_PASSWORD
/var/lib/dokku/plugins/enabled/postgres/subcommands/create: illegal option -- -
/var/lib/dokku/plugins/enabled/postgres/subcommands/create: illegal option -- -
Error response from daemon: manifest for endykaufman/postgres-default:14.1 not found: manifest unknown: manifest unknown
 !     Postgres image endykaufman/postgres-default:14.1 pull failed
root@vps17825:~# dokku postgres:create global-postgres --image "endykaufman/postgres-default" --image-version latest --root-password=ROOT_PASSWORD --password=ADMIN_PASSWORD
/var/lib/dokku/plugins/enabled/postgres/subcommands/create: illegal option -- -
/var/lib/dokku/plugins/enabled/postgres/subcommands/create: illegal option -- -
latest: Pulling from endykaufman/postgres-default
b4d181a07f80: Pull complete
46ca1d02c28c: Pull complete
a756866b5565: Pull complete
36c49e539e90: Pull complete
664019fbcaff: Pull complete
727aeee9c480: Pull complete
796589e6b223: Pull complete
6664992e747d: Pull complete
0f933aa7ccec: Pull complete
99b5e5d88b32: Pull complete
a901b82e6004: Pull complete
625fd35fd0f3: Pull complete
9e37bf358a5d: Pull complete
8c5f37d7fa57: Pull complete
Digest: sha256:a3d342741451f717b79b2404e88363ea902a769d45a0bd7dbbbeeb73bb443f93
Status: Downloaded newer image for endykaufman/postgres-default:latest
docker.io/endykaufman/postgres-default:latest
 !     Specified password may not be as secure as the auto-generated password
       Waiting for container to be ready
       Creating container database
       Securing connection to database
=====> Postgres container created: global-postgres
=====> global-postgres postgres service information
       Config dir:          /var/lib/dokku/services/postgres/global-postgres/data
       Config options:
       Data dir:            /var/lib/dokku/services/postgres/global-postgres/data
       Dsn:                 postgres://postgres:assword=ADMIN_PASSWORD@dokku-postgres-global-postgres:5432/global_postgres
       Exposed ports:       -
       Id:                  50dbeaef39b80ca97823ad35ac771b241c2214eb3bd5cd81564f9dee546ae783
       Internal ip:         172.17.0.5
       Links:               -
       Service root:        /var/lib/dokku/services/postgres/global-postgres
       Status:              running
       Version:             endykaufman/postgres-default:latest
```

### List all postgres services

> dokku postgres:list

![List all postgres services](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/assvwsu1ghif4sob7uvh.png)

### Check database

Connect to database

> dokku postgres:connect global-postgres
> ![Connect to database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x0tpgsk9x1hr7u36yqup.png)

Select database name

> SELECT current_database();

```sh
root@vps17825:~# dokku postgres:connect global-postgres
psql (13.3 (Debian 13.3-1.pgdg100+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

global_postgres=# SELECT current_database();
 current_database
------------------
 global_postgres
(1 row)

global_postgres=#
```

![Check database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r159dpb4zehtz2x2ixex.png)

In the next post, we will create a database for the application and the first migration via flyway

#nestjs #kaufmanbot #docker #postgres

# [2022-03-26 11:45] Create a database for the application and create first migration via flyway

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://flywaydb.org - flyway is an open-source database migration tool. It strongly favors simplicity and convention over configuration

https://www.npmjs.com/package/node-flywaydb - NodeJs wrapper for flywaydb cli

https://github.com/rucken/rucken - my little utilities for nx monorepositories

## Install dependencies

Install the cross database tool for working with migrations

> npm i --save-dev node-flywaydb

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev node-flywaydb

added 14 packages, and audited 918 packages in 3s

115 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

Install a utility for parsing database connection strings

> npm i --save connection-string

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save connection-string

up to date, audited 938 packages in 2s

115 packages are looking for funding
  run `npm fund` for details

1 high severity vulnerability

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

Update or install the latest version of the utility for nx monorepositories, the latest version has a command to create a non-root application database

> npm i --save-dev rucken@latest

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev rucken@latest

added 19 packages, changed 1 package, and audited 938 packages in 4s

115 packages are looking for funding
  run `npm fund` for details

1 high severity vulnerability

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

## Connect flyway

### Update package.json

_package.json_

```json
{
...
    "flyway": "flyway -c .flyway.js",
    "migrate": "npm run flyway -- migrate",
    "migrate:local": "export $(xargs < ./.env.local) && npm run migrate"
...
}
```

### Add configuration file for flyway

_.flyway.js_

```js
const { ConnectionString } = require('connection-string');
const cs = new ConnectionString(
  process.env.POSTGRES_URL || process.env.DATABASE_URL
);
const {
  user: USERNAME,
  password: PASSWORD,
  HOST = cs.host,
  DATABASE = cs.path && cs.path[0],
  SCHEMA = cs.params && cs.params.schema,
  SCHEMAS = cs.params && cs.params.schemas,
} = cs;

module.exports = {
  flywayArgs: {
    url: `jdbc:postgresql://${HOST}/${DATABASE}`,
    schemas: SCHEMAS || SCHEMA,
    defaultSchema: SCHEMA,
    locations: `filesystem:migrations`,
    user: USERNAME,
    password: PASSWORD,
    table: '__migrations',
    sqlMigrationSuffixes: '.pgsql',
  },
  // Use to configure environment variables used by flyway
  env: {
    JAVA_ARGS: '-Djava.util.logging.config.file=./conf/logging.properties',
  },
  version: '6.3.2', // optional, empty or missing will download the latest
  mavinPlugins: [
    {
      // optional, use to add any plugins (ie. logging)
      groupId: 'org.slf4j',
      artifactId: 'slf4j-api',
      version: '1.7.25',
      // This can be a specifc url to download that may be different then the auto generated url.
      downloadUrl:
        'https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.25/slf4j-api-1.7.25.jar',
    },
    {
      groupId: 'org.slf4j',
      artifactId: 'slf4j-jdk14',
      version: '1.7.25',
    },
  ],
  downloads: {
    storageDirectory: `${__dirname}/tmp`, // optional, the specific directory to store the flyway downloaded files. The directory must be writable by the node app process' user.
    expirationTimeInMs: -1, // optional, -1 will never check for updates, defaults to 1 day.
  },
};
```

### Update env file

_.env.local_

```sh
TELEGRAM_BOT_TOKEN=1111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ROOT_POSTGRES_USER=postgres
ROOT_POSTGRES_PASSWORD=postgres
ROOT_POSTGRES_URL=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@localhost:5432/postgres?schema=public
SERVER_POSTGRES_URL=postgres://admin_develop:password_develop@localhost:5432/kaufman_bot_develop?schema=public
```

## Add migrations

Let's create a migration to store the telegram user's language

_migrations/V202203252131\_\_CreateUserTable.pgsql_

```sql
CREATE TABLE IF NOT EXISTS "User" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "telegramId" varchar(64) NOT NULL,
    "langCode" varchar(64) DEFAULT 'en' NOT NULL,
    CONSTRAINT "PK_USERS" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_USERS__TELEGRAM_ID" ON "User" ("telegramId");
```

Add test data

_migrations/V202203252144\_\_ExampleDataForUserTable.pgsql_

```sql
INSERT INTO "User" ("telegramId")
    VALUES ('testId')
ON CONFLICT ("telegramId")
    DO NOTHING;
```

## Update dev infra

### Update docker compose config

_docker/dev/docker-compose.yml_

```yaml
---
services:
  kaufman-bot-postgres:
    image: 'endykaufman/postgres-default'
    container_name: 'kaufman-bot-postgres'
    environment:
      - POSTGRES_USER=${ROOT_POSTGRES_USER}
      - POSTGRES_PASSWORD=${ROOT_POSTGRES_PASSWORD}
      - POSTGRES_DB=postgres
    env_file:
      - ../../.env.local
    ports:
      - '5432:5432'
    volumes:
      - kaufman-bot-postgres-volume:/var/lib/postgresql/data
    networks:
      - kaufman-bot-network
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 5s
      retries: 5
```

### Update up script

_docker/dev/docker-compose-up.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=kaufman-bot-postgres-volume --label=kaufman-bot-postgres-volume
# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d kaufman-bot-postgres
# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done
# Create all need application databases by exists match evn key and nx app name
# for app: "server" - env: SERVER_POSTGRES_URL
# for app: "core-server" - env: CORE_SERVER_POSTGRES_URL
npm run rucken -- postgres
# Run migrate database for specific database
export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
# Start all services
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d
```

For prod infra, we do the same thing only in other folders

### Restart dev infra

> npm run docker:dev:clean-restart

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run docker:dev:clean-restart

> kaufman-bot@0.0.0 docker:dev:clean-restart
> npm run docker:dev:clean-down && npm run docker:dev:up


> kaufman-bot@0.0.0 docker:dev:clean-down
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-clean-down.sh

Stopping kaufman-bot-server   ... done
Stopping kaufman-bot-postgres ... done
Removing kaufman-bot-server   ... done
Removing kaufman-bot-postgres ... done
Removing network dev_kaufman-bot-network
kaufman-bot-postgres-volume

> kaufman-bot@0.0.0 docker:dev:up
> export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-up.sh

kaufman-bot-postgres-volume
Creating network "dev_kaufman-bot-network" with the default driver
Creating kaufman-bot-postgres ... done
/var/run/postgresql:5432 - no response
Waiting for postgres...
/var/run/postgresql:5432 - accepting connections

> kaufman-bot@0.0.0 rucken
> rucken "postgres"


> kaufman-bot@0.0.0 migrate
> npm run flyway -- migrate


> kaufman-bot@0.0.0 flyway
> flyway -c .flyway.js "migrate"

Flyway Community Edition 6.3.2 by Redgate
Database: jdbc:postgresql://localhost:5432/kaufman_bot_develop (PostgreSQL 13.3)
WARNING: Flyway upgrade recommended: PostgreSQL 13.3 is newer than this version of Flyway and support has not been tested. The latest supported version of PostgreSQL is 12.
Successfully validated 2 migrations (execution time 00:00.013s)
Creating Schema History table "public"."__migrations" ...
Current version of schema "public": << Empty Schema >>
Migrating schema "public" to version 202203252131 - CreateUserTable
Migrating schema "public" to version 202203252144 - ExampleDataForUserTable
Successfully applied 2 migrations to schema "public" (execution time 00:00.043s)
kaufman-bot-postgres is up-to-date
Creating kaufman-bot-server ... done
```

### Check database

Connect to container with database

> docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh

Connect with psql to application database

> set PGPASSWORD=password_develop&& psql -d kaufman_bot_develop -U admin_develop

Select telegram users

> select \* from "User";

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh
# set PGPASSWORD=password_develop&& psql -d kaufman_bot_develop -U admin_develop
psql (13.3 (Debian 13.3-1.pgdg100+1))
Type "help" for help.

kaufman_bot_develop=> select * from "User";
                  id                  | telegramId | langCode
--------------------------------------+------------+----------
 c98e49b5-2fa5-4748-896d-1dbca9cc7112 | testId     | en
(1 row)
```

![Check database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6i7t960eazvlacimtrlg.png)

In the next post, we will create a database in dokku infra and set up migration from github

#kaufmanbot #postgres #flyway #migrations

# [2022-03-26 16:22] Create a database for the application and create first migration via flyway

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners - instruction for github runners

## Add self host runner in vps

Navigate to https://github.com/YOU_NAME/YOU_REPOSITORY_NAME/settings/actions/runners/new?arch=x64&os=linux and read about install steps

```sh
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.288.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.288.1/actions-runner-linux-x64-2.288.1.tar.gz
echo "CUSTOM_NUMBERS  actions-runner-linux-x64-2.288.1.tar.gz" | shasum -a 256 -c
tar xzf ./actions-runner-linux-x64-2.288.1.tar.gz
export RUNNER_ALLOW_RUNASROOT=true && ./config.sh --url https://github.com/EndyKaufman/kaufman-bot --token TOKEN_FOR_RUNNER
```

Result

```sh
root@vps17825:~/actions-runner# ./config.sh --url https://github.com/EndyKaufman/kaufman-bot --token TOKEN_FOR_RUNNER

--------------------------------------------------------------------------------
|        ____ _ _   _   _       _          _        _   _                      |
|       / ___(_) |_| | | |_   _| |__      / \   ___| |_(_) ___  _ __  ___      |
|      | |  _| | __| |_| | | | | '_ \    / _ \ / __| __| |/ _ \| '_ \/ __|     |
|      | |_| | | |_|  _  | |_| | |_) |  / ___ \ (__| |_| | (_) | | | \__ \     |
|       \____|_|\__|_| |_|\__,_|_.__/  /_/   \_\___|\__|_|\___/|_| |_|___/     |
|                                                                              |
|                       Self-hosted runner registration                        |
|                                                                              |
--------------------------------------------------------------------------------

# Authentication


√ Connected to GitHub

# Runner Registration

Enter the name of the runner group to add this runner to: [press Enter for Default]

Enter the name of runner: [press Enter for vps17825] develop-vps

This runner will have the following labels: 'self-hosted', 'Linux', 'X64'
Enter any additional labels (ex. label-1,label-2): [press Enter to skip] develop-vps

√ Runner successfully added
√ Runner connection is good

# Runner settings

Enter name of work folder: [press Enter for _work]

√ Settings Saved.

root@vps17825:~/actions-runner#
```

![Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b72jxxpcvqb6981e5do1.png)

Configuring the self-hosted runner application as a service

```sh
sudo ./svc.sh install
sudo ./svc.sh start
```

Result

```sh
root@vps17825:~/actions-runner# sudo ./svc.sh install
Creating launch runner in /etc/systemd/system/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service
Run as user: root
Run as uid: 0
gid: 0
Created symlink /etc/systemd/system/multi-user.target.wants/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service → /etc/systemd/system/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service.
root@vps17825:~/actions-runner# sudo ./svc.sh start

/etc/systemd/system/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service
● actions.runner.EndyKaufman-kaufman-bot.develop-vps.service - GitHub Actions Runner (EndyKaufman-kaufman-bot.develop-vps)
     Loaded: loaded (/etc/systemd/system/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2022-03-26 12:06:28 MSK; 21ms ago
   Main PID: 2266387 (runsvc.sh)
      Tasks: 2 (limit: 2253)
     Memory: 784.0K
     CGroup: /system.slice/actions.runner.EndyKaufman-kaufman-bot.develop-vps.service
             ├─2266387 /bin/bash /root/actions-runner/runsvc.sh
             └─2266397 ./externals/node16/bin/node ./bin/RunnerService.js

Mar 26 12:06:28 vps17825 systemd[1]: Started GitHub Actions Runner (EndyKaufman-kaufman-bot.develop-vps).
Mar 26 12:06:28 vps17825 runsvc.sh[2266387]: .path=/root/.vscode-server/bin/c722ca6c7eed3d7987c0d5c3df5c45f6b15e77d1/bin/remote-cli:/usr/local/sbin:/usr/local/bin:/usr/s…ames:/snap/bin
Hint: Some lines were ellipsized, use -l to show in full.
```

![Result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pm2wahw41n3ysungv4zr.png)

View created runner in Github UI
![View created runner in Github UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q0dnqltq7neidy8dayif.png)

## Add support apply migration on vps database

### Append new env value in github

Add password for root user of data base

```sh
ROOT_POSTGRES_PASSWORD=postgres
```

![UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lryq07syalxfag2hta5d.png)

![Append new env value in github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8eumn7g7uichvlpymida.png)

Add connection strings for all need applications

```sh
SERVER_POSTGRES_URL=postgres://admin_develop:password_develop@${POSTGRES_HOST}:5432/kaufman_bot_develop?schema=public
```

![UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2m7nbongg7nqpi37xczz.png)

![Append new env value in github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yltvson2013gfb0gzotq.png)

### Update deploy script

_.github/workflows/develop.deploy.yml_

```yaml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate

  deploy:
    needs: [migrate]
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

### Update flyway config for support change host name

_.flyway.js_

```js
...
const cs = new ConnectionString(
  (process.env.POSTGRES_URL || process.env.DATABASE_URL).replace(
    '${POSTGRES_HOST}',
    process.env['POSTGRES_HOST']
  )
);
...
```

![Update flyway config for support change host name](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/35zimt2606u2z74xw40h.png)

### Check deploy in Github UI

After apply migartions and deploy you see result in Github UI

https://github.com/EndyKaufman/kaufman-bot/actions/runs/2044314338
![After apply migartions and deploy you see result in Github UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rm93bxi7uy0n8l9y6agt.png)

For see complete of migrations expand needed step of job

https://github.com/EndyKaufman/kaufman-bot/runs/5702849615?check_suite_focus=true
![For see complete of migrations expand needed step of job](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xnrbtymhi35w99i6q3jy.png)

## Check database in vps server

Connect to database

> dokku postgres:connect global-postgres
> ![Connect to database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x0tpgsk9x1hr7u36yqup.png)

Switch database

> \connect kaufman_bot_develop

Select telegram users

> select \* from "User";

```sh
root@vps17825:~# dokku postgres:connect global-postgres
psql (13.3 (Debian 13.3-1.pgdg100+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

global_postgres=# \connect kaufman_bot_develop
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
You are now connected to database "kaufman_bot_develop" as user "postgres".
kaufman_bot_develop=# select * from "User";
                  id                  | telegramId | langCode
--------------------------------------+------------+----------
 7fa21a25-60a9-4d69-86d9-13770bd467fd | testId     | en
(1 row)
```

![Check database in vps server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3pn69n3q2i8yzh30dndl.png)

In the next post, I will add prisma to the project to save the user's language to the database...

#kaufmanbot #postgres #github #migrations

# [2022-03-26 19:56] Add Prisma ORM to KaufmanBot (NestJS telegram bot application)

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://www.prisma.io - next-generation Node.js and TypeScript ORM

## Install dependencies

> npm install prisma --save-dev

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm install prisma --save-dev

added 2 packages, and audited 940 packages in 10s

115 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

For correct work with postgres in prod mode, need install pg deps

> npm install pg pg-promise --save

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm install pg pg-promise --save

up to date, audited 942 packages in 3s

115 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Init prisma

> npx prisma init

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npx prisma init

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore. Don't forget to exclude .env to not commit any secret.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver or mongodb (Preview).
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

### Remove created .env file

> rm -rf .env

### Update prisma schema

_prisma/schema.prisma_

```prisma
generator client {
  provider        = "prisma-client-js"
  binaryTargets   = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

![Update prisma schema](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g5dd5rczppodsi05urhz.png)

## Fill prisma schema from exists database

### Add additional scripts to packge.json

_package.json_

```json
...
    "prisma": "prisma",
    "prisma:pull": "npm run -- prisma db pull && npm run prisma:generate",
    "prisma:pull:local": "export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate",
    "prisma:generate": "npm run -- prisma generate",
    "postinstall": "npm run generate"
...
```

### Update exists scripts in packge.json

_package.json_

```json
...
    "generate": "npm run prisma:generate && npm run rucken -- prepare --locales=en,ru && npm run lint:fix"
...
```

### Run introspection for database

> npm run prisma:pull:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run prisma:pull:local

> kaufman-bot@0.0.0 prisma:pull:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate


> kaufman-bot@0.0.0 prisma
> prisma "db" "pull"

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "kaufman_bot_develop", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma …

✔ Introspected 2 models and wrote them into prisma/schema.prisma in 121ms

Run prisma generate to generate Prisma Client.


> kaufman-bot@0.0.0 prisma:generate
> npm run -- prisma generate


> kaufman-bot@0.0.0 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 200ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


```

![Run introspection database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/89uzhnumlv3tr7dfcuu7.png)

### Schema after pull command

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String @id(map: "PK_USERS") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  telegramId String @unique(map: "UQ_USERS__TELEGRAM_ID") @db.VarChar(64)
  langCode   String @default("en") @db.VarChar(64)
}

model migrations {
  installed_rank Int      @id(map: "__migrations_pk")
  version        String?  @db.VarChar(50)
  description    String   @db.VarChar(200)
  type           String   @db.VarChar(20)
  script         String   @db.VarChar(1000)
  checksum       Int?
  installed_by   String   @db.VarChar(100)
  installed_on   DateTime @default(now()) @db.Timestamp(6)
  execution_time Int
  success        Boolean

  @@index([success], map: "__migrations_s_idx")
  @@map("__migrations")
}

```

![Schema after pull command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8bc61o1k8r1a7s40s45v.png)

## Add NestJS module for work with prisma

### Add config file

_libs/core/server/src/lib/prisma-client/prisma-client.config.ts_

```ts
export const PRISMA_CLIENT_CONFIG = Symbol('PRISMA_CLIENT_CONFIG');

export interface PrismaClientConfig {
  databaseUrl: string;
  logging: 'all_queries' | 'long_queries';
  maxQueryExecutionTime: number;
}
```

### Add service

_libs/core/server/src/lib/prisma-client/prisma-client.service.ts_

```ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomInject, CustomInjectorService } from 'nestjs-custom-injector';
import {
  PrismaClientConfig,
  PRISMA_CLIENT_CONFIG,
} from './prisma-client.config';

@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger(PrismaClientService.name);

  @CustomInject(PRISMA_CLIENT_CONFIG)
  private readonly prismaClientConfig!: PrismaClientConfig;

  constructor(customInjectorService: CustomInjectorService) {
    super({
      datasources: {
        db: {
          url: customInjectorService.getProviders<PrismaClientConfig>(
            PRISMA_CLIENT_CONFIG
          ).databaseUrl,
        },
      },
      rejectOnNotFound: true,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('onModuleInit');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('query', (e) => {
        if (this.prismaClientConfig.logging === 'all_queries') {
          if (e.query !== 'SELECT 1') {
            this.logger.log(
              `query: ${e.query}, params: ${e.params}, duration: ${e.duration}`
            );
          }
        }
        if (this.prismaClientConfig.logging === 'long_queries') {
          if (e.duration >= this.prismaClientConfig.maxQueryExecutionTime) {
            this.logger.warn(
              `query is slow: ${e.query}, params: ${e.params}, execution time: ${e.duration}`
            );
          }
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('error', (e) => {
        this.logger.error(`target: ${e.target}, message: ${e.message}`);
      });
      await this.$connect();
      setInterval(
        () =>
          this.$queryRaw`SELECT 1`.catch((err) =>
            this.logger.error(err, err.stack)
          ),
        5 * 60000
      );
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('onModuleDestroy');
    await this.$disconnect();
  }
}
```

### Add module

_libs/core/server/src/lib/prisma-client/prisma-client.module.ts_

```ts
import { DynamicModule, Module } from '@nestjs/common';
import env from 'env-var';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import {
  PrismaClientConfig,
  PRISMA_CLIENT_CONFIG,
} from './prisma-client.config';
import { PrismaClientService } from './prisma-client.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
class PrismaClientModuleCore {}

@Module({
  imports: [PrismaClientModuleCore],
  exports: [PrismaClientModuleCore],
})
export class PrismaClientModule {
  static forRoot(config: PrismaClientConfig): DynamicModule {
    return {
      module: PrismaClientModule,
      providers: [
        {
          provide: PRISMA_CLIENT_CONFIG,
          useValue: {
            ...config,
            databaseUrl: config.databaseUrl
              .replace(
                '${POSTGRES_HOST}',
                env.get('POSTGRES_HOST').default('').asString()
              )
              .replace(
                'localhost',
                env.get('POSTGRES_HOST').default('').asString()
              ),
          },
        },
      ],
    };
  }
}
```

### Update index.ts files in libs

> npm run generate

## Add PrismaClientModule to application

### Update AppModule

_apps/server/src/app/app.module.ts_

```ts
...
@Module({
  imports: [
    ...
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    ...
  ]
  ...
})
...
```

### Update LanguageSwitherModule

_libs/language-swither/server/src/lib/language-swither.module.ts_

```ts
import {
  ...
  PrismaClientModule,
} from '@kaufman-bot/core/server';

...

@Module({
  imports: [TranslatesModule, PrismaClientModule, BotCommandsModule],
  providers: [LanguageSwitherStorage],
  exports: [
    TranslatesModule,
    PrismaClientModule,
    BotCommandsModule,
    LanguageSwitherStorage,
  ],
})
export class LanguageSwitherModule {
...
}
```

### Create LanguageSwitherStorage

_libs/language-swither/server/src/lib/language-swither-services/language-swither.storage.ts_

```ts
import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import { DEFAULT_LANGUAGE } from '../language-swither-config/language-swither.config';

@Injectable()
export class LanguageSwitherStorage {
  private readonly languageOfUsers: Record<number, string> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getLanguageOfUser(
    userId: number,
    defaultLangCode?: string
  ): Promise<string> {
    const currentLanguageCode = this.languageOfUsers[userId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    try {
      const currentLanguageCodeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: userId.toString() },
          rejectOnNotFound: true,
        });
      this.languageOfUsers[userId] = currentLanguageCodeFromDatabase.langCode;
      return this.languageOfUsers[userId];
    } catch (error) {
      return defaultLangCode || DEFAULT_LANGUAGE;
    }
  }

  async setLanguageOfUser(userId: number, langCode: string): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId.toString(), langCode },
      update: { langCode },
      where: { telegramId: userId.toString() },
    });
    this.languageOfUsers[userId] = langCode;
  }
}
```

### Update LanguageSwitherService

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
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from '../language-swither-config/language-swither.config';
import { LanguageSwitherCommandsEnum } from '../language-swither-types/language-swither-commands';
import { LanguageSwitherStorage } from './language-swither.storage';

@Injectable()
export class LanguageSwitherService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(LanguageSwitherService.name);

  constructor(
    @Inject(LANGUAGE_SWITHER_CONFIG)
    private readonly languageSwitherConfig: LanguageSwitherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly languageSwitherStorage: LanguageSwitherStorage,
    private readonly commandToolsService: BotСommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale = await this.languageSwitherStorage.getLanguageOfUser(
      msg.from?.id
    );
    const detectedLocale = await this.languageSwitherStorage.getLanguageOfUser(
      msg.from?.id,
      msg.from?.language_code
    );
    if (msg.from?.id && !locale) {
      await this.languageSwitherStorage.setLanguageOfUser(
        msg.from?.id,
        detectedLocale
      );
    } else {
      if (detectedLocale) {
        msg.from.language_code = detectedLocale;
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
    const locale = await this.languageSwitherStorage.getLanguageOfUser(
      msg.from?.id
    );
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
        const currentLocale =
          await this.languageSwitherStorage.getLanguageOfUser(msg.from?.id);
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

      await this.languageSwitherStorage.setLanguageOfUser(
        msg.from?.id,
        inputLocale || locale
      );

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

## Update dev infra

### Update docker-compose

_docker/dev/docker-compose.yml_

```yaml
---
kaufman-bot-server:
  image: node:16-alpine
  user: ${CURRENT_UID}
  container_name: 'kaufman-bot-server'
  environment:
    - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    - SERVER_POSTGRES_URL=${SERVER_POSTGRES_URL}
    - POSTGRES_HOST=${POSTGRES_HOST}
    - PORT=3000
  ports:
    - '3000:3000'
    - '9229:9229'
  working_dir: '/app'
  volumes:
    - ./../../:/app
  networks:
    - kaufman-bot-network
  command: 'npm run serve'
  tty: true
  depends_on:
    - kaufman-bot-postgres
```

### Update up script

_docker/dev/docker-compose-up.sh_

```sh
#!/bin/bash
#export UID=$(id -u)
#export GID=$(id -g)
export CURRENT_UID=$(id -u):$(id -g)
docker volume create --name=kaufman-bot-postgres-volume --label=kaufman-bot-postgres-volume
# Start only database
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d kaufman-bot-postgres
# Wait ready datatbase
until docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") pg_isready -U postgres; do
    echo "Waiting for postgres..."
    sleep 2
done
# Create all need application databases by exists match evn key and nx app name
# for app: "server" - env: SERVER_POSTGRES_URL
# for app: "core-server" - env: CORE_SERVER_POSTGRES_URL
npm run rucken -- postgres
# Run migrate database for specific database
export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
# Change database host for applications
export POSTGRES_HOST=kaufman-bot-postgres
# Update all egnerated files
npm run generate
# Start all services
docker-compose -f ./docker/dev/docker-compose.yml --compatibility up -d

```

### Restart dev infra

> npm run docker:dev:clean-restart

## Check new logic

### Send change locale command in telegram bot

![Send change locale command in telegram bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eo2rz25dab80gz6wlqae.png)

### Check database

Connect to container with database

> docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh

Connect with psql to application database

> set PGPASSWORD=password_develop&& psql -d kaufman_bot_develop -U admin_develop

Select telegram users

> select \* from "User";

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ docker exec -it $(docker ps -aqf "name=kaufman-bot-postgres") sh
# set PGPASSWORD=password_develop&& psql -d kaufman_bot_develop -U admin_develop
psql (13.3 (Debian 13.3-1.pgdg100+1))
Type "help" for help.

kaufman_bot_develop=> select * from "User";
                  id                  | telegramId | langCode
--------------------------------------+------------+----------
 b659808e-35a8-4c93-a40a-96858b352779 | testId     | en
 25e4a306-a977-4536-bf05-73ce96a94b73 | 102375526  | en
(2 rows)
```

![Check database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84cb8nj00ccj8q5mha95.png)

## Update github deploy config

_.github/workflows/develop.deploy.yml_

```yaml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
          dokku config:set --no-restart kaufman-bot SERVER_POSTGRES_URL=$SERVER_POSTGRES_URL
          dokku config:set --no-restart --global POSTGRES_HOST=global-postgres

  deploy:
    needs: [migrate]
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

## Check database in vps server

Connect to database

> dokku postgres:connect global-postgres
> ![Connect to database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x0tpgsk9x1hr7u36yqup.png)

Switch database

> \connect kaufman_bot_develop

Select telegram users

> select \* from "User";

```sh
root@vps17825:~# dokku postgres:connect global-postgres
psql (13.3 (Debian 13.3-1.pgdg100+1))
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
Type "help" for help.

global_postgres=# \connect kaufman_bot_develop
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
You are now connected to database "kaufman_bot_develop" as user "postgres".
kaufman_bot_develop=# select * from "User";
                  id                  | telegramId | langCode
--------------------------------------+------------+----------
 7fa21a25-60a9-4d69-86d9-13770bd467fd | testId     | en
 99ea4d90-04a9-4d69-9a74-0eff06823f3a | 102375526  | ru
(2 rows)
```

![Check database in vps server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h3sejc73zdfd5k9rl98u.png)

In the next post, I will add a module for debugging messages in admin mode and user mode...

#kaufmanbot #nestjs #prisma #github

# [2022-04-01 23:33] Add a module for debugging messages in admin mode and user mode for Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Add new field to user for store debug mode state

### Create migrations for append new user field

_migrations/V202203310937\_\_AddDebugFieldToUserTable.pgsql_

```sql
DO $$
BEGIN
    ALTER TABLE "User"
        ADD "debugMode" boolean DEFAULT FALSE;
EXCEPTION
    WHEN duplicate_column THEN
        NULL;
END
$$;
```

### Apply migrations

> npm run migrate:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run migrate:local

> kaufman-bot@0.0.0 migrate:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate


> kaufman-bot@0.0.0 migrate
> npm run flyway -- migrate


> kaufman-bot@0.0.0 flyway
> flyway -c .flyway.js "migrate"

Flyway Community Edition 6.3.2 by Redgate
Database: jdbc:postgresql://localhost:5432/kaufman_bot_develop (PostgreSQL 13.3)
WARNING: Flyway upgrade recommended: PostgreSQL 13.3 is newer than this version of Flyway and support has not been tested. The latest supported version of PostgreSQL is 12.
Successfully validated 3 migrations (execution time 00:00.018s)
Current version of schema "public": 202203252144
Migrating schema "public" to version 202203310937 - AddDebugFieldToUserTable
Successfully applied 1 migration to schema "public" (execution time 00:00.032s)
```

![Apply migrations](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rsuj6euxdgjykzyvjvwh.png)

### Update prisma schema and sdk

> npm run prisma:pull:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run prisma:pull:local

> kaufman-bot@0.0.0 prisma:pull:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate


> kaufman-bot@0.0.0 prisma
> prisma "db" "pull"

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "kaufman_bot_develop", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma …

✔ Introspected 2 models and wrote them into prisma/schema.prisma in 303ms

Run prisma generate to generate Prisma Client.


> kaufman-bot@0.0.0 prisma:generate
> npm run -- prisma generate


> kaufman-bot@0.0.0 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 165ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

```

![Update prisma schema and sdk](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7yemfu3g3xcm3t22jany.png)

Check prisma schema
_prisma/schema.prisma_

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         String  @id(map: "PK_USERS") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  telegramId String  @unique(map: "UQ_USERS__TELEGRAM_ID") @db.VarChar(64)
  langCode   String  @default("en") @db.VarChar(64)
  debugMode  Boolean @default(false)
}

model migrations {
  installed_rank Int      @id(map: "__migrations_pk")
  version        String?  @db.VarChar(50)
  description    String   @db.VarChar(200)
  type           String   @db.VarChar(20)
  script         String   @db.VarChar(1000)
  checksum       Int?
  installed_by   String   @db.VarChar(100)
  installed_on   DateTime @default(now()) @db.Timestamp(6)
  execution_time Int
  success        Boolean

  @@index([success], map: "__migrations_s_idx")
  @@map("__migrations")
}

```

## Update core logic for correct work all logic needed in debug command

### Update all interfaces

Before hook

_libs/core/server/src/lib/bot-commands/bot-commands-types/on-before-bot-commands.interface.ts_

```ts
import { BotCommandsProviderActionMsg } from './bot-commands-provider.interface';

export interface OnBeforeBotCommands {
  onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx?
  ): Promise<TMsg>;
}
```

After hook

_libs/core/server/src/lib/bot-commands/bot-commands-types/on-after-bot-commands.interface.ts_

```ts
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';
import { BotCommandsProviderActionMsg } from './bot-commands-provider.interface';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(
    result: TResult,
    msg: TMsg,
    ctx?
  ): Promise<{ result: TResult; msg: TMsg }>;
}
```

Update provider interface

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-provider.interface.ts_

```ts
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';

export const BOT_COMMANDS_PROVIDER = Symbol('BOT_COMMANDS_PROVIDER');

export type BotCommandsProviderActionMsg = Update.MessageUpdate['message'] & {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  botContext?: Record<string, any>;
};

export type BotCommandsProviderActionContext = Context<Update.MessageUpdate>;

export interface BotCommandsProvider {
  onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;

  onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx
  ): Promise<BotCommandsProviderActionResultType<TMsg>>;
}
```

### Update core service

Add main logic of work with telegram to service

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

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.onMessage(msg, ctx, defaultHandler);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      await ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      await ctx.reply(result.text);
      return;
    }
  }

  async onHelp<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
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
    ctx: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
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

    if (defaultHandler) {
      await defaultHandler();
    }

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

## Create DebugMessagesModule

### Create new nx lib debug-messages

> npm run -- nx g @nrwl/nest:lib debug-messages/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib debug-messages/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "debug-messages/server"

CREATE libs/debug-messages/server/README.md
CREATE libs/debug-messages/server/.babelrc
CREATE libs/debug-messages/server/src/index.ts
CREATE libs/debug-messages/server/tsconfig.json
CREATE libs/debug-messages/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/debug-messages/server/project.json
UPDATE workspace.json
CREATE libs/debug-messages/server/.eslintrc.json
CREATE libs/debug-messages/server/jest.config.js
CREATE libs/debug-messages/server/tsconfig.spec.json
CREATE libs/debug-messages/server/src/lib/debug-messages-server.module.ts
```

![Create new nx lib debug-messages](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fydfw1x2x691qfut80eo.png)

### Create config file

_libs/debug-messages/server/src/lib/debug-messages-config/debug-messages.config.ts_

```ts
export const DEBUG_MESSAGES_CONFIG = 'DEBUG_MESSAGES_CONFIG';

export interface DebugMessagesConfig {
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
}
```

### Create commands enum

_libs/debug-messages/server/src/lib/debug-messages-types/debug-messages-commands.ts_

```ts
import { getText } from 'class-validator-multi-lang';

export const DebugMessagesCommandsEnum = {
  on: getText('on'),
  off: getText('off'),
  current: getText('state'),
};
```

### Create storage service for store user settings

_libs/debug-messages/server/src/lib/debug-messages-services/debug-messages.storage.ts_

```ts
import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebugMessagesStorage {
  private readonly debugModeOfUsers: Record<number, boolean> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getDebugModeOfUser(telegramUserId: number): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[telegramUserId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    try {
      const currentDebugModeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: telegramUserId.toString() },
          rejectOnNotFound: true,
        });
      this.debugModeOfUsers[telegramUserId] =
        currentDebugModeFromDatabase.debugMode;
      return this.debugModeOfUsers[telegramUserId];
    } catch (error) {
      return false;
    }
  }

  async setDebugModeOfUser(userId: number, debugMode: boolean): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId.toString(), debugMode },
      update: { debugMode },
      where: { telegramId: userId.toString() },
    });
    this.debugModeOfUsers[userId] = debugMode;
  }
}
```

### Create service with main logic of bot command

_libs/debug-messages/server/src/lib/debug-messages-services/debug-messages.service.ts_

````ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import { DebugMessagesStorage } from './debug-messages.storage';

const DEBUG_MODE = 'debugMode';

@Injectable()
export class DebugMessagesService
  implements BotCommandsProvider, OnBeforeBotCommands, OnAfterBotCommands
{
  private readonly logger = new Logger(DebugMessagesService.name);

  constructor(
    @Inject(DEBUG_MESSAGES_CONFIG)
    private readonly debugMessagesConfig: DebugMessagesConfig,
    private readonly translatesService: TranslatesService,
    private readonly debugMessagesStorage: DebugMessagesStorage,
    private readonly commandToolsService: BotСommandsToolsService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg,
    TResult extends BotCommandsProviderActionResultType<TMsg> = BotCommandsProviderActionResultType<TMsg>
  >(result: TResult, msg: TMsg, ctx): Promise<{ result: TResult; msg: TMsg }> {
    const { botContext, ...debugData } = msg;
    if (botContext?.[DEBUG_MODE] && ctx) {
      ctx.reply(
        ['```', JSON.stringify(debugData, undefined, 4), '```'].join('\n'),
        {
          parse_mode: 'MarkdownV2',
        }
      );
    }
    return {
      msg,
      result,
    };
  }

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    if (!msg.botContext) {
      msg.botContext = {};
    }
    msg.botContext[DEBUG_MODE] = debugMode;
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.debugMessagesConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code || 'en';

    const spyWord = this.debugMessagesConfig.spyWords.find((spyWord) =>
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
            this.debugMessagesConfig.name,
            this.debugMessagesConfig.descriptions,
            this.debugMessagesConfig.usage
          ),
        };
      }

      const processedMsg = await this.process(msg, locale);

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
  >(msg: TMsg, locale: string) {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.on],
        locale
      )
    ) {
      if (!debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, true);
        return this.translatesService.translate(
          getText(`debug enabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already enabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.off],
        locale
      )
    ) {
      if (debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, false);
        return this.translatesService.translate(
          getText(`debug disabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already disabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.current],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`debug: {{debugMode}}`),
        locale,
        { debugMode: debugMode ? 'enable' : 'disable' }
      );
    }
    return msg;
  }
}
````

### Create module

_libs/debug-messages/server/src/lib/debug-messages.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from './debug-messages-config/debug-messages.config';
import { DebugMessagesService } from './debug-messages-services/debug-messages.service';
import { DebugMessagesStorage } from './debug-messages-services/debug-messages.storage';

@Module({
  imports: [TranslatesModule, PrismaClientModule, BotCommandsModule],
  providers: [DebugMessagesStorage],
  exports: [
    TranslatesModule,
    PrismaClientModule,
    BotCommandsModule,
    DebugMessagesStorage,
  ],
})
export class DebugMessagesModule {
  static forRoot(): DynamicModule {
    return {
      module: DebugMessagesModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [DebugMessagesModule],
          providers: [
            {
              provide: DEBUG_MESSAGES_CONFIG,
              useValue: <DebugMessagesConfig>{
                name: getText('Debug messages'),
                usage: [
                  getText('debug on'),
                  getText('debug off'),
                  getText('debug state'),
                ],
                descriptions: getText(
                  'Commands for enable and disable debug mode'
                ),
                spyWords: [getText('debug')],
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: DebugMessagesService,
            },
          ],
          exports: [DEBUG_MESSAGES_CONFIG],
        }),
      ],
    };
  }
}
```

## Update application

### Update app service

_apps/server/src/app/app.service.ts_

```ts
import {
  BotCommandsProviderActionMsg,
  BotСommandsService,
} from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botСommandsService: BotСommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Welcome'));
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botСommandsService.process(ctx, () => ctx.reply('👍'));
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Hey there'));
  }

  @On('text')
  async onMessage(ctx) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.botСommandsService.onMessage(msg, ctx);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      await ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      await ctx.reply(result.text);
      return;
    }
  }
}
```

### Update app module

_apps/server/src/app/app.module.ts_

```ts
import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    BotCommandsModule,
    LanguageSwitherModule.forRoot(),
    DebugMessagesModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Translate all dictionaries

### Run generate all need files

> npm run generate

```
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run generate

> kaufman-bot@0.0.0 generate
> npm run prisma:generate && npm run rucken -- prepare --locales=en,ru && npm run lint:fix


> kaufman-bot@0.0.0 prisma:generate
> npm run -- prisma generate


> kaufman-bot@0.0.0 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 193ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

```

> kaufman-bot@0.0.0 rucken
> rucken "prepare" "--locales=en,ru"


> kaufman-bot@0.0.0 lint:fix
> npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all


> kaufman-bot@0.0.0 tsc:lint
> tsc --noEmit -p tsconfig.base.json


    ✔  nx run currency-converter-server:lint  [local cache]
    ✔  nx run language-swither-server:lint  [local cache]
    ✔  nx run facts-generator-server:lint  [local cache]
    ✔  nx run debug-messages-server:lint (1s)
    ✔  nx run html-scraper-server:lint  [local cache]
    ✔  nx run core-server:lint (1s)
    ✔  nx run server:lint (1s)

 ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 7 projects (4s)

         With additional flags:
           --fix=true

   Nx read the output from the cache instead of running the command for 4 out of 7 tasks.


 >  NX   Running affected:* commands with --all can result in very slow builds.

   --all is not meant to be used for any sizable project or to be used in CI.

   Learn more about checking only what is affected: https://nx.dev/latest/angular/cli/affected#affected.
```

### Add translate for all empty words

View list of dictionaries for translate
![View list of dictionaries for translate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jsw5fxknns2weuvja7kp.png)

Add translates in ru language
![Add translates in ru language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/spjhimp86dnis25v3on9.png)

Run generate for generate json dictionaries from po files

> npm run generate

## Check new logic in telegram bot

Common help message
![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9kpwgs4337uuetng1udh.png)

Help message for debug command
![Help message for debug command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mzlhj561bdorgb9w07l6.png)

Enable debug mode and check work it
![Enable debug mode and check work it](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tmj9tnrknmorj7m35b5a.png)

Change user locale with show debug info
![Change user locale with show debug info](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bllhwtgfgkoufn06ajih.png)

Common help message on Russia locale
![Common help message on Russia locale](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ppe5kjx3kaolypy6expe.png)

Example of debug emoji

Send
![Send](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l9e83a0wdxg67je9fkqk.png)

Debug

```json
{
  "message_id": 822,
  "from": {
    "id": 102375526,
    "is_bot": false,
    "first_name": "IL'shat",
    "last_name": "Khamitov",
    "username": "KaufmanEndy",
    "language_code": "ru"
  },
  "chat": {
    "id": 102375526,
    "first_name": "IL'shat",
    "last_name": "Khamitov",
    "username": "KaufmanEndy",
    "type": "private"
  },
  "date": 1648837576,
  "sticker": {
    "width": 512,
    "height": 512,
    "emoji": "😥",
    "set_name": "PeopleMemes",
    "is_animated": true,
    "is_video": false,
    "thumb": {
      "file_id": "AAMCAgADGQEAAgM2YkdDyN-EhN0TaqqYga12aOy6N3EAApoUAALJ5JFJ6q9bB_WLS2YBAAdtAAMjBA",
      "file_unique_id": "AQADmhQAAsnkkUly",
      "file_size": 6304,
      "width": 128,
      "height": 128
    },
    "file_id": "CAACAgIAAxkBAAIDNmJHQ8jfhITdE2qqmIGtdmjsujdxAAKaFAACyeSRSeqvWwf1i0tmIwQ",
    "file_unique_id": "AgADmhQAAsnkkUk",
    "file_size": 29792
  }
}
```

![Debug](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f3xefz4agpq9xs0g97km.png)

Answer
![Answer](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2ijkniyfzzq3hl4m1p0j.png)

For emoji used top app handler
![For emoji used top app handler](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z17c6ex9ec40bgrapu86.png)

In the next post, I will add a module for process unhandled message with Dialogflow API...

#kaufmanbot #nestjs #debug #telegram

# [2022-04-03 18:02] Add a module for process unhandled message in NestJS Telegram bot with Google Dialogflow API

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://cloud.google.com/dialogflow/docs/support/getting-support - official docs

https://github.com/googleapis/nodejs-dialogflow - node library for work with dialogflow

## Install dependecies

> npm i --save @google-cloud/dialogflow uuid

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev @google-cloud/dialogflow uuid

added 42 packages, and audited 984 packages in 8s

115 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

> npm i --save-dev @types/uuid

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev @types/uuid

added 1 package, and audited 985 packages in 2s

115 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## Setup dialogflow

### Create project

Navigate to https://dialogflow.cloud.google.com/

Create new agent
![Create new agent](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j6o9zi31evucs4u5utp8.png)
![Create new agent 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kpc9od9n1peo73zwdwa8.png)

After create you see two default intents
![After create you see two default intents](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h0izg26as77lahxhpmah.png)

Test welcome intent from UI
![Test welcome intent from ui](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5hpxsgzzxzc2dwjyk2r2.png)

Response for answer was selected from default responses
![Response for answer was selected from default responses](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y6y0oa6qs9qbz9iysbfl.png)

### Settings of authorizations

Navigate to project list
https://console.cloud.google.com/projectselector/iam-admin/serviceaccounts/create?supportedpurview=project

Select your project
![Select your project](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/u2ddp98xk7ajuofzxxqu.png)

In the Service account description field, enter a description. For example, Service account for quickstart.
![In the Service account description field](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bdyp2iyncqjph9k0edr7.png)

Select role with Dialogflow and click continue
![Select role with Dialogflow](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/93wv84fyzrkdzhhdre6p.png)

Click done
![Click done](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qsrid597srzb2hzfmdmw.png)

After click done you see list of accounts
![After click done you see list of accounts](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0b4bnbbm589vgq7ita87.png)

Click Keys
![Click Keys](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v20h5188jvdyq6ke5my4.png)

Click Add key, then click Create new key
![Click Add key, then click Create new key](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i5j60d2zobdjfaohhi4w.png)

Click Create
![Click Create](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ibdhc8xqg3abacbqf8ln.png)

A JSON key file is downloaded to your computer, click Close
![A JSON key file is downloaded to your computer, click Close](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w6rpufna49axp76fk9kz.png)

Copy downloaded file to root folder of application and add it file name to .gitignore
![Copy downloaded file to root folder of application and add it file name to .gitignore](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zac3ydgi74lxseqhb92t.png)

## Update core source for correct work dialogflow logic

### Update OnAfterBotCommands

_libs/core/server/src/lib/bot-commands/bot-commands-types/on-after-bot-commands.interface.ts_

```ts
import { BotCommandsProviderActionResultType } from './bot-commands-provider-action-result-type';
import { BotCommandsProviderActionMsg } from './bot-commands-provider.interface';

export interface OnAfterBotCommands {
  onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }>;
}
```

### Update BotСommandsService

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

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.onMessage(msg, ctx, defaultHandler);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      await ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      await ctx.reply(result.text);
      return;
    }
  }

  async onHelp<TMsg extends BotCommandsProviderActionMsg>(
    msg: TMsg,
    ctx: BotCommandsProviderActionContext
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
    ctx: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
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
      ctx,
      defaultHandler
    );

    if (defaultHandler) {
      await defaultHandler();
    }

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

  async processOnAfterBotCommands<TMsg extends BotCommandsProviderActionMsg>(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?: BotCommandsProviderActionContext,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    const len = this.botCommandsProviders.length;
    for (let i = 0; i < len; i++) {
      const botCommandsProvider = this.botCommandsProviders[i];
      if (botCommandsProvider.onAfterBotCommands) {
        const afterBotCommand =
          await botCommandsProvider.onAfterBotCommands<TMsg>(
            result,
            msg,
            ctx,
            defaultHandler
          );
        result = afterBotCommand.result;
        msg = afterBotCommand.msg;
      }
    }
    return { result, msg };
  }
}
```

## Update debug-messages modules files for reuse it in other libs

### Create DebugService

_libs/debug-messages/server/src/lib/debug-messages-services/debug.service.ts_

````ts
import { BotCommandsProviderActionMsg } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';

const DEBUG_MODE = 'debugMode';

@Injectable()
export class DebugService {
  private readonly logger = new Logger(DebugService.name);

  setDebugMode<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, value: boolean) {
    if (!msg.botContext) {
      msg.botContext = {};
    }
    msg.botContext[DEBUG_MODE] = value;
    return msg;
  }

  sendDebugInfo<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    context: string
  ) {
    if (msg.botContext?.[DEBUG_MODE]) {
      ctx.reply(
        [
          `*${context} \\(${+new Date()}\\):*`,
          '```',
          JSON.stringify(data, undefined, 4),
          '```',
        ].join('\n'),
        {
          parse_mode: 'MarkdownV2',
        }
      );
    }
    this.logger.debug(data, context);
  }
}
````

### Update DebugMessagesService

_libs/debug-messages/server/src/lib/debug-messages-services/debug-messages.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import { DebugMessagesStorage } from './debug-messages.storage';
import { DebugService } from './debug.service';

@Injectable()
export class DebugMessagesService
  implements BotCommandsProvider, OnBeforeBotCommands, OnAfterBotCommands
{
  private readonly logger = new Logger(DebugMessagesService.name);

  constructor(
    @Inject(DEBUG_MESSAGES_CONFIG)
    private readonly debugMessagesConfig: DebugMessagesConfig,
    private readonly translatesService: TranslatesService,
    private readonly debugMessagesStorage: DebugMessagesStorage,
    private readonly commandToolsService: BotСommandsToolsService,
    private readonly debugService: DebugService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { botContext, ...debugData } = msg;
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      debugData,
      this.debugMessagesConfig.name
    );
    return {
      msg,
      result,
    };
  }

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    return this.debugService.setDebugMode(msg, debugMode);
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.debugMessagesConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code || 'en';

    const spyWord = this.debugMessagesConfig.spyWords.find((spyWord) =>
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
            this.debugMessagesConfig.name,
            this.debugMessagesConfig.descriptions,
            this.debugMessagesConfig.usage
          ),
        };
      }

      const processedMsg = await this.process(msg, locale);

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
  >(msg: TMsg, locale: string) {
    const debugMode = await this.debugMessagesStorage.getDebugModeOfUser(
      msg.from?.id
    );
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.on],
        locale
      )
    ) {
      if (!debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, true);
        return this.translatesService.translate(
          getText(`debug enabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already enabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.off],
        locale
      )
    ) {
      if (debugMode) {
        await this.debugMessagesStorage.setDebugModeOfUser(msg.from?.id, false);
        return this.translatesService.translate(
          getText(`debug disabled`),
          locale,
          {
            locale,
          }
        );
      } else {
        return this.translatesService.translate(
          getText(`debug already disabled`),
          locale,
          {
            locale,
          }
        );
      }
    }
    if (
      this.commandToolsService.checkCommands(
        msg.text,
        [DebugMessagesCommandsEnum.current],
        locale
      )
    ) {
      return this.translatesService.translate(
        getText(`debug: {{debugMode}}`),
        locale,
        { debugMode: debugMode ? getText('enabled') : getText('disabled') }
      );
    }
    return null;
  }
}
```

### Update DebugMessagesModule

_libs/debug-messages/server/src/lib/debug-messages.module.ts_

```ts
...
import { DebugService } from './debug-messages-services/debug.service';

@Module({
  imports: [TranslatesModule, PrismaClientModule, BotCommandsModule],
  providers: [DebugMessagesStorage, DebugService],
  exports: [
    TranslatesModule,
    PrismaClientModule,
    BotCommandsModule,
    DebugMessagesStorage,
    DebugService,
  ],
})
export class DebugMessagesModule {
...

```

## Create DialogFlowModule

### Create table for store metadata with user activity

Create migration

_migrations/V202204030939\_\_CreateDialogflowTable.pgsql_

```sql
CREATE TABLE IF NOT EXISTS "DialogflowSession" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "userId" uuid NOT NULL CONSTRAINT "FK_DIALOGFLOW_SESSION__USER_ID" REFERENCES "User",
    "projectId" varchar(512) NOT NULL,
    "sessionId" uuid NOT NULL,
    "requestsMetadata" jsonb DEFAULT '[]' NOT NULL,
    "responsesMetadata" jsonb DEFAULT '[]' NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_DIALOGFLOW_SESSION" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_DIALOGFLOW_SESSION" ON "DialogflowSession" ("userId", "projectId", "sessionId");

```

Apply migrations

> npm run migrate:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run migrate:local

> kaufman-bot@0.0.0 migrate:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate


> kaufman-bot@0.0.0 migrate
> npm run flyway -- migrate


> kaufman-bot@0.0.0 flyway
> flyway -c .flyway.js "migrate"

Flyway Community Edition 6.3.2 by Redgate
Database: jdbc:postgresql://localhost:5432/kaufman_bot_develop (PostgreSQL 13.3)
WARNING: Flyway upgrade recommended: PostgreSQL 13.3 is newer than this version of Flyway and support has not been tested. The latest supported version of PostgreSQL is 12.
Successfully validated 4 migrations (execution time 00:00.020s)
Current version of schema "public": 202203310937
Migrating schema "public" to version 202204030939 - CreateDialogflowTable
Successfully applied 1 migration to schema "public" (execution time 00:00.051s)
```

![Apply migrations](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7925slksz7wk9bmse6gr.png)

Pull database to prisma schema and regenerate prisma client

> npm run prisma:pull:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run prisma:pull:local

> kaufman-bot@0.0.0 prisma:pull:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate


> kaufman-bot@0.0.0 prisma
> prisma "db" "pull"

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "kaufman_bot_develop", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma …

✔ Introspected 3 models and wrote them into prisma/schema.prisma in 212ms

Run prisma generate to generate Prisma Client.


> kaufman-bot@0.0.0 prisma:generate
> npm run -- prisma generate


> kaufman-bot@0.0.0 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 205ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

![Pull database to prisma schema and regenerate prisma client](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/auzklowzcz6pp4yaqtcg.png)

New version of prisma schema
_prisma/schema.prisma_

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String              @id(map: "PK_USERS") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  telegramId        String              @unique(map: "UQ_USERS__TELEGRAM_ID") @db.VarChar(64)
  langCode          String              @default("en") @db.VarChar(64)
  debugMode         Boolean             @default(false)
  DialogflowSession DialogflowSession[]
}

model migrations {
  installed_rank Int      @id(map: "__migrations_pk")
  version        String?  @db.VarChar(50)
  description    String   @db.VarChar(200)
  type           String   @db.VarChar(20)
  script         String   @db.VarChar(1000)
  checksum       Int?
  installed_by   String   @db.VarChar(100)
  installed_on   DateTime @default(now()) @db.Timestamp(6)
  execution_time Int
  success        Boolean

  @@index([success], map: "__migrations_s_idx")
  @@map("__migrations")
}

model DialogflowSession {
  id                String   @id(map: "PK_DIALOGFLOW_SESSION") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String   @db.Uuid
  projectId         String   @db.VarChar(512)
  sessionId         String   @db.Uuid
  requestsMetadata  Json     @default("[]")
  responsesMetadata Json     @default("[]")
  createdAt         DateTime @default(now()) @db.Timestamp(6)
  updatedAt         DateTime @default(now()) @db.Timestamp(6)
  User              User     @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_DIALOGFLOW_SESSION__USER_ID")

  @@unique([userId, projectId, sessionId], map: "UQ_DIALOGFLOW_SESSION")
}

```

### Create nx lib

> npm run -- nx g @nrwl/nest:lib dialogflow/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib dialogflow/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "dialogflow/server"

CREATE libs/dialogflow/server/README.md
CREATE libs/dialogflow/server/.babelrc
CREATE libs/dialogflow/server/src/index.ts
CREATE libs/dialogflow/server/tsconfig.json
CREATE libs/dialogflow/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/dialogflow/server/project.json
UPDATE workspace.json
CREATE libs/dialogflow/server/.eslintrc.json
CREATE libs/dialogflow/server/jest.config.js
CREATE libs/dialogflow/server/tsconfig.spec.json
CREATE libs/dialogflow/server/src/lib/dialogflow-server.module.ts
```

![Create nx lib](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q08df2n4nwpn8e32ppmu.png)

### Add types

All work with dialogflow store in database, and it clear if user start work with another commands

_libs/dialogflow/server/src/lib/dialogflow-types/dialogflow-session-metadata.ts_

```ts
import { protos } from '@google-cloud/dialogflow';

export type DialogflowSessionRequestsMetadata = {
  ts: number;
  request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest;
}[];

export type DialogflowSessionResponsesMetadata = {
  ts: number;
  response: protos.google.cloud.dialogflow.v2.IDetectIntentResponse;
}[];
```

### Add config interface

_libs/dialogflow/server/src/lib/dialogflow-config/dialogflow.config.ts_

```ts
export const DIALOGFLOW_CONFIG = 'DIALOGFLOW_CONFIG';

export interface DialogflowConfig {
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  projectId: string;
}
```

### Add storage service

_libs/dialogflow/server/src/lib/dialogflow-services/dialogflow.storage.ts_

```ts
import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import {
  DialogflowSessionRequestsMetadata,
  DialogflowSessionResponsesMetadata,
} from '../dialogflow-types/dialogflow-session-metadata';

export type SessionOfUsers = {
  sessionId: string;
  responsesMetadata: DialogflowSessionResponsesMetadata;
  requestsMetadata: DialogflowSessionRequestsMetadata;
};

@Injectable()
export class DialogflowStorage {
  private readonly sessionOfUsers: Record<number, SessionOfUsers> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }): Promise<SessionOfUsers | null> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    if (currentSessionOfUsers) {
      return currentSessionOfUsers;
    }
    try {
      const currentFromDatabase =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
            projectId,
          },
          rejectOnNotFound: true,
        });
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: currentFromDatabase.sessionId,
        requestsMetadata: currentFromDatabase.requestsMetadata,
        responsesMetadata: currentFromDatabase.responsesMetadata,
      };
      return this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    } catch (error) {
      return null;
    }
  }

  async appendToUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(currentSessionOfUsers.requestsMetadata || []),
      ...sessionOfUsers.requestsMetadata,
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(currentSessionOfUsers.responsesMetadata || []),
      ...sessionOfUsers.responsesMetadata,
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  private async getUser(telegramUserId: number) {
    let user;
    try {
      user = await this.prismaClientService.user.findFirst({
        select: { id: true },
        where: { telegramId: telegramUserId.toString() },
        rejectOnNotFound: true,
      });
    } catch (error) {
      user = await this.prismaClientService.user.create({
        data: { telegramId: telegramUserId.toString() },
      });
    }
    return user;
  }

  async setUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...sessionOfUsers.requestsMetadata,
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...sessionOfUsers.responsesMetadata,
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async resetUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    const defaultUserSession =
      await this.prismaClientService.dialogflowSession.findFirst({
        where: {
          User: { telegramId: telegramUserId.toString() },
          projectId,
        },
      });
    if (defaultUserSession) {
      await this.prismaClientService.dialogflowSession.updateMany({
        data: {
          requestsMetadata: [],
          responsesMetadata: [],
        },
        where: {
          sessionId: defaultUserSession.sessionId,
          projectId,
        },
      });
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: defaultUserSession.sessionId,
        requestsMetadata: [],
        responsesMetadata: [],
      };
    }
  }

  private getKey({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    return `${telegramUserId}_${projectId}`;
  }
}
```

### Add service with command logics

_libs/dialogflow/server/src/lib/dialogflow-services/dialogflow.service.ts_

```ts
import dialogflow, { protos } from '@google-cloud/dialogflow';
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
} from '@kaufman-bot/core/server';
import { DebugService } from '@kaufman-bot/debug-messages/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 } from 'uuid';
import {
  DialogflowConfig,
  DIALOGFLOW_CONFIG,
} from '../dialogflow-config/dialogflow.config';
import { DialogflowStorage } from './dialogflow.storage';

@Injectable()
export class DialogflowService
  implements BotCommandsProvider, OnAfterBotCommands
{
  private readonly logger = new Logger(DialogflowService.name);

  constructor(
    @Inject(DIALOGFLOW_CONFIG)
    private readonly dialogflowConfig: DialogflowConfig,
    private readonly dialogflowStorage: DialogflowStorage,
    private readonly botСommandsToolsService: BotСommandsToolsService,
    private readonly debugService: DebugService
  ) {}

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg,
    ctx?,
    defaultHandler?: () => Promise<unknown>
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    if (!defaultHandler && result === null) {
      msg.text = `dialog ${msg.text}`;
      const dialogResult = await this.onMessage<TMsg>(msg, ctx);
      if (dialogResult !== null) {
        return { result: dialogResult, msg };
      }
    }

    if (result !== null) {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `call:resetUserSession`,
        this.dialogflowConfig.name
      );
      // reset last session if unhandled with dialog commands
      await this.dialogflowStorage.resetUserSession({
        telegramUserId: msg.from.id,
        projectId: this.dialogflowConfig.projectId,
      });
    }

    return { result, msg };
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage(
      {
        ...msg,
        text: `${this.dialogflowConfig.name} ${BotCommandsEnum.help}`,
      },
      ctx
    );
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code || 'en';

    const spyWord = this.dialogflowConfig.spyWords.find((spyWord) =>
      this.botСommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          markdown: this.botСommandsToolsService.generateHelpMessage(
            locale,
            this.dialogflowConfig.name,
            this.dialogflowConfig.descriptions,
            this.dialogflowConfig.usage
          ),
        };
      }

      const preparedText = this.botСommandsToolsService.clearCommands(
        msg.text,
        [spyWord],
        locale
      );

      const processedMsg = await this.process(msg, ctx, locale, preparedText);

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
  >(msg: TMsg, ctx, locale: string, text: string) {
    const ts = +new Date();
    const current = await this.dialogflowStorage.getUserSession({
      telegramUserId: msg.from.id,
      projectId: this.dialogflowConfig.projectId,
    });
    const sessionId = current ? current.sessionId : v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      this.dialogflowConfig.projectId,
      sessionId
    );

    const request: protos.google.cloud.dialogflow.v2.IDetectIntentRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: locale,
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      'Detected intent',
      this.dialogflowConfig.name
    );
    const result = responses[0].queryResult;
    if (!result) {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `Result not set`,
        this.dialogflowConfig.name
      );
      return null;
    }
    this.debugService.sendDebugInfo(
      msg,
      ctx,
      {
        Query: result.queryText,
        Response: result.fulfillmentText,
      },
      this.dialogflowConfig.name
    );
    if (result.intent) {
      if (current) {
        this.debugService.sendDebugInfo(
          msg,
          ctx,
          `call:appendToUserSession`,
          this.dialogflowConfig.name
        );
        await this.dialogflowStorage.appendToUserSession({
          telegramUserId: msg.from.id,
          projectId: this.dialogflowConfig.projectId,
          sessionOfUsers: {
            sessionId,
            requestsMetadata: [{ ts, request }],
            responsesMetadata: [{ ts, response: responses[0] }],
          },
        });
      } else {
        this.debugService.sendDebugInfo(
          msg,
          ctx,
          `call:setUserSession`,
          this.dialogflowConfig.name
        );
        await this.dialogflowStorage.setUserSession({
          telegramUserId: msg.from.id,
          projectId: this.dialogflowConfig.projectId,
          sessionOfUsers: {
            sessionId,
            requestsMetadata: [{ ts, request }],
            responsesMetadata: [{ ts, response: responses[0] }],
          },
        });
      }
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        `Intent: ${result.intent.displayName}`,
        this.dialogflowConfig.name
      );
    } else {
      this.debugService.sendDebugInfo(
        msg,
        ctx,
        'No intent matched.',
        this.dialogflowConfig.name
      );
    }
    return result.fulfillmentText;
  }
}
```

## Add module

_libs/dialogflow/server/src/lib/dialogflow.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  DialogflowConfig,
  DIALOGFLOW_CONFIG,
} from './dialogflow-config/dialogflow.config';
import { DialogflowService } from './dialogflow-services/dialogflow.service';
import { DialogflowStorage } from './dialogflow-services/dialogflow.storage';

@Module({
  imports: [
    TranslatesModule,
    PrismaClientModule,
    BotCommandsModule,
    DebugMessagesModule,
  ],
  providers: [DialogflowStorage],
  exports: [
    TranslatesModule,
    PrismaClientModule,
    BotCommandsModule,
    DebugMessagesModule,
    DialogflowStorage,
  ],
})
export class DialogflowModule {
  static forRoot(config: Pick<DialogflowConfig, 'projectId'>): DynamicModule {
    return {
      module: DialogflowModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [DialogflowModule],
          providers: [
            {
              provide: DIALOGFLOW_CONFIG,
              useValue: <DialogflowConfig>{
                name: getText('Dialogflow'),
                usage: [
                  getText('dialog hello'),
                  getText('ai hello'),
                  getText('debug help'),
                  getText('ai help'),
                ],
                descriptions: getText(
                  'Commands for process request with dialogflow intents'
                ),
                spyWords: [getText('dialog'), getText('ai')],
                ...config,
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: DialogflowService,
            },
          ],
          exports: [DIALOGFLOW_CONFIG],
        }),
      ],
    };
  }
}
```

## Update application files

### Update AppService

_apps/server/src/app/app.service.ts_

```ts
import { BotСommandsService } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botСommandsService: BotСommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Welcome'));
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botСommandsService.process(ctx, () => ctx.reply('👍'));
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Hey there'));
  }

  @On('text')
  async onMessage(ctx) {
    await this.botСommandsService.process(ctx);
  }
}
```

### Update AppModule

_apps/server/src/app/app.module.ts_

```ts
import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DialogflowModule } from '@kaufman-bot/dialogflow/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    BotCommandsModule,
    LanguageSwitherModule.forRoot(),
    DebugMessagesModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Update .env.local

_.env.local_

```sh
TELEGRAM_BOT_TOKEN=1111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
ROOT_POSTGRES_USER=postgres
ROOT_POSTGRES_PASSWORD=postgres
ROOT_POSTGRES_URL=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@localhost:5432/postgres?schema=public
SERVER_POSTGRES_URL=postgres://admin_develop:password_develop@localhost:5432/kaufman_bot_develop?schema=public
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
DIALOGFLOW_PROJECT_ID=service-account-urui
```

### Update all ts files and translates

> npm run generate

Update all dictionaries with po editor

![Need to translate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/83jn5p0vbfbffg7k98g9.png)

![Translated](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xar07vt82ciqottyo82f.png)

Convert all po files to json

> npm run generate

## Add environments and file with google-credentials to github

### Add google-credentials.json

Because file is multiline, you must convert it to base 64 string

> echo $(cat google-credentials.json | base64 -w0)
> ![echo $(cat google-credentials.json | base64 -w0)](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1sb72l66taeaig99xbl0.png)

Set string in github env
![Set string in github env](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oww0pimfafmxxz1zqrt4.png)

### Add project id

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k1sntwvxpkyiaqfvi0h0.png)

### View all envs

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m8trfizd8xgszl1yvbdu.png)

## Update for deploy

### Update github action config

_.github/workflows/develop.deploy.yml_

```yaml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
          dokku config:set --no-restart kaufman-bot SERVER_POSTGRES_URL=$SERVER_POSTGRES_URL
          dokku config:set --no-restart --global POSTGRES_HOST=global-postgres
          dokku config:set --no-restart kaufman-bot GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
          dokku config:set --no-restart kaufman-bot GOOGLE_CREDENTIALS=${{secrets.GOOGLE_CREDENTIALS}}
          dokku config:set --no-restart kaufman-bot DIALOGFLOW_PROJECT_ID=${{secrets.DIALOGFLOW_PROJECT_ID}}

  deploy:
    needs: [migrate]
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

### Update start sections in package.json

_package.json_

```json
...
  "scripts": {
    ...
    "start": "echo $GOOGLE_CREDENTIALS | base64 --decode > ./$GOOGLE_APPLICATION_CREDENTIALS && node dist/apps/server/main.js",
    ...
  }
...
```

## Check new logic in telegram bot

Common help message
![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/j7lhws2m67gs40n7340n.png)

Help message for dialogflow command
![Help message for dialogflow command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ok829qe06zang3ts9vg0.png)

Check work command with use spy word
![Check work command with use spy word](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w9eiu6tlsvrvlc7y6d59.png)

Check work global handler for all unhandled messages
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z2dr5m885135ec7bmsgf.png)

Check disabled work global handler if set default application handler
![result 1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qj1jnslpccanxqm2oidp.png)
![result 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/73vrtriz941okl96hxln.png)

Check logic in Russia language
![Check logic in Russia language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2gi5nlyqv73hqfmhtefi.png)

Show debug information of process
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c6tvqj0y7y1b89rmo22k.png)

In the next post, I will add different multilingual settings for facts commands...

#kaufmanbot #nestjs #telegram #dialogflow

# [2022-04-05 15:13] Add different multilingual settings for FactsGeneratorModule in NestJS Telegram bot

##Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://dev.to/endykaufman/series/17029 - series about custom injector

## Description of work

The fact generator is based on the ScraperModule, we will not introduce the logic of supporting different configurations for different languages into this module.

For different options for working for different languages, we will add a duplicate ScraperModule import with a different configuration and create a language-specific command handler.

In order for the logic of two different ScraperModules not to overlap, we will wrap its import in CustomInjectorModule.forFeature.

## Update facts-generator

### Create new service for Russian language

_libs/facts-generator/server/src/lib/facts-generator-services/ru-facts-generator.service.ts_

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
export class RuFactsGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = msg.from?.language_code;
    if (!locale?.includes('ru')) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (!locale?.includes('ru')) {
      return null;
    }
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
            text: result.text.split('\\"').join('"').split('\n').join(' '),
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

### Update old service for English language

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
    const locale = msg.from?.language_code;
    if (locale?.includes('ru')) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (locale?.includes('ru')) {
      return null;
    }
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

### Update FactsGeneratorModule

_libs/facts-generator/server/src/lib/facts-generator.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import { FactsGeneratorService } from './facts-generator-services/facts-generator.service';
import { RuFactsGeneratorService } from './facts-generator-services/ru-facts-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class FactsGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: FactsGeneratorModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Facts generator'),
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
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
        }),
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Facts generator'),
              descriptions: getText(
                'Command to generate text with a random fact'
              ),
              usage: [getText('get facts'), getText('facts help')],
              contentSelector: '#fact > table > tbody > tr > td',
              spyWords: [getText('facts')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://randstuff.ru/fact/',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: RuFactsGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
      ],
    };
  }
}
```

## Prepare files and append translates if need

> npm run generate

Because nothing to changed, we may commit code and test it from telegram
![nothing to changed](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vf7lm466xicbxfc9wcjn.png)

## Check new logic in telegram bot

### Common help message

![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qeyts6n0zi2jfp00h20i.png)

### Common help message in Russian language

![Common help message in Russian language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g8op5b0k3fidqspjarvr.png)

### Get fact in English language

![Get fact in English language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q7ocfamm8vb9a36gg3fz.png)

### Get fact in Russian language

![Get fact in Russian language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z5b38bwr7ohjiro3u1jp.png)

In the next post, I will add people quotes and jokes for English and Russian languages...

#kaufmanbot #nestjs #telegram #facts

# [2022-04-06 10:32] Create module for generate random quote of famus people in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://www.forismatic.com/ - site for generate random quotes in English and Russian languages

## Description of work

If you describe the addition of two modules at once on people's quotes and jokes, a very large post will come out

I decided to split the work into two separate posts

This module is a copy of the fact generator, it just uses another site for data parsing and other settings

This module uses features of the scrapper module that have not been used before:

1. using the user's locale in the page address for parsing
2. multiple element selector
3. modification of pre-installed anti anti ddos headers

## Create QuoteModule

### Add new library plugins

> npm run -- nx g @nrwl/nest:lib quotes-generator/server

```ts
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib quotes-generator/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "quotes-generator/server"

CREATE libs/quotes-generator/server/README.md
CREATE libs/quotes-generator/server/.babelrc
CREATE libs/quotes-generator/server/src/index.ts
CREATE libs/quotes-generator/server/tsconfig.json
CREATE libs/quotes-generator/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/quotes-generator/server/project.json
UPDATE workspace.json
CREATE libs/quotes-generator/server/.eslintrc.json
CREATE libs/quotes-generator/server/jest.config.js
CREATE libs/quotes-generator/server/tsconfig.spec.json
CREATE libs/quotes-generator/server/src/lib/quotes-generator-server.module.ts
```

![npm run -- nx g @nrwl/nest:lib quotes-generator/server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/69mau8eegthlkm66ylm9.png)

### Add QuotesGeneratorService

_libs/quotes-generator/server/src/lib/quotes-generator-services/quotes-generator.service.ts_

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
export class QuotesGeneratorService implements BotCommandsProvider {
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
    let locale = msg.from?.language_code;
    if (!locale?.includes('ru') || !locale?.includes('en')) {
      locale = 'en';
    }
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
            text: result.text.split('\\"').join('"').split('\n').join(' '),
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

### Add QuotesGeneratorModule

_libs/quotes-generator/server/src/lib/quotes-generator.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { QuotesGeneratorService } from './quotes-generator-services/quotes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class QuotesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: QuotesGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          name: getText('Quotes generator'),
          descriptions: getText(
            'Command to generate text with a random quotes'
          ),
          usage: [getText('get quote'), getText('quotes help')],
          contentSelector:
            'forismatic > quote > quotetext, forismatic > quote > quoteauthor',
          spyWords: [getText('quotes'), getText('quote')],
          removeWords: [getText('get'), getText('please')],
          uri: 'https://api.forismatic.com/api/1.0/?method=getQuote&format=xml&lang={{locale}}',
          contentCodepage: 'utf8',
          headers: [{}],
        }),
      ],
      providers: [
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: QuotesGeneratorService,
        },
      ],
      exports: [ScraperModule],
    };
  }
}
```

### Prepare files

> npm run generate
> ![npm run generate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ziaje76wygxfwjua6012.png)

### Translate all words with po editor

Look list of all dictionaries
![Look list of all dictionaries](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kk1cqm7msrohb9guefvn.png)

Append all needed translates
![Append all needed translates](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2jw8w7hof1hbad0fh6gr.png)

### Prepare files for convert po dictionaries to json

> npm run generate

### Add QuotesGeneratorModule to AppModule

_apps/server/src/app/app.module.ts_

```ts
@Module({
  imports: [
    ...
    QuotesGeneratorModule.forRoot(),
    ...
  ],
  ...
})
export class AppModule {}
```

## Check new logic in telegram bot

### Common help message

![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vgdmui5q2nndonq32d96.png)

### Get quotes in English language

![Get quotes in English language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/addt82j2z8oy5btr8r5f.png)

### Get quotes in Russian language

![Get quotes in Russian language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/66efp0pitzf1opmga763.png)

In the next post, I will add people jokes for English and Russian languages...

#kaufmanbot #nestjs #telegram #quotes

# [2022-04-07 18:42] Create module for generate random jokes in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

https://jokeapi.dev/ - site for generate random jokes in English language

https://randstuff.ru/joke/ - site for generate random jokes in Russian language

## Description of work

In this example, we are using the previously created code for the command to generate jokes for different languages.

The difference is only in the page address and parsing options, plus the hardcode with the Russian language was removed from the service for default work in English.

## Create jokes module

### Add new library plugins

> npm run -- nx g @nrwl/nest:lib jokes-generator/server

```ts
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib jokes-generator/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "jokes-generator/server"

CREATE libs/jokes-generator/server/README.md
CREATE libs/jokes-generator/server/.babelrc
CREATE libs/jokes-generator/server/src/index.ts
CREATE libs/jokes-generator/server/tsconfig.json
CREATE libs/jokes-generator/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/jokes-generator/server/project.json
UPDATE workspace.json
CREATE libs/jokes-generator/server/.eslintrc.json
CREATE libs/jokes-generator/server/jest.config.js
CREATE libs/jokes-generator/server/tsconfig.spec.json
CREATE libs/jokes-generator/server/src/lib/jokes-generator-server.module.ts
```

![npm run -- nx g @nrwl/nest:lib jokes-generator/server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8a4fypc98wmk9vkm2c2c.png)

### Add JokesGeneratorService

_libs/jokes-generator/server/src/lib/jokes-generator-services/jokes-generator.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Injectable } from '@nestjs/common';
import { TranslatesStorage } from 'nestjs-translates';

@Injectable()
export class JokesGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService,
    private readonly translatesStorage: TranslatesStorage
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = msg.from?.language_code;
    if (
      Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      ) &&
      !locale?.includes(DEFAULT_LANGUAGE)
    ) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (
      Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      ) &&
      !locale?.includes(DEFAULT_LANGUAGE)
    ) {
      return null;
    }
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
            text: result.text.split('\\"').join('"').split('\n').join(' '),
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

### Add RuJokesGeneratorService

_libs/jokes-generator/server/src/lib/jokes-generator-services/ru-jokes-generator.service.ts_

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

const RUSSIAN_LANGUAGE = 'ru';

@Injectable()
export class RuJokesGeneratorService implements BotCommandsProvider {
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService
  ) {}

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = msg.from?.language_code;
    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (!locale?.includes(RUSSIAN_LANGUAGE)) {
      return null;
    }
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
            text: result.text.split('\\"').join('"').split('\n').join(' '),
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

### Add JokesGeneratorModule

_libs/jokes-generator/server/src/lib/jokes-generator.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import { JokesGeneratorService } from './jokes-generator-services/jokes-generator.service';
import { RuJokesGeneratorService } from './jokes-generator-services/ru-jokes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class JokesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: JokesGeneratorModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Jokes generator'),
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [getText('get joke'), getText('jokes help')],
              contentSelector: '#joke > table > tbody > tr > td',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://randstuff.ru/joke/',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: RuJokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              name: getText('Jokes generator'),
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [getText('get joke'), getText('jokes help')],
              contentSelector: 'data > joke',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single&format=xml',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: JokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
      ],
    };
  }
}
```

### Prepare files

> npm run generate

### Translate all words with po editor

Look list of all dictionaries
![Look list of all dictionaries](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4agf7il23yq5z9o4yhnr.png)

Append all needed translates
![Append all needed translates](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/etbqbohssmkl801exslz.png)

### Prepare files for convert po dictionaries to json

> npm run generate

### Add JokesGeneratorModule to AppModule

_apps/server/src/app/app.module.ts_

```ts
@Module({
  imports: [
    ...
    JokesGeneratorModule.forRoot(),
    ...
  ],
  ...
})
export class AppModule {}
```

## Check new logic in telegram bot

### Common help message

![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9ho7dvr36mvqac0v4bpz.png)

### Get jokes in English language

![Get jokes in English language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f65bcexvaxfssdj73swg.png)

### Get jokes in Russian language

![Get jokes in Russian language](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cdog6gh2b6vusat6doho.png)

In the nest post I will create recursive command handler for create shortcodes for run any other commands of bot, and I will use previouse answer for work active process...

#kaufmanbot #nestjs #telegram #jokes

# [2022-04-09 00:32] Create short commands and example using recursive contextable work in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Description of work

In this post, I will describe the creation of the short commands module, it is needed for faster command call.

At the end of the post I will give an example of using recursive contextable work

## Add short commands

This command module need to use short versions for run other command handlers

### Create nx library

> npm run -- nx g @nrwl/nest:lib short-commands/server

```
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib short-commands/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "short-commands/server"

CREATE libs/short-commands/server/README.md
CREATE libs/short-commands/server/.babelrc
CREATE libs/short-commands/server/src/index.ts
CREATE libs/short-commands/server/tsconfig.json
CREATE libs/short-commands/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/short-commands/server/project.json
UPDATE workspace.json
CREATE libs/short-commands/server/.eslintrc.json
CREATE libs/short-commands/server/jest.config.js
CREATE libs/short-commands/server/tsconfig.spec.json
CREATE libs/short-commands/server/src/lib/short-commands-server.module.ts
```

![npm run -- nx g @nrwl/nest:lib short-commands/server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lj3t56p5b9nav2vxaalq.png)

### Add ShortCommandsConfig

_libs/short-commands/server/src/lib/short-commands-config/short-commands.config.ts_

```ts
export const SHORT_COMMANDS_CONFIG = Symbol('SHORT_COMMANDS_CONFIG');

export interface ShortCommandsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  commands: { [langCode: string]: { [text: string]: string } };
}
```

### Add ShortCommandsService

_libs/short-commands/server/src/lib/short-commands-services/short-commands.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from '../short-commands-config/short-commands.config';

@Injectable()
export class ShortCommandsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(ShortCommandsService.name);

  constructor(
    @Inject(SHORT_COMMANDS_CONFIG)
    private readonly shortCommandsConfig: ShortCommandsConfig,
    private readonly botСommandsToolsService: BotСommandsToolsService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale = msg.from.language_code;
    const text = msg.text;
    if (locale && this.shortCommandsConfig) {
      const shortCommands = this.shortCommandsConfig.commands[locale] || {};
      const matchedCommands = Object.keys(shortCommands)
        .filter((commands) =>
          this.botСommandsToolsService.checkCommands(text, commands.split('|'))
        )
        .map((commands) => shortCommands[commands]);
      if (matchedCommands?.length > 0) {
        msg.text = matchedCommands[0];
      }
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.shortCommandsConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = DEFAULT_LANGUAGE;
    }

    const spyWord = this.shortCommandsConfig.spyWords.find((spyWord) =>
      this.botСommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botСommandsToolsService.generateHelpMessage({
            locale,
            name: this.shortCommandsConfig.title,
            descriptions: this.shortCommandsConfig.descriptions,
            usage: this.shortCommandsConfig.usage,
          }),
        };
      }

      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.state],
          locale
        )
      ) {
        const detectedLang =
          Object.keys(this.shortCommandsConfig.commands).filter(
            (langCode) =>
              this.shortCommandsConfig.commands[langCode] && langCode === locale
          )[0] || DEFAULT_LANGUAGE;
        const commands = this.shortCommandsConfig.commands[detectedLang] || {};
        const aliases = Object.keys(commands);

        const markdown = [
          `__${this.translatesService.translate(
            getText('List of short commands:'),
            locale
          )}__`,
          ...aliases.map((alias) =>
            locale
              ? [
                  `${this.translatesService.translate(
                    getText('alias'),
                    locale
                  )}: ${alias
                    .split('|')
                    .map((u) => `_${u}_`)
                    .join(', ')}`,
                  `${this.translatesService.translate(
                    getText('command'),
                    locale
                  )}: ${commands[alias]}\n`,
                ].join('\n')
              : ''
          ),
        ]
          .filter(Boolean)
          .join('\n');
        return {
          type: 'markdown',
          message: msg,
          markdown,
        };
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }
}
```

### ShortCommandsModule

_libs/short-commands/server/src/lib/short-commands.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  ShortCommandsConfig,
  SHORT_COMMANDS_CONFIG,
} from './short-commands-config/short-commands.config';
import { ShortCommandsService } from './short-commands-services/short-commands.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class ShortCommandsModule {
  static forRoot(config: Pick<ShortCommandsConfig, 'commands'>): DynamicModule {
    return {
      module: ShortCommandsModule,
      providers: [
        {
          provide: SHORT_COMMANDS_CONFIG,
          useValue: <ShortCommandsConfig>{
            title: getText('Short commands'),
            name: 'scmd',
            usage: [getText('scmd state'), getText('scmd help')],
            descriptions: getText(
              'Shortened versions of commands for quick launch'
            ),
            spyWords: [getText('scmd')],
            commands: config.commands,
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: ShortCommandsService,
        },
      ],
    };
  }
}
```

### Prepare files

> npm run generate

### Translate all words with po editor

![Translate all words with po editor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0ffhekumqwxdvsv85g54.png)

### Prepare files for convert po dictionaries to json

> npm run generate

### Add ShortCommandsModule to AppModule

_apps/server/src/app/app.module.ts_

```ts
@Module({
  imports: [
    ...
    BotCommandsModule.forRoot(),
    LanguageSwitherModule.forRoot(),
    DebugMessagesModule.forRoot(),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          joke: 'get jokes',
          'quote|thought|wisdom': 'get quotes',
          'facts|fact|history': 'get facts',
        },
        ru: {
          'joke|jokes|шутка|шутки|пошути|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          'quote|thought|wisdom|цитата|цитаты|цитируй|мысль|мудрость|залечи':
            'get quotes',
          'facts|fact|history|факт|факты|история': 'get facts',
        },
      },
    }),
    ...
  ],
  ...
})
export class AppModule {}
```

### Check new logic in telegram bot

Common help message
![Common help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b34uwfh5fh7ydq52ne7j.png)

Get state of short commands
![Get state of short commands](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ron9rlisrtbv7n8zlsdo.png)

Try usage one of short command
![Try usage one of short command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dgcocf1isswaf52lb92l.png)

## Recursive contextable work

I am not write all process of create this logic, because that have very more code, I write about only usage on simple example on jokes commands

### Update JokesGeneratorService

_libs/jokes-generator/server/src/lib/jokes-generator-services/jokes-generator.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core/server';
import { ScraperService } from '@kaufman-bot/html-scraper/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Injectable } from '@nestjs/common';
import { TranslatesStorage } from 'nestjs-translates';

@Injectable()
export class JokesGeneratorService
  implements BotCommandsProvider, OnContextBotCommands
{
  constructor(
    private readonly scraperService: ScraperService,
    private readonly botСommandsToolsService: BotСommandsToolsService,
    private readonly translatesStorage: TranslatesStorage
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const contextMsg = await this.scraperService.onContextBotCommands(msg);
    return contextMsg ? this.onMessage(contextMsg.message) : null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const locale = msg.from?.language_code;
    if (
      Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      ) &&
      !locale?.includes(DEFAULT_LANGUAGE)
    ) {
      return null;
    }
    return await this.scraperService.onHelp(msg);
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = msg.from?.language_code;
    if (
      Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      ) &&
      !locale?.includes(DEFAULT_LANGUAGE)
    ) {
      return null;
    }
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
            message: msg,
            text: result.text.split('\\"').join('"').split('\n').join(' '),
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

### Update JokesGeneratorModule

_libs/jokes-generator/server/src/lib/jokes-generator.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import { JokesGeneratorService } from './jokes-generator-services/jokes-generator.service';
import { RuJokesGeneratorService } from './jokes-generator-services/ru-jokes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class JokesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: JokesGeneratorModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              title: getText('Jokes generator'),
              name: 'jokes',
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [getText('get joke'), getText('jokes help')],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: '#joke > table > tbody > tr > td',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://randstuff.ru/joke/',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: RuJokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
        CustomInjectorModule.forFeature({
          imports: [
            ScraperModule.forRoot({
              title: getText('Jokes generator'),
              name: 'jokes',
              descriptions: getText(
                'Command to generate text with a random jokes'
              ),
              usage: [getText('get joke'), getText('jokes help')],
              contextUsage: [getText('more'), getText('next')],
              contentSelector: 'data > joke',
              spyWords: [getText('jokes'), getText('joke')],
              removeWords: [getText('get'), getText('please')],
              uri: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single&format=xml',
              contentCodepage: 'utf8',
            }),
          ],
          providers: [
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: JokesGeneratorService,
            },
          ],
          exports: [ScraperModule],
        }),
      ],
    };
  }
}
```

### Check new logic in telegram bot

Example with save information of last active commands and use it for generate response
![Example with save information of last active commands and use it for generate response](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nvt4ss5vonmg3klucoz9.png)

Words for use in context mode your may see in help text
![Words for use in context mode your may see in help text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h0ar2ocyvv8c4i4f1am0.png)

In next post I am append simple commands module with example recursive work with include "if else" logics...

#kaufmanbot #nestjs #telegram #recursive

# [2022-04-10 23:22] Create example of recursive contextable commands "first meeting" with store data in database for Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Description of work

In this post I will am create recursive contextable commands

This is command will meeting with new users and save information about them in database and use these in later

## Create first meeting

### Create migrations for all need tables

_migrations/V202204101203\_\_CreateFirstMeeting.pgsql_

```sql
DO $$
BEGIN
    CREATE TYPE "Gender" AS ENUM (
        'Male',
        'Female'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE "FirstMeetingStatus" AS ENUM (
        'StartMeeting',
        'AskFirstname',
        'AskLastname',
        'AskGender',
        'EndMeeting'
);
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END
$$;

CREATE TABLE IF NOT EXISTS "FirstMeeting" (
    id uuid DEFAULT uuid_generate_v4 () NOT NULL,
    "userId" uuid NOT NULL CONSTRAINT "FK_FIRST_MEETING__USER_ID" REFERENCES "User",
    "status" "FirstMeetingStatus" NOT NULL,
    "firstname" varchar(100) NOT NULL,
    "lastname" varchar(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "PK_FIRST_MEETING" PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_FIRST_MEETING" ON "FirstMeeting" ("userId");


```

Apply migration in database

> npm run migrate:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run migrate:local

> kaufman-bot@0.0.0 migrate:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate


> kaufman-bot@0.0.0 migrate
> npm run flyway -- migrate


> kaufman-bot@0.0.0 flyway
> flyway -c .flyway.js "migrate"

Flyway Community Edition 6.3.2 by Redgate
Database: jdbc:postgresql://localhost:5432/kaufman_bot_develop (PostgreSQL 13.3)
WARNING: Flyway upgrade recommended: PostgreSQL 13.3 is newer than this version of Flyway and support has not been tested. The latest supported version of PostgreSQL is 12.
Successfully validated 5 migrations (execution time 00:00.017s)
Current version of schema "public": 202204030939
Migrating schema "public" to version 202204101203 - CreateFirstMeeting
Successfully applied 1 migration to schema "public" (execution time 00:00.043s)
```

![npm run migrate:local](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9g7dk5623q158o97u50h.png)

Update prisma schema from exists database

> npm run prisma:pull:local

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run prisma:pull:local

> kaufman-bot@0.0.0 prisma:pull:local
> export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate


> kaufman-bot@0.0.0 prisma
> prisma "db" "pull"

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "kaufman_bot_develop", schema "public" at "localhost:5432"

Introspecting based on datasource defined in prisma/schema.prisma …

✔ Introspected 4 models and wrote them into prisma/schema.prisma in 123ms

Run prisma generate to generate Prisma Client.


> kaufman-bot@0.0.0 prisma:generate
> npm run -- prisma generate


> kaufman-bot@0.0.0 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 192ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

![npm run prisma:pull:local](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n1etszh7ch3oz7voh6n4.png)

Prisma schema after run that command

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String              @id(map: "PK_USERS") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  telegramId        String              @unique(map: "UQ_USERS__TELEGRAM_ID") @db.VarChar(64)
  langCode          String              @default("en") @db.VarChar(64)
  debugMode         Boolean             @default(false)
  DialogflowSession DialogflowSession[]
  FirstMeeting      FirstMeeting?
}

model migrations {
  installed_rank Int      @id(map: "__migrations_pk")
  version        String?  @db.VarChar(50)
  description    String   @db.VarChar(200)
  type           String   @db.VarChar(20)
  script         String   @db.VarChar(1000)
  checksum       Int?
  installed_by   String   @db.VarChar(100)
  installed_on   DateTime @default(now()) @db.Timestamp(6)
  execution_time Int
  success        Boolean

  @@index([success], map: "__migrations_s_idx")
  @@map("__migrations")
}

model DialogflowSession {
  id                String   @id(map: "PK_DIALOGFLOW_SESSION") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String   @db.Uuid
  projectId         String   @db.VarChar(512)
  sessionId         String   @db.Uuid
  requestsMetadata  Json     @default("[]")
  responsesMetadata Json     @default("[]")
  createdAt         DateTime @default(now()) @db.Timestamp(6)
  updatedAt         DateTime @default(now()) @db.Timestamp(6)
  User              User     @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_DIALOGFLOW_SESSION__USER_ID")

  @@unique([userId, projectId, sessionId], map: "UQ_DIALOGFLOW_SESSION")
}

model FirstMeeting {
  id        String             @id(map: "PK_FIRST_MEETING") @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId    String             @unique(map: "UQ_FIRST_MEETING") @db.Uuid
  status    FirstMeetingStatus
  firstname String             @db.VarChar(100)
  lastname  String             @db.VarChar(100)
  gender    Gender
  createdAt DateTime           @default(now()) @db.Timestamp(6)
  updatedAt DateTime           @default(now()) @db.Timestamp(6)
  User      User               @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_FIRST_MEETING__USER_ID")
}

enum FirstMeetingStatus {
  StartMeeting
  AskFirstname
  AskLastname
  AskGender
  EndMeeting
}

enum Gender {
  Male
  Female
}

```

### Create nx lib

> npm run -- nx g @nrwl/nest:lib first-meeting/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib first-meeting/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "first-meeting/server"

CREATE libs/first-meeting/server/README.md
CREATE libs/first-meeting/server/.babelrc
CREATE libs/first-meeting/server/src/index.ts
CREATE libs/first-meeting/server/tsconfig.json
CREATE libs/first-meeting/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/first-meeting/server/project.json
UPDATE workspace.json
CREATE libs/first-meeting/server/.eslintrc.json
CREATE libs/first-meeting/server/jest.config.js
CREATE libs/first-meeting/server/tsconfig.spec.json
CREATE libs/first-meeting/server/src/lib/first-meeting-server.module.ts
```

![npm run -- nx g @nrwl/nest:lib first-meeting/server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/devyxkkz9ptysm48gtb8.png)

### Create config

_libs/first-meeting/server/src/lib/first-meeting-config/first-meeting.config.ts_

```ts
export const FIRST_MEETING_CONFIG = Symbol('FIRST_MEETING_CONFIG');

export interface FirstMeetingConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
}
```

### Create storage service

_libs/first-meeting/server/src/lib/first-meeting-services/first-meeting.storage.ts_

```ts
import { PrismaClientService } from '@kaufman-bot/core/server';
import { Injectable } from '@nestjs/common';
import { FirstMeeting } from '@prisma/client';

@Injectable()
export class FirstMeetingStorage {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserFirstMeeting({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }

    let databaseFirstMeetingOfUsers: FirstMeeting | null = null;
    try {
      databaseFirstMeetingOfUsers =
        await this.prismaClientService.firstMeeting.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
          },
          rejectOnNotFound: true,
        });
    } catch (error) {
      databaseFirstMeetingOfUsers =
        await this.prismaClientService.firstMeeting.create({
          data: {
            firstname: '',
            lastname: '',
            gender: 'Male',
            status: 'StartMeeting',
            User: {
              connectOrCreate: {
                create: { telegramId: telegramUserId.toString() },
                where: { telegramId: telegramUserId.toString() },
              },
            },
          },
        });
    }
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      databaseFirstMeetingOfUsers;

    return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async removeUserFirstMeeting({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    await this.prismaClientService.firstMeeting.deleteMany({
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });
  }

  async pathUserFirstMeeting({
    telegramUserId,
    firstMeeting,
  }: {
    telegramUserId: number;
    firstMeeting: Partial<FirstMeeting>;
  }) {
    const currentUserFirstMeeting = this.getUserFirstMeeting({
      telegramUserId,
    });

    await this.prismaClientService.firstMeeting.updateMany({
      data: {
        ...currentUserFirstMeeting,
        ...firstMeeting,
        updatedAt: new Date(),
      },
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });

    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      await this.getUserFirstMeeting({ telegramUserId });
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
```

### Create service

_libs/first-meeting/server/src/lib/first-meeting-services/first-meeting.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotСommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
  OnContextBotCommands,
} from '@kaufman-bot/core/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable } from '@nestjs/common';
import { FirstMeeting } from '@prisma/client';
import { getText } from 'class-validator-multi-lang';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import { FirstMeetingStorage } from './first-meeting.storage';

@Injectable()
export class FirstMeetingService
  implements
    BotCommandsProvider,
    OnAfterBotCommands,
    OnContextBotCommands,
    OnBeforeBotCommands
{
  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly firstMeetingConfig: FirstMeetingConfig,
    private readonly botСommandsToolsService: BotСommandsToolsService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService,
    private readonly firstMeetingStorage: FirstMeetingStorage
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    if (msg.botStart) {
      msg.text = 'meet start';
      msg.botStart = false;
    }
    return msg;
  }

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = DEFAULT_LANGUAGE;
    }
    const contextFirstMeeting: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;

    if (
      this.botСommandsToolsService.checkCommands(
        msg.text,
        [this.firstMeetingConfig.name],
        locale
      ) ||
      Object.keys(contextFirstMeeting).length > 0
    ) {
      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [
            getText('exit'),
            getText('reset'),
            getText('cancel'),
            getText('stop'),
            getText('end'),
          ],
          locale
        )
      ) {
        await this.firstMeetingStorage.pathUserFirstMeeting({
          telegramUserId: msg.from.id,
          firstMeeting: {
            ...msg.botCommandHandlerContext,
            status: 'EndMeeting',
          },
        });
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`{{close}} Meeting canceled`),
            locale,
            { close: '❌' }
          ),
          message: msg,
          context: { status: 'EndMeeting' },
        };
      }

      if (contextFirstMeeting?.status === 'AskFirstname') {
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`What is your last name?`),
            locale
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskLastname',
            firstname: this.prepareText(msg.text, locale) || 'Unknown',
          },
        };
      }

      if (contextFirstMeeting?.status === 'AskLastname') {
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`What is your gender?`),
            locale
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskGender',
            lastname: this.prepareText(msg.text, locale),
          },
        };
      }

      if (contextFirstMeeting?.status === 'AskGender') {
        const firstMeeting: Partial<FirstMeeting> = {
          ...contextFirstMeeting,
          status: 'EndMeeting',
          gender: this.botСommandsToolsService.checkCommands(
            this.prepareText(msg.text, locale),
            [getText('female'), getText('fm')],
            locale
          )
            ? 'Female'
            : 'Male',
        };
        await this.firstMeetingStorage.pathUserFirstMeeting({
          telegramUserId: msg.from.id,
          firstMeeting,
        });
        return {
          type: 'text',
          text: this.translatesService.translate(
            this.getRandomItem([
              getText(
                `Nice to meet you, {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
              ),
              getText(`Nice to meet you, {{firstname}} {{vulcan}}`),
            ]),
            locale,
            {
              vulcan: '🖖',
              ...firstMeeting,
              meetGender: this.mapGenderToMeetGender(firstMeeting, locale),
              firstname: this.capitalizeFirstLetter(
                firstMeeting.firstname,
                locale
              ),
              lastname: this.capitalizeFirstLetter(
                firstMeeting.lastname,
                locale
              ),
            }
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{ status: 'EndMeeting' },
        };
      }
    }

    return null;
  }

  async onAfterBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    result: BotCommandsProviderActionResultType<TMsg>,
    msg: TMsg
  ): Promise<{ result: BotCommandsProviderActionResultType<TMsg>; msg: TMsg }> {
    if (msg.botStart) {
      await this.firstMeetingStorage.removeUserFirstMeeting({
        telegramUserId: msg.from.id,
      });
    }
    if (result === null) {
      msg.text = `${this.firstMeetingConfig.name} ${msg.text}`;
      const newResult = await this.onMessage<TMsg>(msg);
      if (newResult !== null) {
        return { result: newResult, msg };
      }
    }
    return { result, msg };
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.firstMeetingConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    let locale = msg.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = DEFAULT_LANGUAGE;
    }

    const firstMeeting = await this.firstMeetingStorage.getUserFirstMeeting({
      telegramUserId: msg.from.id,
    });
    const spyWord = this.firstMeetingConfig.spyWords.find((spyWord) =>
      this.botСommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botСommandsToolsService.generateHelpMessage({
            locale,
            name: this.firstMeetingConfig.title,
            descriptions: this.firstMeetingConfig.descriptions,
            usage: this.firstMeetingConfig.usage,
          }),
        };
      }

      if (
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.reset],
          locale
        )
      ) {
        await this.firstMeetingStorage.removeUserFirstMeeting({
          telegramUserId: msg.from.id,
        });

        return {
          type: 'text',
          text: this.translatesService.translate(
            this.getRandomItem([
              getText('Your meeting information has been deleted {{unamused}}'),
              getText('I forgot about your existence {{worried}}'),
            ]),
            locale,
            {
              unamused: '😒',
              worried: '😟',
            }
          ),
          message: msg,
        };
      }
    }

    if (
      !this.botСommandsToolsService.checkCommands(
        msg.text,
        [BotCommandsEnum.help],
        locale
      ) &&
      ((spyWord &&
        this.botСommandsToolsService.checkCommands(
          msg.text,
          [getText('start')],
          locale
        )) ||
        firstMeeting?.status === 'StartMeeting')
    ) {
      await this.firstMeetingStorage.pathUserFirstMeeting({
        telegramUserId: msg.from.id,
        firstMeeting: {
          status: 'AskFirstname',
          firstname: '',
          lastname: '',
          gender: 'Male',
        },
      });
      return {
        type: 'text',
        text: this.translatesService.translate(
          this.getRandomItem([
            getText(`Hey! I'm Endy {{smile}}, what's your name?`),
            getText(`Hey! what's your name?`),
          ]),
          locale,
          { smile: '🙂' }
        ),
        message: msg,
        context: <Partial<FirstMeeting>>{ status: 'AskFirstname' },
      };
    }

    if (
      firstMeeting.status === 'EndMeeting' &&
      this.botСommandsToolsService.checkCommands(
        msg.text,
        [getText('hi'), getText('hello'), getText('hey')],
        locale
      )
    ) {
      return {
        type: 'markdown',
        markdown: this.translatesService
          .translate(
            this.getRandomItem([
              getText(
                `Hello {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
              ),
              getText(`Hello {{firstname}} {{lastname}} {{handsplayed}}`),
              getText(`I'm glad to see you {{firstname}} {{wink}}`),
              getText(`Hi {{firstname}} {{vulcan}}`),
            ]),
            locale,
            {
              vulcan: '🖖',
              handsplayed: '🖐',
              wink: '😉',
              ...firstMeeting,
              meetGender: this.mapGenderToMeetGender(firstMeeting, locale),
              firstname: this.capitalizeFirstLetter(
                firstMeeting.firstname,
                locale
              ),
              lastname: this.capitalizeFirstLetter(
                firstMeeting.lastname,
                locale
              ),
            }
          )
          .split('  ')
          .join(' ')
          .split('  ')
          .join(' '),
        message: msg,
        context: {},
      };
    }

    return null;
  }

  private mapGenderToMeetGender(
    firstMeeting: Partial<FirstMeeting>,
    locale: string
  ) {
    return this.translatesService.translate(
      firstMeeting.gender === 'Female' ? getText('Madam') : getText('Sir'),
      locale
    );
  }

  private prepareText(text: string, locale: string) {
    if (
      this.botСommandsToolsService.checkCommands(
        text,
        [getText('skip'), getText('next')],
        locale
      )
    ) {
      return '';
    }
    return this.botСommandsToolsService
      .clearCommands(
        text,
        [
          getText('I'),
          getText('hi'),
          getText('hello'),
          getText('hey'),
          getText('am'),
          getText('my'),
          getText('is'),
          getText('name'),
          getText('lastname'),
          getText('firstname'),
          getText('last'),
          getText('first'),
        ],
        locale
      )
      .trim();
  }

  private getRandomItem(items: string[]) {
    return items[Math.floor(Math.random() * items.length)];
  }
  private capitalizeFirstLetter(text: string | undefined, locale: string) {
    const [first, ...rest] = (text || '').trim();
    return (first || '').toLocaleUpperCase(locale) + rest.join('');
  }
}
```

### Create module

_libs/first-meeting/server/src/lib/first-meeting.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from './first-meeting-config/first-meeting.config';
import { FirstMeetingService } from './first-meeting-services/first-meeting.service';
import { FirstMeetingStorage } from './first-meeting-services/first-meeting.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class FirstMeetingModule {
  static forRoot(): DynamicModule {
    return {
      module: FirstMeetingModule,
      imports: [PrismaClientModule],
      providers: [
        FirstMeetingStorage,
        {
          provide: FIRST_MEETING_CONFIG,
          useValue: <FirstMeetingConfig>{
            title: getText('First meeting'),
            name: 'meet',
            descriptions: getText(
              'Example of recursive contextable commands "first meeting"'
            ),
            usage: [
              getText('meet start'),
              getText('meet reset'),
              getText('meet help'),
            ],
            spyWords: [getText('meet')],
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: FirstMeetingService,
        },
      ],
      exports: [PrismaClientModule],
    };
  }
}
```

### Add FirstMeetingModule to AppModule

_apps/server/src/app/app.module.ts_

```ts
...
@Module({
  imports: [
    ...
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          joke: `get jokes`,
          'quote|thought|wisdom': 'get quotes',
          'facts|fact|history': 'get facts',
          'forgot me': 'meet reset',
          'what you can do|faq': 'help',
        },
        ru: {
          'joke|jokes|шутка|дай шутку|шутки|пошути|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          'quote|thought|wisdom|цитата|дай цитату|цитаты|цитируй|мысль|мудрость|залечи':
            'get quotes',
          'facts|fact|history|дай факт|факты|история': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          'what you can do|faq|что ты умеешь|справка': 'help',
        },
      },
    }),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot(),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Update AppService

_apps/server/src/app/app.service.ts_

```ts
import { BotСommandsService } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botСommandsService: BotСommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botСommandsService.start(ctx);
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botСommandsService.process(ctx);
  }

  @On('text')
  async onMessage(ctx) {
    await this.botСommandsService.process(ctx);
  }
}
```

### Prepare files for convert po dictionaries to json

> npm run generate

### Translate all words with po editor

![Translate all words with po editor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nl82uc4yuqsuehc66vae.png)

## Check new logic in telegram bot

### Help message

![Help message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/llifl62h3lq75ewlcpon.png)

### First write to a bot

![First write to a bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hxv66w4cm2p93j2err8q.png)

### Second write to a bot

![Second write to a bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cae1r48o0u630rawdoh5.png)

### Remove user information

![Remove user information](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9ppvl6ybj387mngch81r.png)

In next post I am add support work in groups and use global bot name for that...

#kaufmanbot #nestjs #recursive #postgres

# [2022-04-12 20:54] Add support work in groups and use global bot name for that in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Description of work

In the current post, I will create a module for using the bot in groups, and in order not to flood, I will use the global name of the bot or the telegram nickname of the bot for this

## Create use in groups command

### Create nx lib

> npm run -- nx g @nrwl/nest:lib bot-in-groups/server

```ts
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib bot-in-groups/server

> kaufman-bot@0.0.0 nx
> nx "g" "@nrwl/nest:lib" "bot-in-groups/server"

CREATE libs/bot-in-groups/server/README.md
CREATE libs/bot-in-groups/server/.babelrc
CREATE libs/bot-in-groups/server/src/index.ts
CREATE libs/bot-in-groups/server/tsconfig.json
CREATE libs/bot-in-groups/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/bot-in-groups/server/project.json
UPDATE workspace.json
CREATE libs/bot-in-groups/server/.eslintrc.json
CREATE libs/bot-in-groups/server/jest.config.js
CREATE libs/bot-in-groups/server/tsconfig.spec.json
CREATE libs/bot-in-groups/server/src/lib/bot-in-groups-server.module.ts
```

![npm run -- nx g @nrwl/nest:lib bot-in-groups/server](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pytm4f4vrk1n2mbmwxj7.png)

### Create config

_libs/bot-in-groups/server/src/lib/bot-in-groups-config/bot-in-groups.config.ts_

```ts
export const BOT_IN_GROUPS_CONFIG = Symbol('BOT_IN_GROUPS_CONFIG');

export interface BotInGroupsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botNames: { [langCode: string]: string[] };
  botMeetingInformation: { [langCode: string]: string[] };
  botDoNotHaveFullAccess: { [langCode: string]: string[] };
  botNowHaveFullAccess: { [langCode: string]: string[] };
}
```

### Create service

_libs/bot-in-groups/server/src/lib/bot-in-groups-services/bot-in-groups.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { DEFAULT_LANGUAGE } from '@kaufman-bot/language-swither/server';
import { Inject, Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale = this.botCommandsToolsService.getLocale(
      msg,
      DEFAULT_LANGUAGE
    );
    if (msg.from.id !== msg.chat.id) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          this.botInGroupsConfig.botNames[locale]
        )
      ) {
        msg.from.id = msg.chat.id;
        msg.text = this.botCommandsToolsService.clearCommands(
          msg.text,
          this.botInGroupsConfig.botNames[locale],
          locale
        );
      } else {
        msg.botCommandHandlerBreak = true;
      }
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.botInGroupsConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(
      msg,
      DEFAULT_LANGUAGE
    );

    const spyWord = this.botInGroupsConfig.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage({
            locale,
            name: this.botInGroupsConfig.title,
            descriptions: this.botInGroupsConfig.descriptions,
            usage: this.botInGroupsConfig.usage,
          }),
        };
      }
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [getText('meet')],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.getRandomItem(
            this.botInGroupsConfig.botMeetingInformation[locale]
          ),
        };
      }
    }

    return null;
  }
}
```

### Create processor service

_libs/bot-in-groups/server/src/lib/bot-in-groups-services/bot-in-groups-processor.service.ts_

```ts
import {
  BotCommandsService,
  BotCommandsToolsService,
} from '@kaufman-bot/core/server';
import { DISABLE_FIRST_MEETING_COMMANDS } from '@kaufman-bot/first-meeting/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherStorage,
} from '@kaufman-bot/language-swither/server';
import {
  DISABLE_SHORT_COMMANDS__BEFORE_HOOK,
  ShortCommandsToolsService,
} from '@kaufman-bot/short-commands/server';
import { Inject, Injectable } from '@nestjs/common';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsProcessorService {
  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botCommandsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly botCommandsService: BotCommandsService,
    private readonly languageSwitherStorage: LanguageSwitherStorage,
    private readonly shortCommandsToolsService: ShortCommandsToolsService
  ) {}

  async process(ctx, defaultHandler?: () => Promise<unknown>) {
    const telegramUserId =
      ctx.update?.message?.chat?.id || ctx?.update?.message?.from?.id;

    const dbLocale = telegramUserId
      ? await this.languageSwitherStorage.getLanguageOfUser(telegramUserId)
      : null;

    const locale =
      dbLocale ||
      (ctx.update?.message?.chat?.id < 0
        ? DEFAULT_LANGUAGE
        : this.botCommandsToolsService.getLocale(
            ctx?.update?.message,
            DEFAULT_LANGUAGE
          ));

    const botName = this.botCommandsConfig.botNames[locale][0];

    if (ctx.update?.message?.from?.language_code) {
      ctx.update.message.from.language_code = locale;
    }

    if (ctx.update?.message?.chat?.id > 0) {
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    if (ctx?.update?.message) {
      if (!ctx.update.message.botContext) {
        ctx.update.message.botContext = {};
      }
      ctx.update.message.botContext[DISABLE_FIRST_MEETING_COMMANDS] = true;
      ctx.update.message.botContext[DISABLE_SHORT_COMMANDS__BEFORE_HOOK] = true;
      if (ctx.update.message.text) {
        const shortCommand =
          this.shortCommandsToolsService.updateTextWithShortCommands(
            locale,
            this.botCommandsToolsService.clearCommands(
              ctx.update.message.text,
              this.botCommandsConfig.botNames[locale],
              locale
            )
          );
        if (
          this.botCommandsToolsService.checkCommands(
            ctx.update.message.text,
            this.botCommandsConfig.botNames[locale],
            locale
          )
        ) {
          ctx.update.message.text = `${botName} ${shortCommand}`;
        } else {
          ctx.update.message.text = shortCommand;
        }
      }
    }

    const admins = await ctx.getChatAdministrators();
    const botIsAdmin =
      admins.filter((admin) => admin.user.id === ctx.botInfo.id).length > 0;

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.new_chat_member?.id === ctx.botInfo.id
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botMeetingInformation[locale]
        )
      );
      if (!botIsAdmin) {
        await ctx.reply(
          this.botCommandsToolsService.getRandomItem(
            this.botCommandsConfig.botDoNotHaveFullAccess[locale]
          )
        );
      }
      return;
    }

    if (
      ctx.update.my_chat_member?.chat?.id < 0 &&
      ctx.update.my_chat_member?.old_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.old_chat_member.status === 'left' &&
      ctx.update.my_chat_member?.new_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.new_chat_member.status === 'administrator'
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botNowHaveFullAccess[locale]
        )
      );
      return;
    }

    if (
      ctx.update.my_chat_member?.chat?.id < 0 &&
      ctx.update.my_chat_member?.old_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.old_chat_member.status === 'member' &&
      ctx.update.my_chat_member?.new_chat_member.user.id === ctx.botInfo.id &&
      ctx.update.my_chat_member?.new_chat_member.status === 'administrator'
    ) {
      await ctx.reply(
        this.botCommandsToolsService.getRandomItem(
          this.botCommandsConfig.botNowHaveFullAccess[locale]
        )
      );
      return;
    }

    if (
      ctx.update?.message?.chat?.id < 0 &&
      ctx.update?.message?.reply_to_message?.from?.id === ctx.botInfo.id
    ) {
      ctx.update.message.text = `${botName} ${ctx.update.message.text}`;
      await this.botCommandsService.process(ctx, defaultHandler);
      return;
    }

    if (botIsAdmin) {
      await this.botCommandsService.process(ctx, defaultHandler);
    }
  }
}
```

### Create module

_libs/bot-in-groups/server/src/lib/bot-in-groups.module.ts_

```ts
import {
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { LanguageSwitherModule } from '@kaufman-bot/language-swither/server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from './bot-in-groups-config/bot-in-groups.config';
import { BotInGroupsProcessorService } from './bot-in-groups-services/bot-in-groups-processor.service';
import { BotInGroupsService } from './bot-in-groups-services/bot-in-groups.service';

@Module({
  imports: [
    TranslatesModule,
    BotCommandsModule,
    LanguageSwitherModule,
    ShortCommandsModule,
  ],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    LanguageSwitherModule,
    ShortCommandsModule,
  ],
})
export class BotInGroupsModule {
  static forRoot(
    config: Pick<
      BotInGroupsConfig,
      | 'botNames'
      | 'botMeetingInformation'
      | 'botDoNotHaveFullAccess'
      | 'botNowHaveFullAccess'
    >
  ): DynamicModule {
    return {
      module: BotInGroupsModule,
      providers: [
        {
          provide: BOT_IN_GROUPS_CONFIG,
          useValue: <BotInGroupsConfig>{
            ...config,
            title: getText('Bot in groups'),
            name: 'groups',
            descriptions: getText(
              'Commands for support work the bot in groups'
            ),
            usage: [getText('groups help'), getText('groups meet')],
            spyWords: [getText('groups')],
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: BotInGroupsService,
        },
        BotInGroupsProcessorService,
      ],
      exports: [BotInGroupsProcessorService],
    };
  }
}
```

### Prepare all files

> npm run generate

### Update translates

![Update translates](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ty20o9asiue3xhelgy6g.png)

## Update application

### Update app service

_apps/server/src/app/app.service.ts_

```ts
import { BotInGroupsProcessorService } from '@kaufman-bot/bot-in-groups/server';
import { BotCommandsService } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly botCommandsService: BotCommandsService,
    private readonly botInGroupsProcessorService: BotInGroupsProcessorService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botCommandsService.start(ctx);
  }

  @Use()
  async use(ctx) {
    try {
      await this.botInGroupsProcessorService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  @On('sticker')
  async onSticker(ctx) {
    try {
      await this.botCommandsService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  @On('text')
  async onMessage(ctx) {
    try {
      await this.botCommandsService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
```

### Update app module

_apps/server/src/app/app.module.ts_

```ts
import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups/server';
import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DialogflowModule } from '@kaufman-bot/dialogflow/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { FirstMeetingModule } from '@kaufman-bot/first-meeting/server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator/server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'getText'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    DebugMessagesModule.forRoot(),
    BotCommandsModule.forRoot({
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
    }),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          '*joke*': `get jokes`,
          '*quote*|*thought*|*wisdom*': 'get quotes',
          '*fact*|history': 'get facts',
          'forgot me': 'meet reset',
          '*what you can do*|faq': 'help',
          'disable debug': 'debug off',
          'enable debug': 'debug on',
        },
        ru: {
          '*joke*|*шутка|*шутку|*шутки|пошути*|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          '*quote*|*thought|*wisdom*|цитата|дай цитату|цитируй|*мысль|*мудрость|*залечи*':
            'get quotes',
          '*fact*|history|история|*историю|*факты': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          '*what you can do*|faq|*что ты умеешь*|справка': 'help',
          'disable debug|выключи дебаг': 'debug off',
          'enable debug|включи дебаг': 'debug on',
        },
      },
    }),
    BotInGroupsModule.forRoot({
      botNames: {
        en: ['Endy', 'Kaufman'],
        ru: ['Энди', 'Endy', 'Kaufman', 'Енди', 'Кауфман'],
      },
      botMeetingInformation: {
        en: [`Hello! I'm Endy 😉`, 'Hello!', 'Hello 🖖'],
        ru: [`Всем привет! я Энди 😉`, `Всем привет!`, 'Всем привет 🖖'],
      },
      botDoNotHaveFullAccess: {
        en: [
          `I not have access to read messages and process your commands 😢, please give me access 😉`,
        ],
        ru: [
          `У меня нет доступа на чтение ваших сообщений и обработку команд 😢, пожалуйста дайте мне доступ 😉`,
        ],
      },
      botNowHaveFullAccess: {
        en: [`Now I have access, thanks 😉`],
        ru: [`Теперь у меня есть доступ, спасибо 😉`],
      },
    }),
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({ botName: { en: 'Endy', ru: 'Энди' } }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Check new logic in telegram bot

### Create new group

![Create new group](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mym29l6veumd2jhdcs25.png)

### Append bot as basic user

![Append bot as basic user](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hw9vjtbbvnr2b6d7opxe.png)

### After append a bot, he don't have access to read message

![After append a bot, he don't have access to read message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yico31bnrs2i3ms894tl.png)

### Try get jokes without full access

![Try get jokes without full access](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/svunbl5hed5q30xd2d65.png)

### Add full access for give access to read messages

![Add full access for give access to read messages](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w8h24858tw4kuyqroj7h.png)

### Try get jokes with full access

![Try get jokes with full access](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ljtxvemetdrmthzbv3n5.png)

### Work with Russian language

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/to8ybg0pdsfwzngfjl60.png)

In next post I append a support to work telegram bot over web hook for speed up create answer to user in Telegram bot on NestJS...

#kaufmanbot #nestjs #telegram #groups

# [2022-04-12 21:02] Append a support to work telegram bot over web hook for speed up create answer to user in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Update files in project

### Update env file

_.env.local_

```sh
TELEGRAM_BOT_TOKEN=1111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
TELEGRAM_BOT_WEB_HOOKS_DOMAIN=
TELEGRAM_BOT_WEB_HOOKS_PATH=
ROOT_POSTGRES_USER=postgres
ROOT_POSTGRES_PASSWORD=postgres
ROOT_POSTGRES_URL=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@localhost:5432/postgres?schema=public
SERVER_POSTGRES_URL=postgres://admin_develop:password_develop@localhost:5432/kaufman_bot_develop?schema=public
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
DIALOGFLOW_PROJECT_ID=service-account-urui
```

### Update deploy config

_.github/workflows/develop.deploy.yml_

```yml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
          dokku config:set --no-restart kaufman-bot SERVER_POSTGRES_URL=$SERVER_POSTGRES_URL
          dokku config:set --no-restart --global POSTGRES_HOST=global-postgres
          dokku config:set --no-restart kaufman-bot GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
          dokku config:set --no-restart kaufman-bot GOOGLE_CREDENTIALS=${{secrets.GOOGLE_CREDENTIALS}}
          dokku config:set --no-restart kaufman-bot DIALOGFLOW_PROJECT_ID=${{secrets.DIALOGFLOW_PROJECT_ID}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_DOMAIN=${{secrets.TELEGRAM_BOT_WEB_HOOKS_DOMAIN}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_PATH=${{secrets.TELEGRAM_BOT_WEB_HOOKS_PATH}}

  deploy:
    needs: [migrate]
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

### Update add module

_apps/server/src/app/app.module.ts_

```ts

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
    }),
...
```

### Update main file

_apps/server/src/main.ts_

```ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import env from 'env-var';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app/app.module';

const logger = new Logger('Application');

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const TELEGRAM_BOT_WEB_HOOKS_PATH = env
    .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
    .asString();
  if (TELEGRAM_BOT_WEB_HOOKS_PATH) {
    const bot = app.get(getBotToken());
    app.use(bot.webhookCallback(TELEGRAM_BOT_WEB_HOOKS_PATH));
  }

  const port = env.get('PORT').default(3333).asPortNumber();
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
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
      logger.log(`exit: code - ${exitCode}`);
    } else {
      logger.log(`exit: code - ${exitCode}`);
    }
  }
  if (options.exit) {
    process.exit();
  }
}
```

## Append new env on github actions

Add domain

```sh
TELEGRAM_BOT_WEB_HOOKS_DOMAIN=kaufman-bot.site15.ru
```

![Add domain](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hjf3ffihax58lf6vcqig.png)

Add hook path

```sh
TELEGRAM_BOT_WEB_HOOKS_PATH=/webhook
```

![Add hook path](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pzfcnidl6tvrjuhokuaa.png)

List all env
![List all env](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/174ct9owox0cepjc7vt5.png)

## Setup domain in telegram @BotFather

![Setup domain in telegram @BotFather](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z5qjr6l2aetcinxtn0pg.png)

In the next post, I will hide system commands from all users and show them only to bot admins, and append bot descriptions...

#kaufmanbot #nestjs #telegram #webhook

# [2022-04-12 22:54] How to receive messages in group chats using telegram bot app without full access in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Disable privacy mode

Sequence within a BotFather chat:

You: /setprivacy

BotFather: Choose a bot to change group messages settings.

You: @your_name_bot

BotFather: 'Enable' - your bot will only receive messages that either start with the '/' symbol or mention the bot by username.

'Disable' - your bot will receive all messages that people send to groups.

Current status is: ENABLED

You: Disable

BotFather: Success! The new status is: DISABLED. /help

![Disable privacy mode](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/21v5kzgamzd4sf5hczhy.png)

#kaufmanbot #nestjs #telegram #groups

# [2022-04-13 14:01] Append "botinfo" command for look deploy, server and user information in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Update files

### Update config

_libs/core/server/src/lib/bot-commands/bot-commands-config/bot-commands.config.ts_

```ts
export const BOT_COMMANDS_CONFIG = Symbol('BOT_COMMANDS_CONFIG');

export interface BotCommandsConfig {
  admins: string[];
  version: string;
  commit: string;
  date: string;
  maxRecursiveDepth?: number;
  prepareCommandString?: (command: string) => string;
}
```

### Add service

_libs/core/server/src/lib/bot-commands/bot-commands-services/bot-commands-botinfo.service.ts_

```ts
import { Inject, Injectable } from '@nestjs/common';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
import { BotCommandsProviderActionResultType } from '../bot-commands-types/bot-commands-provider-action-result-type';
import {
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
} from '../bot-commands-types/bot-commands-provider.interface';
import { BotCommandsToolsService } from './bot-commands-tools.service';

@Injectable()
export class BotCommandsBotinfoService implements BotCommandsProvider {
  constructor(
    @Inject(BOT_COMMANDS_CONFIG)
    private readonly botCommandsConfig: BotCommandsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onHelp() {
    return null;
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (
      this.botCommandsToolsService.checkCommands(msg.text, ['botinfo'], 'en')
    ) {
      const formatMemoryUsage = (data) =>
        `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

      const memoryData = process.memoryUsage();

      const markdown = [
        ...(this.botCommandsToolsService.isAdmin(msg)
          ? [
              '__Server__',
              `RSS: _${formatMemoryUsage(memoryData.rss)}_`,
              `Heap total: _${formatMemoryUsage(memoryData.heapTotal)}_`,
              `Heap used: _${formatMemoryUsage(memoryData.heapUsed)}_`,
              `V8 external: _${formatMemoryUsage(memoryData.external)}_\n`,
            ]
          : []),
        `__Bot__`,
        `Version: _${this.botCommandsConfig.version || 'unknown'}_`,
        `Date: _${this.botCommandsConfig.date || 'unknown'}_`,
        `Commit: _${this.botCommandsConfig.commit || 'unknown'}_\n`,
        '__Chat__',
        `ID: _${msg?.chat?.id || msg?.from?.id || 'unknown'}_`,
      ]
        .join('\n')
        .split('.')
        .join('\\.')
        .split('-')
        .join('\\-');
      return {
        type: 'markdown',
        message: msg,
        markdown: markdown,
      };
    }
    return null;
  }
}
```

### Update module

_libs/core/server/src/lib/bot-commands/bot-commands.module.ts_

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from './bot-commands-config/bot-commands.config';
import { BotCommandsBotinfoService } from './bot-commands-services/bot-commands-botinfo.service';
import { BotCommandsToolsService } from './bot-commands-services/bot-commands-tools.service';
import { BotCommandsService } from './bot-commands-services/bot-commands.service';
import { BOT_COMMANDS_PROVIDER } from './bot-commands-types/bot-commands-provider.interface';

@Module({
  imports: [CustomInjectorModule, TranslatesModule],
  providers: [BotCommandsToolsService, BotCommandsService],
  exports: [
    CustomInjectorModule,
    TranslatesModule,
    BotCommandsToolsService,
    BotCommandsService,
  ],
})
export class BotCommandsModule {
  static forRoot(config?: BotCommandsConfig): DynamicModule {
    return {
      module: BotCommandsModule,
      providers: [
        {
          provide: BOT_COMMANDS_CONFIG,
          useValue: <BotCommandsConfig>{
            maxRecursiveDepth: 5,
            ...(config || {}),
          },
        },
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: BotCommandsBotinfoService,
        },
      ],
      exports: [BOT_COMMANDS_CONFIG],
    };
  }
}
```

### Update app module

_apps/server/src/app/app.module.ts_

```ts
import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups/server';
import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DialogflowModule } from '@kaufman-bot/dialogflow/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { FirstMeetingModule } from '@kaufman-bot/first-meeting/server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator/server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'getText'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    DebugMessagesModule.forRoot(),
    BotCommandsModule.forRoot({
      admins: env.get('TELEGRAM_BOT_ADMINS').default('').asArray(','),
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
      commit: env.get('DEPLOY_COMMIT').default('').asString(),
      date: env.get('DEPLOY_DATE').default('').asString(),
      version: env.get('DEPLOY_VERSION').default('').asString(),
    }),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          '*joke*': `get jokes`,
          '*quote*|*thought*|*wisdom*': 'get quotes',
          '*fact*|history': 'get facts',
          'forgot me': 'meet reset',
          '*what you can do*|faq': 'help',
          'disable debug': 'debug off',
          'enable debug': 'debug on',
        },
        ru: {
          '*joke*|*шутка|*шутку|*шутки|пошути*|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          '*quote*|*thought|*wisdom*|цитата|дай цитату|цитируй|*мысль|*мудрость|*залечи*':
            'get quotes',
          '*fact*|history|история|*историю|*факты': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          '*what you can do*|faq|*что ты умеешь*|справка': 'help',
          'disable debug|выключи дебаг': 'debug off',
          'enable debug|включи дебаг': 'debug on',
        },
      },
    }),
    BotInGroupsModule.forRoot({
      botNames: {
        en: ['Endy', 'Kaufman'],
        ru: ['Энди', 'Endy', 'Kaufman', 'Енди', 'Кауфман'],
      },
      botMeetingInformation: {
        en: [`Hello! I'm Endy 😉`, 'Hello!', 'Hello 🖖'],
        ru: [`Всем привет! я Энди 😉`, `Всем привет!`, 'Всем привет 🖖'],
      },
    }),
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({ botName: { en: 'Endy', ru: 'Энди' } }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Update deploy script

_.github/workflows/develop.deploy.yml_

```ts
name: "deploy"

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
          export DEPLOY_DATE=$(date +'%Y.%m.%d %H:%M:%S')
          export DEPLOY_COMMIT=$GITHUB_SHA
          export DEPLOY_VERSION=$(node -pe "require('./package.json')['version']")
          dokku config:set --no-restart kaufman-bot SERVER_POSTGRES_URL=$SERVER_POSTGRES_URL
          dokku config:set --no-restart --global POSTGRES_HOST=global-postgres
          dokku config:set --no-restart kaufman-bot GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
          dokku config:set --no-restart kaufman-bot GOOGLE_CREDENTIALS=${{secrets.GOOGLE_CREDENTIALS}}
          dokku config:set --no-restart kaufman-bot DIALOGFLOW_PROJECT_ID=${{secrets.DIALOGFLOW_PROJECT_ID}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_DOMAIN=${{secrets.TELEGRAM_BOT_WEB_HOOKS_DOMAIN}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_PATH=${{secrets.TELEGRAM_BOT_WEB_HOOKS_PATH}}
          dokku config:set --no-restart kaufman-bot DEPLOY_DATE="$DEPLOY_DATE"
          dokku config:set --no-restart kaufman-bot DEPLOY_COMMIT=$DEPLOY_COMMIT
          dokku config:set --no-restart kaufman-bot DEPLOY_VERSION=$DEPLOY_VERSION

  deploy:
    needs: [migrate]
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
          branch: "feature/73"
          git_remote_url: "ssh://dokku@${{secrets.HOST}}:22/kaufman-bot"
          ssh_private_key: ${{secrets.SSH_PRIVATE_KEY}}

```

## Check from telegram

### Check from user chat

![Check from user chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/09ol2kegqr4zrdx3x229.png)

### Check from group chat

![Check from group chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ov1p8nvo5zg68fow1ly3.png)

#kaufmanbot #nestjs #telegram #botinfo

# [2022-04-13 17:33] Hide system commands from users and add bot description to Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Add category property and usage with admins

### Append admin property to bot command config

_libs/core/server/src/lib/bot-commands/bot-commands-config/bot-commands.config.ts_

```ts
export const BOT_COMMANDS_CONFIG = Symbol('BOT_COMMANDS_CONFIG');

export interface BotCommandsConfig {
  admins: string[];
  maxRecursiveDepth?: number;
  prepareCommandString?: (command: string) => string;
}
```

### Append enum for basic types

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-enum.ts_

```ts
import { getText } from 'class-validator-multi-lang';

export const BotCommandsEnum = {
  help: getText('help'),
  get: getText('get'),
  state: getText('state'),
  reset: getText('reset'),
};

export const BotCommandsCategory = {
  system: getText('system'),
  user: getText('user'),
};
```

### Append category property to help message interface

_libs/core/server/src/lib/bot-commands/bot-commands-types/bot-commands-tools-types.interface.ts_

```ts
export interface BotCommandsToolsGenerateHelpMessageOptions {
  locale: string;
  name: string;
  descriptions: string;
  usage: string[];
  contextUsage?: string[];
  customHelpFields?: { [field: string]: string[] };
  category: string;
}
```

### Update bot command tools service

_libs/core/server/src/lib/bot-commands/bot-commands-services/bot-commands-tools.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { isMatch } from 'micromatch';
import { render } from 'mustache';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  BotCommandsConfig,
  BOT_COMMANDS_CONFIG,
} from '../bot-commands-config/bot-commands.config';
import { BotCommandsCategory } from '../bot-commands-types/bot-commands-enum';
import { BotCommandsProviderActionMsg } from '../bot-commands-types/bot-commands-provider.interface';
import {
  BotCommandsToolsInterceptor,
  BOT_COMMANDS_TOOLS_INTERCEPTOR,
} from '../bot-commands-types/bot-commands-tools-interceptor.interface';
import { BotCommandsToolsGenerateHelpMessageOptions } from '../bot-commands-types/bot-commands-tools-types.interface';

@Injectable()
export class BotCommandsToolsService {
  @CustomInject(BOT_COMMANDS_TOOLS_INTERCEPTOR, {
    multi: true,
  })
  private botCommandsToolsInterceptors?: BotCommandsToolsInterceptor[];

  @CustomInject(BOT_COMMANDS_CONFIG)
  private botCommandsConfig?: BotCommandsConfig;

  private lowerCaseTranslates?: TranslatesStorage['translates'];

  constructor(
    private readonly translatesStorage: TranslatesStorage,
    private readonly translatesService: TranslatesService
  ) {}

  isAdmin<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg) {
    const admins =
      this.botCommandsConfig?.admins.map((admin) =>
        String(admin).trim().toLocaleLowerCase()
      ) || [];
    return (
      admins.includes(msg?.chat?.id.toString() || '') ||
      admins.includes(msg?.from?.id.toString() || '')
    );
  }

  generateHelpMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, options: BotCommandsToolsGenerateHelpMessageOptions) {
    const isAdmin = this.isAdmin(msg);

    if (options.category === BotCommandsCategory.system && !isAdmin) {
      return '';
    }

    if (
      this.botCommandsToolsInterceptors &&
      this.botCommandsToolsInterceptors.length > 0
    ) {
      for (
        let index = 0;
        index < this.botCommandsToolsInterceptors.length;
        index++
      ) {
        const botCommandsToolsInterceptor =
          this.botCommandsToolsInterceptors[index];
        if (botCommandsToolsInterceptor?.interceptHelpMessageOptions) {
          options =
            botCommandsToolsInterceptor.interceptHelpMessageOptions(options);
        }
      }
    }
    const usageWithLocalized = Array.from(
      new Set(
        [
          ...options.usage,
          ...options.usage.map((u) =>
            this.translatesService.translate(u, options.locale)
          ),
        ].filter(Boolean)
      )
    );
    const contextUsageWithLocalized = options.contextUsage
      ? Array.from(
          new Set(
            [
              ...options.contextUsage,
              ...options.contextUsage.map((u) =>
                this.translatesService.translate(u, options.locale)
              ),
            ].filter(Boolean)
          )
        )
      : null;

    const caption = options.name
      ? `__${this.translatesService.translate(options.name, options.locale)}${
          !isAdmin && options.category === BotCommandsCategory.user
            ? ''
            : ` \\(${this.translatesService.translate(
                options.category,
                options.locale
              )}\\)`
        }__`
      : '';
    const descriptions = options.descriptions
      ? this.translatesService.translate(options.descriptions, options.locale)
      : '';
    const usage =
      usageWithLocalized.length > 0
        ? `${this.translatesService.translate(
            getText('usage'),
            options.locale
          )}: ${usageWithLocalized.map((u) => `_${u}_`).join(', ')}`
        : '';
    const contextUsage =
      contextUsageWithLocalized && contextUsageWithLocalized.length > 0
        ? `${this.translatesService.translate(
            getText('usage with context'),
            options.locale
          )}: ${contextUsageWithLocalized.map((u) => `_${u}_`).join(', ')}`
        : '';
    const customHelpFields = Object.keys(options.customHelpFields || {}).map(
      (customHelpFieldKey) =>
        `${this.translatesService.translate(
          customHelpFieldKey,
          options.locale
        )}: ${(options.customHelpFields?.[customHelpFieldKey] || [])
          .map((u) => `_${u}_`)
          .join(', ')}`
    );

    const replayHelpMessage = [
      caption,
      descriptions,
      usage,
      contextUsage,
      ...customHelpFields,
    ]
      .filter(Boolean)
      .join('\n');
    return replayHelpMessage;
  }

  clearCommands(text: string | undefined, commands: string[], locale: string) {
    const words = (text || '').split(' ');
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
    return words.join(' ').split('  ').join(' ').trim();
  }

  checkCommands(text: string | undefined, commands: string[], locale?: string) {
    const lowerCasedText = this.prepareCommandString(
      (text || '').toLocaleLowerCase()
    );
    const lowerCasedCommands = commands
      .map((c) => this.prepareCommandString(c).toLocaleLowerCase().split('|'))
      .reduce((acc, val) => acc.concat(val), []);
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
          lowerCasedText.includes(
            this.prepareCommandString(
              this.translateByLowerCase(command, locale)
            )
          ) ||
          lowerCasedText.includes(
            `/${this.prepareCommandString(
              this.translateByLowerCase(command, locale)
            )}`
          )
      )
    ) {
      return true;
    }
    return false;
  }

  checkMicromatchCommands(text: string | undefined, commands: string[]) {
    const lowerCasedText = this.prepareCommandString(
      (text || '').toLocaleLowerCase()
    );
    const lowerCasedCommands = commands
      .map((c) => this.prepareCommandString(c.toLocaleLowerCase()).split('|'))
      .reduce((acc, val) => acc.concat(val), []);
    if (
      lowerCasedCommands.find((command) =>
        isMatch(lowerCasedText, `${command}`)
      )
    ) {
      return true;
    }
    return false;
  }

  prepareHelpString(text: string | undefined) {
    return (text || '').split('*').join('\\*');
  }

  getRandomItem<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)];
  }

  capitalizeFirstLetter(text: string | undefined, locale: string) {
    const [first, ...rest] = (text || '').trim();
    return (first || '').toLocaleUpperCase(locale) + rest.join('');
  }

  getLocale<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, defaultValue: string) {
    let locale = msg?.from?.language_code;
    if (
      !locale ||
      !Object.keys(this.translatesStorage.translates).find((key) =>
        locale?.includes(key)
      )
    ) {
      locale = defaultValue;
    }
    return locale;
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

  private prepareCommandString(command: string): string {
    if (this.botCommandsConfig?.prepareCommandString) {
      return this.botCommandsConfig.prepareCommandString(command);
    }
    return command || '';
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
}
```

### Append category property to all commands as example of quotes

_libs/quotes-generator/server/src/lib/quotes-generator.module.ts_

```ts
import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { ScraperModule } from '@kaufman-bot/html-scraper/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import { QuotesGeneratorService } from './quotes-generator-services/quotes-generator.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  exports: [TranslatesModule, BotCommandsModule],
})
export class QuotesGeneratorModule {
  static forRoot(): DynamicModule {
    return {
      module: QuotesGeneratorModule,
      imports: [
        ScraperModule.forRoot({
          title: getText('Quotes generator'),
          name: 'quotes',
          descriptions: getText(
            'Command to generate text with a random quotes'
          ),
          usage: [
            getText('get quote'),
            getText('get quotes'),
            getText('quotes help'),
          ],
          contextUsage: [getText('more'), getText('next')],
          contentSelector:
            'forismatic > quote > quotetext, forismatic > quote > quoteauthor',
          spyWords: [getText('quotes'), getText('quote')],
          removeWords: [getText('get'), getText('please')],
          uri: 'https://api.forismatic.com/api/1.0/?method=getQuote&format=xml&lang={{locale}}',
          contentCodepage: 'utf8',
          headers: [{}],
          category: BotCommandsCategory.user,
        }),
      ],
      providers: [
        {
          provide: BOT_COMMANDS_PROVIDER,
          useClass: QuotesGeneratorService,
        },
      ],
      exports: [ScraperModule],
    };
  }
}
```

![Append category property to all commands as example of quotes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jl3w1rthkt55t0h38ukb.png)

### Update app module for use admin from envs

_apps/server/src/app/app.module.ts_

```ts
import { BotInGroupsModule } from '@kaufman-bot/bot-in-groups/server';
import {
  BotCommandsModule,
  PrismaClientModule,
} from '@kaufman-bot/core/server';
import { CurrencyConverterModule } from '@kaufman-bot/currency-converter/server';
import { DebugMessagesModule } from '@kaufman-bot/debug-messages/server';
import { DialogflowModule } from '@kaufman-bot/dialogflow/server';
import { FactsGeneratorModule } from '@kaufman-bot/facts-generator/server';
import { FirstMeetingModule } from '@kaufman-bot/first-meeting/server';
import { JokesGeneratorModule } from '@kaufman-bot/jokes-generator/server';
import {
  DEFAULT_LANGUAGE,
  LanguageSwitherModule,
} from '@kaufman-bot/language-swither/server';
import { QuotesGeneratorModule } from '@kaufman-bot/quotes-generator/server';
import { ShortCommandsModule } from '@kaufman-bot/short-commands/server';
import { Module } from '@nestjs/common';
import env from 'env-var';
import { TelegrafModule } from 'nestjs-telegraf';
import {
  getDefaultTranslatesModuleOptions,
  TranslatesModule,
} from 'nestjs-translates';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    TranslatesModule.forRoot(
      getDefaultTranslatesModuleOptions({
        localePaths: [
          join(__dirname, 'assets', 'i18n'),
          join(__dirname, 'assets', 'i18n', 'getText'),
          join(__dirname, 'assets', 'i18n', 'class-validator-messages'),
        ],
        vendorLocalePaths: [join(__dirname, 'assets', 'i18n')],
        locales: [DEFAULT_LANGUAGE, 'ru'],
      })
    ),
    DebugMessagesModule.forRoot(),
    BotCommandsModule.forRoot({
      admins: env.get('TELEGRAM_BOT_ADMINS').default('').asArray(','),
      prepareCommandString: (command?: string) =>
        (command || '').split('ё').join('е'),
    }),
    ShortCommandsModule.forRoot({
      commands: {
        en: {
          '*joke*': `get jokes`,
          '*quote*|*thought*|*wisdom*': 'get quotes',
          '*fact*|history': 'get facts',
          'forgot me': 'meet reset',
          '*what you can do*|faq': 'help',
          'disable debug': 'debug off',
          'enable debug': 'debug on',
        },
        ru: {
          '*joke*|*шутка|*шутку|*шутки|пошути*|шути|рассмеши|смешинки|смешинка':
            'get jokes',
          '*quote*|*thought|*wisdom*|цитата|дай цитату|цитируй|*мысль|*мудрость|*залечи*':
            'get quotes',
          '*fact*|history|история|*историю|*факты': 'get facts',
          'forgot me|забудь меня': 'meet reset',
          '*what you can do*|faq|*что ты умеешь*|справка': 'help',
          'disable debug|выключи дебаг': 'debug off',
          'enable debug|включи дебаг': 'debug on',
        },
      },
    }),
    BotInGroupsModule.forRoot({
      botNames: {
        en: ['Endy', 'Kaufman'],
        ru: ['Энди', 'Endy', 'Kaufman', 'Енди', 'Кауфман'],
      },
      botMeetingInformation: {
        en: [`Hello! I'm Endy 😉`, 'Hello!', 'Hello 🖖'],
        ru: [`Всем привет! я Энди 😉`, `Всем привет!`, 'Всем привет 🖖'],
      },
    }),
    LanguageSwitherModule.forRoot(),
    CurrencyConverterModule.forRoot(),
    FactsGeneratorModule.forRoot(),
    QuotesGeneratorModule.forRoot(),
    JokesGeneratorModule.forRoot(),
    FirstMeetingModule.forRoot({ botName: { en: 'Endy', ru: 'Энди' } }),
    DialogflowModule.forRoot({
      projectId: env.get('DIALOGFLOW_PROJECT_ID').required().asString(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Append TELEGRAM_BOT_ADMINS to env file

_.env.local_

```ts
TELEGRAM_BOT_TOKEN=1111111:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
TELEGRAM_BOT_WEB_HOOKS_DOMAIN=kaufman-bot.site15.ru
TELEGRAM_BOT_WEB_HOOKS_PATH=/webhook
TELEGRAM_BOT_ADMINS=102375526
ROOT_POSTGRES_USER=postgres
ROOT_POSTGRES_PASSWORD=postgres
ROOT_POSTGRES_URL=postgres://${ROOT_POSTGRES_USER}:${ROOT_POSTGRES_PASSWORD}@localhost:5432/postgres?schema=public
SERVER_POSTGRES_URL=postgres://admin_develop:password_develop@localhost:5432/kaufman_bot_develop?schema=public
GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
DIALOGFLOW_PROJECT_ID=service-account-urui
```

### Prepare files and translate dictionaries

> npm run generate

### Translate all need words

![Translate all need words](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/812wdl5a3ir5kte7k5av.png)

### Convert po translate dictionaries files to json

> npm run generate

### Commit changes, wait end of deploy, for test without admin role

![Commit changes, wait end of deploy, for test without admin role](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/aqo9vkbjdprzm2vm5p3j.png)

### Check from telegram, we must see only user commands

![Check from telegram, we must see only user commands](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mgerpfhwjb72rcwxxqyj.png)

### Append description of bot with @BotFather

Show bot info
![Show bot info](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mt11tacyo98c1i5pqgoo.png)

![Show bot info 2](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kx0r7edmfs1eayg3em3z.png)

Set description

```sh
Currency converter
convert 1 usd to eur, converter help

Facts generator
get facts, get fact, facts help

Quotes generator
get quote, get quotes, quotes help

Jokes generator
get joke, get jokes, jokes help
```

![Set description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4b8ebhfk06sd9ujktbup.png)

Result
![Set description result](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/smplmfjo9k263xj8nmjq.png)

Set about text
![Set about text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/in69l9d64gcyypbl3vr0.png)

Result
![Set about text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0mu6l1jb3h60i5xbxcjb.png)

Set avatar
![Set avatar](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wpymk6oozqwo2x45f7xl.png)

### Check from telegram

First open bot
![First open bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/39e9j5ykm6hcooafd70q.png)

Show bot info
![Show bot info](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xonwhtwon063n9mq8emo.png)

Send help commands
![Send help commands](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gm5h4onz5cnmbc7ymzr2.png)

## Add admin id to env

### Get your id

![Get your id](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ke8ofsmkqouusa8k1bk8.png)

### Append env with this id to github settings

![Append env with this id to github settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h91n5a3idh6u3kjyca1a.png)

### Update deploy config

_.github/workflows/develop.deploy.yml_

```yml
name: 'deploy'

# yamllint disable-line rule:truthy
on:
  push:
    branches:
      - feature/73

jobs:
  migrate:
    runs-on: [self-hosted, develop-vps]
    environment: dev
    steps:
      - name: Cloning repo
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Apply migrations
        run: |
          curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
          . ~/.nvm/nvm.sh
          nvm --version
          nvm install v16.13.2
          nvm use v16.13.2
          npm i --force
          export POSTGRES_HOST=$(dokku postgres:info global-postgres --internal-ip)
          export ROOT_POSTGRES_URL=postgres://postgres:${{secrets.ROOT_POSTGRES_PASSWORD}}@${POSTGRES_HOST}:5432/postgres?schema=public
          export SERVER_POSTGRES_URL=${{secrets.SERVER_POSTGRES_URL}}
          npm run rucken -- postgres
          export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate
          export DEPLOY_DATE=$(date +'%Y.%m.%d %H:%M:%S')
          export DEPLOY_COMMIT=$GITHUB_SHA
          export DEPLOY_VERSION=$(node -pe "require('./package.json')['version']")
          dokku config:set --no-restart kaufman-bot SERVER_POSTGRES_URL=$SERVER_POSTGRES_URL
          dokku config:set --no-restart --global POSTGRES_HOST=global-postgres
          dokku config:set --no-restart kaufman-bot GOOGLE_APPLICATION_CREDENTIALS=google-credentials.json
          dokku config:set --no-restart kaufman-bot GOOGLE_CREDENTIALS=${{secrets.GOOGLE_CREDENTIALS}}
          dokku config:set --no-restart kaufman-bot DIALOGFLOW_PROJECT_ID=${{secrets.DIALOGFLOW_PROJECT_ID}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_DOMAIN=${{secrets.TELEGRAM_BOT_WEB_HOOKS_DOMAIN}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_WEB_HOOKS_PATH=${{secrets.TELEGRAM_BOT_WEB_HOOKS_PATH}}
          dokku config:set --no-restart kaufman-bot TELEGRAM_BOT_ADMINS=${{secrets.TELEGRAM_BOT_ADMINS}}
          dokku config:set --no-restart kaufman-bot DEPLOY_DATE="$DEPLOY_DATE"
          dokku config:set --no-restart kaufman-bot DEPLOY_COMMIT=$DEPLOY_COMMIT
          dokku config:set --no-restart kaufman-bot DEPLOY_VERSION=$DEPLOY_VERSION

  deploy:
    needs: [migrate]
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

## Check new logic in telegram bot

### Show botinfo in personal user chat

![Show botinfo in personal user chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qlzvytfpyi3j79bjab5t.png)

### Show botinfo in groups chat

![Show botinfo in groups chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sfcw3otq1p72n22ofnqm.png)

### Show help in personal chat

![Show help in personal chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sbkyckki58tvax8iljqn.png)

### Show help in groups chat

![Show help in groups chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4p7qhceuxvgp8bmx59kr.png)

In next post I append semver and create changelog with released features and fixes, and maybe I close issue https://github.com/EndyKaufman/kaufman-bot/issues/73...

#kaufmanbot #nestjs #telegram #description

# [2022-04-13 18:54] Append standard-version and create changelog with released features and fixes in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Install devDependencies

> npm i --save-dev cp-cli standard-version

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm i --save-dev cp-cli standard-version

added 181 packages, and audited 1168 packages in 9s

120 packages are looking for funding
  run `npm fund` for details

13 vulnerabilities (3 moderate, 10 high)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

![Install devDependencies](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w1avf3u1r1a1ko39oowe.png)

## Update files

### Create config for semver

_.versionrc_

```json
{
  "bumpFiles": [
    {
      "filename": "./package.json",
      "type": "json"
    }
  ]
}
```

### Update scripts in package.json

_package.json_

```json
{
  "name": "kaufman-bot",
  "version": "1.4.0-alpha.13",
  "description": "Example of simple bot for telegram",
  "keywords": ["telegram", "telegram-bot", "nestjs", "custom-injector"],
  "license": "MIT",
  "author": "EndyKaufman <admin@site15.ru>",
  "engines": {
    "node": ">=16",
    "npm": ">=7"
  },
  "bugs": {
    "url": "https://github.com/EndyKaufman/kaufman-bot/issues"
  },
  "homepage": "https://github.com/EndyKaufman/kaufman-bot",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/EndyKaufman/kaufman-bot.git"
  },
  "maintainers": [
    {
      "name": "EndyKaufman",
      "email": "admin@site15.ru"
    }
  ],
  "scripts": {
    "rucken": "rucken",
    "nx": "nx",
    "start": "echo $GOOGLE_CREDENTIALS | base64 --decode > ./$GOOGLE_APPLICATION_CREDENTIALS && node dist/apps/server/main.js",
    "build": "npm run nx -- build server",
    "test": "nx test",
    "serve": "npm run nx -- serve server",
    "serve:local": "export $(xargs < ./.env.local) > /dev/null 2>&1 && npm run serve",
    "prepare": "husky install",
    "lint": "npm run tsc:lint && nx workspace-lint && npm run nx -- run-many --target=lint --all",
    "lint:fix": "npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all",
    "tsc:lint": "tsc --noEmit -p tsconfig.base.json",
    "generate": "npm run prisma:generate && npm run rucken -- prepare --locales=en,ru && npm run lint:fix",
    "docker:dev:down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-down.sh",
    "docker:dev:restart": "npm run docker:dev:down && npm run docker:dev:up",
    "docker:dev:up": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-up.sh",
    "docker:dev:clean-down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/dev/docker-compose-clean-down.sh",
    "docker:dev:clean-restart": "npm run docker:dev:clean-down && npm run docker:dev:up",
    "docker:prod:build-sources": "npm run build",
    "docker:prod:down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/prod/docker-compose-down.sh",
    "docker:prod:restart": "npm run docker:prod:down && npm run docker:prod:up",
    "docker:prod:up": "export $(xargs < ./.env.local) > /dev/null 2>&1 && npm run docker:prod:build-sources && ./docker/prod/docker-compose-up.sh",
    "docker:prod:clean-down": "export $(xargs < ./.env.local) > /dev/null 2>&1 && ./docker/prod/docker-compose-clean-down.sh",
    "docker:prod:clean-restart": "npm run docker:prod:clean-down && npm run docker:prod:up",
    "flyway": "flyway -c .flyway.js",
    "migrate": "npm run flyway -- migrate",
    "migrate:local": "export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run migrate",
    "prisma": "prisma",
    "prisma:pull": "npm run -- prisma db pull && npm run prisma:generate",
    "prisma:pull:local": "export $(xargs < ./.env.local) > /dev/null 2>&1 && export DATABASE_URL=$SERVER_POSTGRES_URL && npm run -- prisma db pull && npm run prisma:generate",
    "prisma:generate": "npm run -- prisma generate",
    "postinstall": "npm run generate",
    "app:build": "npm run generate && npm run build && npm run app:build-changelog",
    "app:release": "standard-version",
    "app:create-release": "npm run app:build && npm run app:release && git push --follow-tags origin feature/73",
    "app:build-changelog": "./node_modules/.bin/cp-cli ./CHANGELOG.md ./dist/libs/kaufman-bot/CHANGELOG.md"
  },
  "private": true,
  "devDependencies": {
    "@nestjs/schematics": "^8.0.0",
    "@nestjs/testing": "^8.0.0",
    "@nrwl/cli": "13.8.1",
    "@nrwl/eslint-plugin-nx": "13.8.1",
    "@nrwl/jest": "13.8.1",
    "@nrwl/linter": "13.8.1",
    "@nrwl/nest": "13.8.1",
    "@nrwl/node": "13.8.1",
    "@nrwl/tao": "13.8.1",
    "@nrwl/workspace": "13.8.1",
    "@types/jest": "27.0.2",
    "@types/micromatch": "^4.0.2",
    "@types/mustache": "^4.1.2",
    "@types/node": "14.14.33",
    "@types/uuid": "^8.3.4",
    "@typescript-eslint/eslint-plugin": "~5.10.0",
    "@typescript-eslint/parser": "~5.10.0",
    "cp-cli": "^2.0.0",
    "eslint": "~8.7.0",
    "eslint-config-prettier": "8.1.0",
    "husky": "^7.0.4",
    "jest": "27.2.3",
    "lint-staged": "^12.3.3",
    "node-flywaydb": "^3.0.7",
    "prettier": "2.5.1",
    "prisma": "^3.11.1",
    "rucken": "^3.5.3",
    "standard-version": "^9.3.2",
    "ts-jest": "27.0.5",
    "typescript": "~4.3.5"
  },
  "dependencies": {
    "@google-cloud/dialogflow": "^4.7.0",
    "@nestjs/common": "^8.0.0",
    "@nestjs/core": "^8.0.0",
    "@nestjs/platform-express": "^8.0.0",
    "@prisma/client": "^3.11.1",
    "axios": "^0.26.0",
    "charset": "^1.0.1",
    "cheerio": "^1.0.0-rc.10",
    "class-transformer": "^0.5.1",
    "class-transformer-global-storage": "^0.4.1-1",
    "class-validator-multi-lang": "^0.130.201",
    "connection-string": "^4.3.5",
    "encoding": "^0.1.13",
    "env-var": "^7.1.1",
    "html-to-text": "^8.1.0",
    "jschardet": "^3.0.0",
    "micromatch": "^4.0.5",
    "mustache": "^4.2.0",
    "nestjs-custom-injector": "^1.0.1",
    "nestjs-telegraf": "^2.4.0",
    "nestjs-translates": "^1.0.3",
    "pg": "^8.7.3",
    "pg-promise": "^10.11.1",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.0.0",
    "telegraf": "^4.7.0",
    "tslib": "^2.0.0",
    "uuid": "^8.3.2"
  },
  "lint-staged": {
    "*.{js,ts}": "eslint --fix",
    "*.{js,ts,css,scss,md,yml,yaml,prisma}": "prettier --ignore-unknown --write"
  }
}
```

### Create publish yml

_.github/workflows/publish.yml_

```yml
name: Publish

on:
  push:
    tags:
      - v*

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js 16.x to publish to npmjs.org
        uses: actions/setup-node@v1
        with:
          node-version: '16.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install Packages
        run: npm i --force

      - name: Build
        run: npm run build

      - name: Generate Release Body
        run: npx extract-changelog-release > RELEASE_BODY.md

      - name: Create GitHub Release
        uses: ncipollo/release-action@v1
        with:
          bodyFile: 'RELEASE_BODY.md'
          token: ${{ secrets.GITHUB_TOKEN }}
```

### Format files

> npm run generate

## Create test feature release

> npm run app:create-release

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run app:create-release

> kaufman-bot@1.4.0-alpha.13 app:create-release
> npm run app:build && npm run app:release && git push --follow-tags origin feature/73


> kaufman-bot@1.4.0-alpha.13 app:build
> npm run generate && npm run build && npm run app:build-changelog


> kaufman-bot@1.4.0-alpha.13 generate
> npm run prisma:generate && npm run rucken -- prepare --locales=en,ru && npm run lint:fix


> kaufman-bot@1.4.0-alpha.13 prisma:generate
> npm run -- prisma generate


> kaufman-bot@1.4.0-alpha.13 prisma
> prisma "generate"

Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (3.11.1 | library) to ./node_modules/@prisma/client in 163ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

> kaufman-bot@1.4.0-alpha.13 rucken
> rucken "prepare" "--locales=en,ru"


> kaufman-bot@1.4.0-alpha.13 lint:fix
> npm run tsc:lint && nx workspace-lint --fix && nx run-many --target=lint --all --fix && nx format:write --all


> kaufman-bot@1.4.0-alpha.13 tsc:lint
> tsc --noEmit -p tsconfig.base.json


    ✔  nx run currency-converter-server:lint (1s)
    ✔  nx run language-swither-server:lint (1s)
    ✔  nx run quotes-generator-server:lint (1s)
    ✔  nx run facts-generator-server:lint (1s)
    ✔  nx run jokes-generator-server:lint (1s)
    ✔  nx run debug-messages-server:lint (1s)
    ✔  nx run short-commands-server:lint (1s)
    ✔  nx run bot-in-groups-server:lint (1s)
    ✔  nx run first-meeting-server:lint (1s)
    ✔  nx run html-scraper-server:lint (1s)
    ✔  nx run dialogflow-server:lint (1s)
    ✔  nx run core-server:lint (1s)
    ✔  nx run server:lint (1s)

 —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target lint for 13 projects (15s)

         With additional flags:
           --fix=true


 >  NX   Running affected:* commands with --all can result in very slow builds.

   --all is not meant to be used for any sizable project or to be used in CI.

   Learn more about checking only what is affected: https://nx.dev/latest/angular/cli/affected#affected.

...

> kaufman-bot@1.4.0-alpha.13 build
> npm run nx -- build server


> kaufman-bot@1.4.0-alpha.13 nx
> nx "build" "server"


> nx run server:build

chunk (runtime: main) main.js (main) 189 KiB [entry] [rendered]
webpack compiled successfully (f16ca16fefb98d2f)

 —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 >  NX   Successfully ran target build for project server (6s)


> kaufman-bot@1.4.0-alpha.13 app:build-changelog
> ./node_modules/.bin/cp-cli ./CHANGELOG.md ./dist/libs/kaufman-bot/CHANGELOG.md


> kaufman-bot@1.4.0-alpha.13 app:release
> standard-version

✔ bumping version in ./package.json from 1.4.0-alpha.13 to 1.4.0
✔ outputting changes to CHANGELOG.md
✔ committing ./package.json and CHANGELOG.md
[STARTED] Preparing lint-staged...
[SUCCESS] Preparing lint-staged...
[STARTED] Running tasks for staged files...
[STARTED] package.json — 2 files
[STARTED] *.{js,ts} — 0 file
[STARTED] *.{js,ts,css,scss,md,yml,yaml,prisma} — 1 file
[SKIPPED] *.{js,ts} — no files
[STARTED] prettier --ignore-unknown --write
[SUCCESS] prettier --ignore-unknown --write
[SUCCESS] *.{js,ts,css,scss,md,yml,yaml,prisma} — 1 file
[SUCCESS] package.json — 2 files
[SUCCESS] Running tasks for staged files...
[STARTED] Applying modifications from tasks...
[SUCCESS] Applying modifications from tasks...
[STARTED] Cleaning up temporary files...
[SUCCESS] Cleaning up temporary files...

✔ tagging release v1.4.0
ℹ Run `git push --follow-tags origin feature/73` to publish
Enumerating objects: 88, done.
Counting objects: 100% (88/88), done.
Delta compression using up to 4 threads
Compressing objects: 100% (45/45), done.
Writing objects: 100% (57/57), 33.04 KiB | 2.20 MiB/s, done.
Total 57 (delta 31), reused 0 (delta 0)
remote: Resolving deltas: 100% (31/31), completed with 15 local objects.
remote:
remote: GitHub found 1 vulnerability on EndyKaufman/kaufman-bot's default branch (1 high). To find out more, visit:
remote:      https://github.com/EndyKaufman/kaufman-bot/security/dependabot/1
remote:
To github.com:EndyKaufman/kaufman-bot.git
   0a26e99..870ea57  feature/73 -> feature/73
 * [new tag]         v1.4.0 -> v1.4.0
```

### Look release notes

Navigate to https://github.com/EndyKaufman/kaufman-bot/releases
![Look release notes](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k50pcqy4myp8xiwhsyre.png)

### Check new version in telegram bot

![Check new version in telegram bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l0cp4jdeh4gkcuwfkz44.png)

In next post I create release and deploy bot to new stage for activate bot in production mode...

#kaufmanbot #nestjs #changelog #semver

# [2022-04-16 13:53] Refactoring monolith application to modules with DI in Telegram bot on NestJS

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/DevelopKaufmanBot - current bot in telegram

## Description of work

The current application is built as a monolith, but we want to publish all the code to the npm registry.

To do this, we need to convert and refactor all the sources step by step.

In this post, I will show you how to do it.

## Current state

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![Current state](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/p5wph0i5ah5aq93umaoq.png)

As we can see, more modules refer to the language switcher.
And we know that the main module works with the database through prisma, although we don't see it on the graph.

## Remove refer to the language swither

Main cause of more refer it is constant variable "DEFAULT_LANGUAGE"

We need remove it from language switcher
_libs/language-swither/server/src/lib/language-swither-config/language-swither.config.ts_

```ts
export const LANGUAGE_SWITHER_CONFIG = 'LANGUAGE_SWITHER_CONFIG';

export interface LanguageSwitherConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  removeWords?: string[];
  category: string;
}
```

![We need remove it from language switcher](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ds7i5bvgv930sqjajijg.png)

After it, we broken many files in project
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9v4xm6ev9q9vcxuei8zi.png)

Now we mast replace DEFAULT_LANGUAGE to 'en'

Example on of file with replace
_libs/facts-generator/server/src/lib/facts-generator-services/ru-facts-generator.service.ts_
![Example on of file with replace](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bi6mxji1nsdym7vjei1u.png)

After all replace, wee see another graph

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lj0ixiqrshw9yh337wsx.png)

## Move work with database from core to lib

Create new library

> npm run -- nx g @nrwl/nest:lib prisma/server

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run -- nx g @nrwl/nest:lib prisma/server

> kaufman-bot@2.0.0 nx
> nx "g" "@nrwl/nest:lib" "prisma/server"

CREATE libs/prisma/server/README.md
CREATE libs/prisma/server/.babelrc
CREATE libs/prisma/server/src/index.ts
CREATE libs/prisma/server/tsconfig.json
CREATE libs/prisma/server/tsconfig.lib.json
UPDATE tsconfig.base.json
CREATE libs/prisma/server/project.json
UPDATE workspace.json
CREATE libs/prisma/server/.eslintrc.json
CREATE libs/prisma/server/jest.config.js
CREATE libs/prisma/server/tsconfig.spec.json
CREATE libs/prisma/server/src/lib/prisma-server.module.ts
```

Move prisma-client module to this library

> mv libs/core/server/src/lib/prisma-client libs/prisma/server/src/lib
> rm -rf libs/prisma/server/src/lib/prisma-server.module.ts
> npm run generate

Replace all import where used PrismaClientService
![Replace all import where used PrismaClientService](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2kr6jop9y60p0tv9lfhe.png)

Replace all import where used PrismaClientModule
![Replace all import where used PrismaClientModule](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h3xwm4lbfbyl8kzo0o1i.png)

After all replace, wee see another graph and see all refer to database

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph and see all refer to database](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hmd1ntc2mw8xm2ez7b8u.png)

## Remove usage of prisma from debug message commands

Update debug message storage
_libs/debug-messages/server/src/lib/debug-messages-services/debug-messages.storage.ts_

```ts
export const DEBUG_MESSAGES_STORAGE = 'DEBUG_MESSAGES_STORAGE';

export type DebugMessagesStorageProvider = Pick<
  DebugMessagesStorage,
  'getDebugModeOfUser' | 'setDebugModeOfUser'
>;

export class DebugMessagesStorage {
  private readonly debugModeOfUsers: Record<number, boolean> = {};

  async getDebugModeOfUser(telegramUserId: number): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[telegramUserId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    return false;
  }

  async setDebugModeOfUser(userId: number, debugMode: boolean): Promise<void> {
    this.debugModeOfUsers[userId] = debugMode;
  }
}
```

![Update debug message storage](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ervm51r5dcnsspyle7tc.png)

Update service
_libs/debug-messages/server/src/lib/debug-messages-services/debug-messages.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnAfterBotCommands,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from '../debug-messages-config/debug-messages.config';
import { DebugMessagesCommandsEnum } from '../debug-messages-types/debug-messages-commands';
import {
  DebugMessagesStorageProvider,
  DEBUG_MESSAGES_STORAGE,
} from './debug-messages.storage';
import { DebugService } from './debug.service';

@Injectable()
export class DebugMessagesService
  implements BotCommandsProvider, OnBeforeBotCommands, OnAfterBotCommands
{
  private readonly logger = new Logger(DebugMessagesService.name);

  @CustomInject(DEBUG_MESSAGES_STORAGE)
  private readonly debugMessagesStorage!: DebugMessagesStorageProvider;

  constructor(
    @Inject(DEBUG_MESSAGES_CONFIG)
    private readonly debugMessagesConfig: DebugMessagesConfig,
    private readonly translatesService: TranslatesService,
    private readonly commandToolsService: BotCommandsToolsService,
    private readonly debugService: DebugService,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}
...
```

![Update service](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ssw8ofgdcc3sfooehxa.png)

Update module
_libs/debug-messages/server/src/lib/debug-messages.module.ts_

```ts
import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { TranslatesModule } from 'nestjs-translates';
import {
  DebugMessagesConfig,
  DEBUG_MESSAGES_CONFIG,
} from './debug-messages-config/debug-messages.config';
import { DebugMessagesService } from './debug-messages-services/debug-messages.service';
import {
  DebugMessagesStorage,
  DEBUG_MESSAGES_STORAGE,
} from './debug-messages-services/debug-messages.storage';
import { DebugService } from './debug-messages-services/debug.service';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: DEBUG_MESSAGES_STORAGE, useClass: DebugMessagesStorage },
    DebugService,
  ],
  exports: [
    TranslatesModule,
    BotCommandsModule,
    DEBUG_MESSAGES_STORAGE,
    DebugService,
  ],
})
export class DebugMessagesModule {
  static forRoot(): DynamicModule {
    return {
      module: DebugMessagesModule,
      imports: [
        CustomInjectorModule.forFeature({
          imports: [DebugMessagesModule],
          providers: [
            {
              provide: DEBUG_MESSAGES_CONFIG,
              useValue: <DebugMessagesConfig>{
                title: getText('Debug messages'),
                name: 'debug',
                usage: [
                  getText('debug on'),
                  getText('debug off'),
                  getText('debug state'),
                  getText('debug help'),
                ],
                descriptions: getText(
                  'Commands for enable and disable debug mode'
                ),
                spyWords: [getText('debug')],
                category: BotCommandsCategory.system,
              },
            },
            {
              provide: BOT_COMMANDS_PROVIDER,
              useClass: DebugMessagesService,
            },
          ],
          exports: [DEBUG_MESSAGES_CONFIG],
        }),
      ],
    };
  }
}
```

![Update module](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hncda2xh17dz0j6wnyc2.png)

## Add integration module prisma with debug messages

Create prisma integrations module in application
_apps/server/src/app/integrations/prisma/prisma-integrations.module.ts_

```ts
import { DEBUG_MESSAGES_STORAGE } from '@kaufman-bot/debug-messages/server';
import { PrismaClientModule } from '@kaufman-bot/prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { PrismaDebugMessagesStorage } from './prisma-integrations/prisma-debug-messages.storage';
import { PrismaDialogflowStorage } from './prisma-integrations/prisma-dialogflow.storage';
import { PrismaFirstMeetingStorage } from './prisma-integrations/prisma-first-meeting.storage';
import { PrismaLanguageSwitherStorage } from './prisma-integrations/prisma-language-swither.storage';

@Module({})
export class PrismaIntegrationsModule {
  static forRoot(): DynamicModule {
    return {
      module: PrismaIntegrationsModule,
      imports: [PrismaClientModule],
      providers: [
        {
          provide: DEBUG_MESSAGES_STORAGE,
          useClass: PrismaDebugMessagesStorage,
        },
      ],
      exports: [DEBUG_MESSAGES_STORAGE],
    };
  }
}
```

Create implementations for DebugMessagesStorageProvider

```ts
import { DebugMessagesStorageProvider } from '@kaufman-bot/debug-messages/server';
import { PrismaClientService } from '@kaufman-bot/prisma/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDebugMessagesStorage
  implements DebugMessagesStorageProvider
{
  private readonly debugModeOfUsers: Record<number, boolean> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getDebugModeOfUser(telegramUserId: number): Promise<boolean> {
    const currentDebugMode = this.debugModeOfUsers[telegramUserId];
    if (currentDebugMode) {
      return currentDebugMode;
    }
    try {
      const currentDebugModeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: telegramUserId.toString() },
          rejectOnNotFound: true,
        });
      this.debugModeOfUsers[telegramUserId] =
        currentDebugModeFromDatabase.debugMode;
      return this.debugModeOfUsers[telegramUserId];
    } catch (error) {
      return false;
    }
  }

  async setDebugModeOfUser(userId: number, debugMode: boolean): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: userId.toString(), debugMode },
      update: { debugMode },
      where: { telegramId: userId.toString() },
    });
    this.debugModeOfUsers[userId] = debugMode;
  }
}
```

Update app module
_apps/server/src/app/app.module.ts_

```ts
...
import { PrismaIntegrationsModule } from './integrations/prisma/prisma-integrations.module';

const TELEGRAM_BOT_WEB_HOOKS_DOMAIN = env
  .get('TELEGRAM_BOT_WEB_HOOKS_DOMAIN')
  .asString();
const TELEGRAM_BOT_WEB_HOOKS_PATH = env
  .get('TELEGRAM_BOT_WEB_HOOKS_PATH')
  .asString();

const BOT_NAMES = env.get('BOT_NAMES').required().asArray();
const BOT_NAMES_RU = env.get('BOT_NAMES_RU').required().asArray();

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
      launchOptions: {
        dropPendingUpdates: true,
        ...(TELEGRAM_BOT_WEB_HOOKS_DOMAIN && TELEGRAM_BOT_WEB_HOOKS_PATH
          ? {
              webhook: {
                domain: TELEGRAM_BOT_WEB_HOOKS_DOMAIN,
                hookPath: TELEGRAM_BOT_WEB_HOOKS_PATH,
              },
            }
          : {}),
      },
    }),
    PrismaClientModule.forRoot({
      databaseUrl: env.get('SERVER_POSTGRES_URL').required().asString(),
      logging: 'long_queries',
      maxQueryExecutionTime: 5000,
    }),
    PrismaIntegrationsModule.forRoot(),
...

```

![Update app module](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rzkrtj3azh01pk8n7gd6.png)

After all replace, wee see another graph

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wiwq6jhzkkjpw2r2c5rh.png)

## Remove usage of prisma from language swither commands

Update storage service
_libs/language-swither/server/src/lib/language-swither-services/language-swither.storage.ts_

```ts
export const LANGUAGE_SWITHER_STORAGE = 'LANGUAGE_SWITHER_STORAGE';

export type LanguageSwitherStorageProvider = Pick<
  LanguageSwitherStorage,
  'getLanguageOfUser' | 'setLanguageOfUser'
>;

export class LanguageSwitherStorage {
  private readonly languageOfUsers: Record<number, string> = {};

  async getLanguageOfUser(telegramUserId: number): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[telegramUserId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    return null;
  }

  async setLanguageOfUser(
    telegramUserId: number,
    langCode: string
  ): Promise<void> {
    this.languageOfUsers[telegramUserId] = langCode;
  }
}
```

Create prisma integrations switch storage
_apps/server/src/app/integrations/prisma/prisma-integrations-services/prisma-language-swither.storage.ts_

```ts
import { LanguageSwitherStorageProvider } from '@kaufman-bot/language-swither/server';
import { PrismaClientService } from '@kaufman-bot/prisma/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaLanguageSwitherStorage
  implements LanguageSwitherStorageProvider
{
  private readonly languageOfUsers: Record<number, string> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getLanguageOfUser(telegramUserId: number): Promise<string | null> {
    const currentLanguageCode = this.languageOfUsers[telegramUserId];
    if (currentLanguageCode) {
      return currentLanguageCode;
    }
    try {
      const currentLanguageCodeFromDatabase =
        await this.prismaClientService.user.findFirst({
          where: { telegramId: telegramUserId.toString() },
          rejectOnNotFound: true,
        });
      this.languageOfUsers[telegramUserId] =
        currentLanguageCodeFromDatabase.langCode;
      return this.languageOfUsers[telegramUserId];
    } catch (error) {
      return null;
    }
  }

  async setLanguageOfUser(
    telegramUserId: number,
    langCode: string
  ): Promise<void> {
    await this.prismaClientService.user.upsert({
      create: { telegramId: telegramUserId.toString(), langCode },
      update: { langCode },
      where: { telegramId: telegramUserId.toString() },
    });
    this.languageOfUsers[telegramUserId] = langCode;
  }
}
```

Append PrismaLanguageSwitherStorage to PrismaIntegrationsModule
_apps/server/src/app/integrations/prisma/prisma-integrations-services/prisma-integrations.module.ts_

```ts
import { DEBUG_MESSAGES_STORAGE } from '@kaufman-bot/debug-messages/server';
import { LANGUAGE_SWITHER_STORAGE } from '@kaufman-bot/language-swither/server';
import { PrismaClientModule } from '@kaufman-bot/prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { PrismaDebugMessagesStorage } from './prisma-integrations/prisma-debug-messages.storage';
import { PrismaDialogflowStorage } from './prisma-integrations/prisma-dialogflow.storage';
import { PrismaFirstMeetingStorage } from './prisma-integrations/prisma-first-meeting.storage';
import { PrismaLanguageSwitherStorage } from './prisma-integrations/prisma-language-swither.storage';

@Module({})
export class PrismaIntegrationsModule {
  static forRoot(): DynamicModule {
    return {
      module: PrismaIntegrationsModule,
      imports: [PrismaClientModule],
      providers: [
        {
          provide: DEBUG_MESSAGES_STORAGE,
          useClass: PrismaDebugMessagesStorage,
        },
        {
          provide: LANGUAGE_SWITHER_STORAGE,
          useClass: PrismaLanguageSwitherStorage,
        },
      ],
      exports: [DEBUG_MESSAGES_STORAGE, LANGUAGE_SWITHER_STORAGE],
    };
  }
}
```

Update service
_libs/language-swither/server/src/lib/language-swither-services/language-swither.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService, TranslatesStorage } from 'nestjs-translates';
import {
  LanguageSwitherConfig,
  LANGUAGE_SWITHER_CONFIG,
} from '../language-swither-config/language-swither.config';
import { LanguageSwitherCommandsEnum } from '../language-swither-types/language-swither-commands';
import {
  LanguageSwitherStorage,
  LANGUAGE_SWITHER_STORAGE,
} from './language-swither.storage';

@Injectable()
export class LanguageSwitherService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  private readonly logger = new Logger(LanguageSwitherService.name);

  @CustomInject(LANGUAGE_SWITHER_STORAGE)
  private readonly languageSwitherStorage!: LanguageSwitherStorage;

  constructor(
    @Inject(LANGUAGE_SWITHER_CONFIG)
    private readonly languageSwitherConfig: LanguageSwitherConfig,
    private readonly translatesService: TranslatesService,
    private readonly translatesStorage: TranslatesStorage,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}
...
```

Update module
_libs/language-swither/server/src/lib/language-swither.module.ts_

```ts
import {
  BotCommandsCategory,
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
import {
  LanguageSwitherStorage,
  LANGUAGE_SWITHER_STORAGE,
} from './language-swither-services/language-swither.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: LANGUAGE_SWITHER_STORAGE, useClass: LanguageSwitherStorage },
    LanguageSwitherStorage,
  ],
  exports: [TranslatesModule, BotCommandsModule, LANGUAGE_SWITHER_STORAGE],
})
...
```

After all replace, wee see another graph

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/skprpw4r3bj5gggsktfg.png)

## Remove usage of prisma from dialogflow storage commands

Update DialogflowStorage
_libs/dialogflow/server/src/lib/dialogflow-services/dialogflow.storage.ts_

```ts
import { Injectable } from '@nestjs/common';
import {
  DialogflowSessionRequestsMetadata,
  DialogflowSessionResponsesMetadata,
} from '../dialogflow-types/dialogflow-session-metadata';

export type SessionOfUsers = {
  sessionId: string;
  responsesMetadata: DialogflowSessionResponsesMetadata;
  requestsMetadata: DialogflowSessionRequestsMetadata;
};
export const DIALOGFLOW_STORAGE = 'DIALOGFLOW_STORAGE';

export type DialogflowStorageProvider = Pick<
  DialogflowStorage,
  | 'getUserSession'
  | 'appendToUserSession'
  | 'resetUserSession'
  | 'setUserSession'
>;

@Injectable()
export class DialogflowStorage {
  private readonly sessionOfUsers: Record<number, SessionOfUsers> = {};

  async getUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
    createIfNotExists?: boolean;
  }): Promise<SessionOfUsers | null> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    if (currentSessionOfUsers) {
      return currentSessionOfUsers;
    }
    return null;
  }

  async appendToUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(currentSessionOfUsers.requestsMetadata || []),
      ...(sessionOfUsers.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(currentSessionOfUsers.responsesMetadata || []),
      ...sessionOfUsers.responsesMetadata,
    ];

    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async setUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(sessionOfUsers?.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(sessionOfUsers.responsesMetadata || []),
    ];

    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async resetUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    try {
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: 'sessionId',
        requestsMetadata: [],
        responsesMetadata: [],
      };
    } catch (error) {
      null;
    }
  }

  private getKey({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    return `${telegramUserId}_${projectId}`;
  }
}
```

Add PrismaDialogflowStorage
_apps/server/src/app/integrations/prisma/prisma-integrations-services/prisma-dialogflow.storage.ts_

```ts
import {
  DialogflowStorageProvider,
  SessionOfUsers,
} from '@kaufman-bot/dialogflow/server';
import { PrismaClientService } from '@kaufman-bot/prisma/server';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDialogflowStorage implements DialogflowStorageProvider {
  private readonly sessionOfUsers: Record<number, SessionOfUsers> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
    createIfNotExists?: boolean;
  }): Promise<SessionOfUsers | null> {
    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    if (currentSessionOfUsers) {
      return currentSessionOfUsers;
    }
    try {
      const currentFromDatabase =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
            projectId,
          },
          rejectOnNotFound: true,
        });
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
        sessionId: currentFromDatabase.sessionId,
        requestsMetadata: currentFromDatabase.requestsMetadata,
        responsesMetadata: currentFromDatabase.responsesMetadata,
      };
      return this.sessionOfUsers[this.getKey({ telegramUserId, projectId })];
    } catch (error) {
      return null;
    }
  }

  async appendToUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(currentSessionOfUsers.requestsMetadata || []),
      ...(sessionOfUsers.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(currentSessionOfUsers.responsesMetadata || []),
      ...sessionOfUsers.responsesMetadata,
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async setUserSession({
    telegramUserId,
    projectId,
    sessionOfUsers,
  }: {
    telegramUserId: number;
    projectId: string;
    sessionOfUsers: SessionOfUsers;
  }): Promise<void> {
    const user = await this.getUser(telegramUserId);

    const currentSessionOfUsers: SessionOfUsers =
      this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] || {};
    currentSessionOfUsers.requestsMetadata = [
      ...(sessionOfUsers?.requestsMetadata || []),
    ];
    currentSessionOfUsers.responsesMetadata = [
      ...(sessionOfUsers.responsesMetadata || []),
    ];

    await this.prismaClientService.dialogflowSession.upsert({
      create: {
        userId: user.id,
        projectId,
        sessionId: sessionOfUsers.sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      update: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        requestsMetadata: currentSessionOfUsers.requestsMetadata as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responsesMetadata: currentSessionOfUsers.responsesMetadata as any,
      },
      where: {
        userId_projectId_sessionId: {
          projectId,
          userId: user.id,
          sessionId: sessionOfUsers.sessionId,
        },
      },
    });
    this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
      sessionId: sessionOfUsers.sessionId,
      requestsMetadata: currentSessionOfUsers.requestsMetadata,
      responsesMetadata: currentSessionOfUsers.responsesMetadata,
    };
  }

  async resetUserSession({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    try {
      const defaultUserSession =
        await this.prismaClientService.dialogflowSession.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
            projectId,
          },
        });
      if (defaultUserSession) {
        await this.prismaClientService.dialogflowSession.updateMany({
          data: {
            requestsMetadata: [],
            responsesMetadata: [],
          },
          where: {
            sessionId: defaultUserSession.sessionId,
            projectId,
          },
        });
        this.sessionOfUsers[this.getKey({ telegramUserId, projectId })] = {
          sessionId: defaultUserSession.sessionId,
          requestsMetadata: [],
          responsesMetadata: [],
        };
      }
    } catch (error) {
      null;
    }
  }

  private async getUser(telegramUserId: number) {
    let user;
    try {
      user = await this.prismaClientService.user.findFirst({
        select: { id: true },
        where: { telegramId: telegramUserId.toString() },
        rejectOnNotFound: true,
      });
    } catch (error) {
      user = await this.prismaClientService.user.create({
        data: { telegramId: telegramUserId.toString() },
      });
    }
    return user;
  }

  private getKey({
    telegramUserId,
    projectId,
  }: {
    telegramUserId: number;
    projectId: string;
  }) {
    return `${telegramUserId}_${projectId}`;
  }
}
```

Update PrismaIntegrationsModule
_apps/server/src/app/integrations/prisma/prisma-integrations.module.ts_

```ts
import { DEBUG_MESSAGES_STORAGE } from '@kaufman-bot/debug-messages/server';
import { DIALOGFLOW_STORAGE } from '@kaufman-bot/dialogflow/server';
import { LANGUAGE_SWITHER_STORAGE } from '@kaufman-bot/language-swither/server';
import { PrismaClientModule } from '@kaufman-bot/prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { PrismaDebugMessagesStorage } from './prisma-integrations/prisma-debug-messages.storage';
import { PrismaDialogflowStorage } from './prisma-integrations/prisma-dialogflow.storage';
import { PrismaFirstMeetingStorage } from './prisma-integrations/prisma-first-meeting.storage';
import { PrismaLanguageSwitherStorage } from './prisma-integrations/prisma-language-swither.storage';

@Module({})
export class PrismaIntegrationsModule {
  static forRoot(): DynamicModule {
    return {
      module: PrismaIntegrationsModule,
      imports: [PrismaClientModule],
      providers: [
        {
          provide: DEBUG_MESSAGES_STORAGE,
          useClass: PrismaDebugMessagesStorage,
        },
        {
          provide: LANGUAGE_SWITHER_STORAGE,
          useClass: PrismaLanguageSwitherStorage,
        },
        {
          provide: DIALOGFLOW_STORAGE,
          useClass: PrismaDialogflowStorage,
        },
      ],
      exports: [
        DEBUG_MESSAGES_STORAGE,
        LANGUAGE_SWITHER_STORAGE,
        DIALOGFLOW_STORAGE,
      ],
    };
  }
}
```

Update DialogflowService
_libs/dialogflow/server/src/lib/dialogflow-services/dialogflow.service.ts_

```ts
import dialogflow, { protos } from '@google-cloud/dialogflow';
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnAfterBotCommands,
} from '@kaufman-bot/core/server';
import { DebugService } from '@kaufman-bot/debug-messages/server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import { v4 } from 'uuid';
import {
  DialogflowConfig,
  DIALOGFLOW_CONFIG,
} from '../dialogflow-config/dialogflow.config';
import { DialogflowStorage, DIALOGFLOW_STORAGE } from './dialogflow.storage';

export const DISABLE_DIALOGFLOW_COMMANDS = 'DISABLE_DIALOGFLOW_COMMANDS';

@Injectable()
export class DialogflowService
  implements BotCommandsProvider, OnAfterBotCommands
{
  private readonly logger = new Logger(DialogflowService.name);

  @CustomInject(DIALOGFLOW_STORAGE)
  private readonly dialogflowStorage!: DialogflowStorage;

  constructor(
    @Inject(DIALOGFLOW_CONFIG)
    private readonly dialogflowConfig: DialogflowConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly debugService: DebugService
  ) {}
...
```

![Update DialogflowService](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/52fbf94p5dhwueq8uj61.png)

After all replace, wee see another graph

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fngw79iqgrxeb9zb8pgv.png)

## Remove usage of prisma from first meeting storage commands

Update storage
_libs/first-meeting/server/src/lib/first-meeting-services/first-meeting.storage.ts_

```ts
import { FirstMeeting } from '@prisma/client';

export const FIRST_MEETING_STORAGE = 'FIRST_MEETING_STORAGE';

export type FirstMeetingStorageProvider = Pick<
  FirstMeetingStorage,
  | 'createUserFirstMeeting'
  | 'getUserFirstMeeting'
  | 'pathUserFirstMeeting'
  | 'removeUserFirstMeeting'
>;

export class FirstMeetingStorage {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  async getUserFirstMeeting({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting | null> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }
    return null;
  }

  async createUserFirstMeeting(telegramUserId: number) {
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] = {
      firstname: '',
      lastname: '',
      gender: 'Male',
      status: 'StartMeeting',
    };
    return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async removeUserFirstMeeting({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async pathUserFirstMeeting({
    telegramUserId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    firstMeeting,
  }: {
    telegramUserId: number;
    firstMeeting: Partial<FirstMeeting>;
  }) {
    let currentUserFirstMeeting = await this.getUserFirstMeeting({
      telegramUserId,
    });
    if (!currentUserFirstMeeting) {
      currentUserFirstMeeting = await this.createUserFirstMeeting(
        telegramUserId
      );
    }

    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      await this.getUserFirstMeeting({ telegramUserId });
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
```

Update service
_libs/first-meeting/server/src/lib/first-meeting-services/first-meeting.service.ts_

```ts
import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core/server';
import { Inject, Injectable } from '@nestjs/common';
import { FirstMeeting } from '@prisma/client';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import { FirstMeetingStorage } from './first-meeting.storage';

export const DISABLE_FIRST_MEETING_COMMANDS = 'DISABLE_FIRST_MEETING_COMMANDS';

@Injectable()
export class FirstMeetingService
  implements BotCommandsProvider, OnContextBotCommands
{
  @CustomInject(FirstMeetingStorage)
  private readonly firstMeetingStorage!: FirstMeetingStorage;

  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly firstMeetingConfig: FirstMeetingConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}
...
```

Update module
_libs/first-meeting/server/src/lib/first-meeting.module.ts_

```ts
import {
  BotCommandsCategory,
  BotCommandsModule,
  BOT_COMMANDS_PROVIDER,
} from '@kaufman-bot/core/server';
import { DynamicModule, Module } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { TranslatesModule } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from './first-meeting-config/first-meeting.config';
import { FirstMeetingService } from './first-meeting-services/first-meeting.service';
import {
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from './first-meeting-services/first-meeting.storage';

@Module({
  imports: [TranslatesModule, BotCommandsModule],
  providers: [
    { provide: FIRST_MEETING_STORAGE, useClass: FirstMeetingStorage },
  ],
  exports: [TranslatesModule, BotCommandsModule, FIRST_MEETING_STORAGE],
})
export class FirstMeetingModule {
...
```

Create implementations for FirstMeetingStorage
_apps/server/src/app/integrations/prisma/prisma-integrations-services/prisma-first-meeting.storage.ts_

```ts
import { FirstMeetingStorageProvider } from '@kaufman-bot/first-meeting/server';
import { PrismaClientService } from '@kaufman-bot/prisma/server';
import { Injectable } from '@nestjs/common';
import { FirstMeeting } from '@prisma/client';

@Injectable()
export class PrismaFirstMeetingStorage implements FirstMeetingStorageProvider {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  constructor(private readonly prismaClientService: PrismaClientService) {}

  async getUserFirstMeeting({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting | null> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }

    let databaseFirstMeetingOfUsers: FirstMeeting | null = null;
    try {
      databaseFirstMeetingOfUsers =
        await this.prismaClientService.firstMeeting.findFirst({
          where: {
            User: { telegramId: telegramUserId.toString() },
          },
          rejectOnNotFound: true,
        });
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
        databaseFirstMeetingOfUsers;

      return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    } catch (error) {
      return null;
    }
  }

  async createUserFirstMeeting(telegramUserId: number) {
    return await this.prismaClientService.firstMeeting.create({
      data: {
        firstname: '',
        lastname: '',
        gender: 'Male',
        status: 'StartMeeting',
        User: {
          connectOrCreate: {
            create: { telegramId: telegramUserId.toString() },
            where: { telegramId: telegramUserId.toString() },
          },
        },
      },
    });
  }

  async removeUserFirstMeeting({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    await this.prismaClientService.firstMeeting.deleteMany({
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });
  }

  async pathUserFirstMeeting({
    telegramUserId,
    firstMeeting,
  }: {
    telegramUserId: number;
    firstMeeting: Partial<FirstMeeting>;
  }) {
    let currentUserFirstMeeting = await this.getUserFirstMeeting({
      telegramUserId,
    });
    if (!currentUserFirstMeeting) {
      currentUserFirstMeeting = await this.createUserFirstMeeting(
        telegramUserId
      );
    }

    await this.prismaClientService.firstMeeting.updateMany({
      data: {
        ...currentUserFirstMeeting,
        ...firstMeeting,
        updatedAt: new Date(),
      },
      where: {
        User: { telegramId: telegramUserId.toString() },
      },
    });

    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      await this.getUserFirstMeeting({ telegramUserId });
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
```

Update PrismaIntegrationsModule
_apps/server/src/app/integrations/prisma/prisma-integrations.module.ts_

```ts
import { DEBUG_MESSAGES_STORAGE } from '@kaufman-bot/debug-messages/server';
import { DIALOGFLOW_STORAGE } from '@kaufman-bot/dialogflow/server';
import { FIRST_MEETING_STORAGE } from '@kaufman-bot/first-meeting/server';
import { LANGUAGE_SWITHER_STORAGE } from '@kaufman-bot/language-swither/server';
import { PrismaClientModule } from '@kaufman-bot/prisma/server';
import { DynamicModule, Module } from '@nestjs/common';
import { PrismaDebugMessagesStorage } from './prisma-integrations/prisma-debug-messages.storage';
import { PrismaDialogflowStorage } from './prisma-integrations/prisma-dialogflow.storage';
import { PrismaFirstMeetingStorage } from './prisma-integrations/prisma-first-meeting.storage';
import { PrismaLanguageSwitherStorage } from './prisma-integrations/prisma-language-swither.storage';

@Module({})
export class PrismaIntegrationsModule {
  static forRoot(): DynamicModule {
    return {
      module: PrismaIntegrationsModule,
      imports: [PrismaClientModule],
      providers: [
        {
          provide: DEBUG_MESSAGES_STORAGE,
          useClass: PrismaDebugMessagesStorage,
        },
        {
          provide: LANGUAGE_SWITHER_STORAGE,
          useClass: PrismaLanguageSwitherStorage,
        },
        {
          provide: DIALOGFLOW_STORAGE,
          useClass: PrismaDialogflowStorage,
        },
        {
          provide: FIRST_MEETING_STORAGE,
          useClass: PrismaFirstMeetingStorage,
        },
      ],
      exports: [
        DEBUG_MESSAGES_STORAGE,
        LANGUAGE_SWITHER_STORAGE,
        DIALOGFLOW_STORAGE,
        FIRST_MEETING_STORAGE,
      ],
    };
  }
}
```

After all replace, wee see another graph

> npm run nx -- graph

```sh
endy@endy-virtual-machine:~/Projects/current/kaufman-bot$ npm run nx -- graph

> kaufman-bot@2.0.0 nx
> nx "graph"


 >  NX   Project graph started at http://127.0.0.1:4211
```

![After all replace, wee see another graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rw865dm18xpd7yr8pax4.png)

As you can see, the prisma library for working with the database has no links to other libraries.

![As you can see, the prisma library for working with the database has no links to other libraries.](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dswy8veevp7vqj343zyb.png)

The project is now ready to be published to the npm registry.

In the next post, I will publish all the libraries in the npm registry...

#kaufmanbot #nestjs #di #refactoring
