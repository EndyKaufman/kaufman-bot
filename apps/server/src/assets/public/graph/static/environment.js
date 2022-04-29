window.exclude = [];
window.watch = false;
window.environment = 'release';
window.localMode = 'build';

window.appConfig = {
  showDebugger: false,
  projectGraphs: [
    {
      id: 'local',
      label: 'local',
      url: 'projectGraph.json',
    },
  ],
  defaultProjectGraph: 'local',
};
window.projectGraphResponse = {
  hash: '7d45520b1db18c828ba3806dfdff68ab2ea729880732f7fb70c5df077362d287',
  projects: [
    {
      name: 'currency-converter-server',
      type: 'lib',
      data: { tags: [], root: 'libs/currency-converter/server', files: [] },
    },
    {
      name: 'language-swither-server',
      type: 'lib',
      data: { tags: [], root: 'libs/language-swither/server', files: [] },
    },
    {
      name: 'quotes-generator-server',
      type: 'lib',
      data: { tags: [], root: 'libs/quotes-generator/server', files: [] },
    },
    {
      name: 'facts-generator-server',
      type: 'lib',
      data: { tags: [], root: 'libs/facts-generator/server', files: [] },
    },
    {
      name: 'jokes-generator-server',
      type: 'lib',
      data: { tags: [], root: 'libs/jokes-generator/server', files: [] },
    },
    {
      name: 'debug-messages-server',
      type: 'lib',
      data: { tags: [], root: 'libs/debug-messages/server', files: [] },
    },
    {
      name: 'short-commands-server',
      type: 'lib',
      data: { tags: [], root: 'libs/short-commands/server', files: [] },
    },
    {
      name: 'bot-in-groups-server',
      type: 'lib',
      data: { tags: [], root: 'libs/bot-in-groups/server', files: [] },
    },
    {
      name: 'first-meeting-server',
      type: 'lib',
      data: { tags: [], root: 'libs/first-meeting/server', files: [] },
    },
    {
      name: 'html-scraper-server',
      type: 'lib',
      data: { tags: [], root: 'libs/html-scraper/server', files: [] },
    },
    {
      name: 'dialogflow-server',
      type: 'lib',
      data: { tags: [], root: 'libs/dialogflow/server', files: [] },
    },
    {
      name: 'prisma-server',
      type: 'lib',
      data: { tags: [], root: 'libs/prisma/server', files: [] },
    },
    {
      name: 'core-server',
      type: 'lib',
      data: { tags: [], root: 'libs/core/server', files: [] },
    },
    {
      name: 'schematics',
      type: 'lib',
      data: { tags: [], root: 'libs/schematics', files: [] },
    },
    {
      name: 'server',
      type: 'app',
      data: { tags: [], root: 'apps/server', files: [] },
    },
  ],
  dependencies: {
    'currency-converter-server': [
      {
        source: 'currency-converter-server',
        target: 'core-server',
        type: 'static',
      },
      {
        source: 'currency-converter-server',
        target: 'html-scraper-server',
        type: 'static',
      },
    ],
    'language-swither-server': [
      {
        source: 'language-swither-server',
        target: 'core-server',
        type: 'static',
      },
    ],
    'quotes-generator-server': [
      {
        source: 'quotes-generator-server',
        target: 'core-server',
        type: 'static',
      },
      {
        source: 'quotes-generator-server',
        target: 'html-scraper-server',
        type: 'static',
      },
    ],
    'facts-generator-server': [
      {
        source: 'facts-generator-server',
        target: 'core-server',
        type: 'static',
      },
      {
        source: 'facts-generator-server',
        target: 'html-scraper-server',
        type: 'static',
      },
    ],
    'jokes-generator-server': [
      {
        source: 'jokes-generator-server',
        target: 'core-server',
        type: 'static',
      },
      {
        source: 'jokes-generator-server',
        target: 'html-scraper-server',
        type: 'static',
      },
    ],
    'debug-messages-server': [
      {
        source: 'debug-messages-server',
        target: 'core-server',
        type: 'static',
      },
    ],
    'short-commands-server': [
      {
        source: 'short-commands-server',
        target: 'core-server',
        type: 'static',
      },
    ],
    'bot-in-groups-server': [
      { source: 'bot-in-groups-server', target: 'core-server', type: 'static' },
      {
        source: 'bot-in-groups-server',
        target: 'dialogflow-server',
        type: 'static',
      },
      {
        source: 'bot-in-groups-server',
        target: 'first-meeting-server',
        type: 'static',
      },
      {
        source: 'bot-in-groups-server',
        target: 'language-swither-server',
        type: 'static',
      },
      {
        source: 'bot-in-groups-server',
        target: 'short-commands-server',
        type: 'static',
      },
    ],
    'first-meeting-server': [
      { source: 'first-meeting-server', target: 'core-server', type: 'static' },
    ],
    'html-scraper-server': [
      { source: 'html-scraper-server', target: 'core-server', type: 'static' },
    ],
    'dialogflow-server': [
      { source: 'dialogflow-server', target: 'core-server', type: 'static' },
      {
        source: 'dialogflow-server',
        target: 'debug-messages-server',
        type: 'static',
      },
    ],
    'prisma-server': [],
    'core-server': [],
    schematics: [],
    server: [
      { source: 'server', target: 'bot-in-groups-server', type: 'static' },
      { source: 'server', target: 'core-server', type: 'static' },
      { source: 'server', target: 'currency-converter-server', type: 'static' },
      { source: 'server', target: 'debug-messages-server', type: 'static' },
      { source: 'server', target: 'dialogflow-server', type: 'static' },
      { source: 'server', target: 'facts-generator-server', type: 'static' },
      { source: 'server', target: 'first-meeting-server', type: 'static' },
      { source: 'server', target: 'jokes-generator-server', type: 'static' },
      { source: 'server', target: 'language-swither-server', type: 'static' },
      { source: 'server', target: 'prisma-server', type: 'static' },
      { source: 'server', target: 'quotes-generator-server', type: 'static' },
      { source: 'server', target: 'short-commands-server', type: 'static' },
    ],
  },
  layout: { appsDir: 'apps', libsDir: 'libs' },
  affected: [],
  focus: null,
  groupByFolder: false,
  exclude: [],
};
