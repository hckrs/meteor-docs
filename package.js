Package.describe({
  name: 'hckrs:docs',
  summary: 'Live source code documentation tool, using jsdoc annotations.',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  // api.addFiles('jsdoc.js');
});


Package.registerBuildPlugin({
  name: "jsdoc",
  use: [],
  sources: ['jsdoc.js'],
  npmDependencies: {
    jsdoc: "3.2.2"
  }
})