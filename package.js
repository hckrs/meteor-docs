

Package.describe({
  name: 'hckrs:docs',
  summary: 'Live Documentation like Meteor using JSDoc.',
  version: '0.1.0',
  git: ' /* Fill me in! */ '
});


// XXX make sure to include only at development, 
// that means, only when starting with "meteor run".
var cmd = process.argv[2];
var enable = cmd === 'run'; 


Package.onUse(function(api) {
  
  // Only include this package while developing
  if (enable) {

    // General
    api.versionsFrom('1.0');

    // Collecting docs
    api.use('underscore', ['client', 'server']);
    api.addFiles('lib/underscore.deepExtend.js', ['client', 'server']);
    api.addFiles('docs.js', ['client', 'server']);
    api.export('DocsPackage', ['client', 'server']);
    
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
  }
});

// Compile .jsdoc files
// - In development: generate both .js and .doc.js
// - In production: generate .js only
Package.registerBuildPlugin({
  name: "jsdoc",
  sources: ['plugin/jsdoc.js'],
  npmDependencies: {
    jsdoc: "3.3.0-alpha7"
  }
});