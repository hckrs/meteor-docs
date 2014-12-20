

Package.describe({
  name: 'hckrs:docs',
  summary: 'Live Documentation like Meteor using JSDoc.',
  version: '0.1.0',
  git: ' /* Fill me in! */ '
});


Package.onUse(function(api) {
  // Only include this package if 
  // environment variable DOCS=1 is setted. 
  if (process.env.DOCS != 1) return;

  // General
  api.versionsFrom('1.0');

  // Collecting docs
  api.use('underscore');
  api.addFiles('lib/underscore.deepExtend.js');
  api.addFiles('docs.js');
  api.export('DocsPackage');
  
  // Docs viewer (client-side)
  api.use('iron:router', 'client');
  api.use('jquery', 'client');
  api.use('templating', 'client');
  api.use('markdown', 'client');
  api.use('less', 'client');
  api.use('reactive-var', 'client');
  api.addFiles('viewer/api-box.html', 'client');
  api.addFiles('viewer/api-box.js', 'client');
  api.addFiles('viewer/docs.html', 'client');
  api.addFiles('viewer/docs.js', 'client');
  api.addFiles('viewer/docs.less', 'client');
  api.addFiles('viewer/tableOfContents.html', 'client');
  api.addFiles('viewer/tableOfContents.js', 'client');  
});

// Compile .jsdoc files
// - In development: generate both .js and .doc.js
// - In production: generate .js only
Package.registerBuildPlugin({
  name: "jsdoc",
  sources: ['plugin/jsdoc.js'],
  npmDependencies: {
    "jsdoc-meteor": "0.1.0",
  }
});