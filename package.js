Package.describe({
  name: 'hckrs:docs',
  summary: 'Live Documentation like Meteor using JSDoc.',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  var everywhere = ['client', 'server'];

  // General
  api.versionsFrom('1.0');
  api.use('underscore', everywhere);
  
  // Collecting docs
  api.addFiles('lib/underscore.deepExtend.js', everywhere);
  api.addFiles('docs.js', everywhere);
  api.export('Docs', everywhere);

  // Docs viewer (client-side)
  api.use('iron:router', 'client');
  api.use('jquery', 'client');
  api.use('templating', 'client');
  api.use('markdown', 'client');
  api.use('less', 'client');
  api.addFiles('docs-client/api-box.html', 'client');
  api.addFiles('docs-client/api-box.js', 'client');
  api.addFiles('docs-client/docs.html', 'client');
  api.addFiles('docs-client/docs.js', 'client');
  api.addFiles('docs-client/docs.less', 'client');
  api.addFiles('docs-client/tableOfContents.html', 'client');
  api.addFiles('docs-client/tableOfContents.js', 'client');  
});


Package.registerBuildPlugin({
  name: "jsdoc",
  use: [],
  sources: ['plugin/jsdoc.js'],
  npmDependencies: {
    jsdoc: "3.3.0-alpha7"
  }
})