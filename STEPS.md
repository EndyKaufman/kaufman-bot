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

# [2022-02-12 22:1] Deploy to netfly

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

#kaufmanbot #nx #netlify