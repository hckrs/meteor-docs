Package.describe({
  name: 'hckrs:docs',
  summary: 'Live Documentation generation using JSDoc source code annotations.',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('underscore', 'client');
});


Package.registerBuildPlugin({
  name: "jsdoc",
  use: [],
  sources: ['plugin/jsdoc.js'],
  npmDependencies: {
    jsdoc: "3.3.0-alpha7"
  }
})