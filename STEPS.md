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