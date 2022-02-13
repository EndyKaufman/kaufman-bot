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
