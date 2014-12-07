var path = Npm.require('path');
var spawnProc = Npm.require('child_process').fork;
var Future = Npm.require('fibers/future');


// Handle files with .jsdoc extension
// Generates two javascript files, containing:
// 1. Original source code
// 2. Documentation stored in a global object called `DocsData`
var sourceHandler = function(compileStep) {
  var jsSource   =  compileStep.read().toString('utf8')
    , docSource  =  compileJSDoc(compileStep).wait();

  // Add javascript source from original file
  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(/.jsdoc$/i, '.js'),
    sourcePath: compileStep.inputPath,
    data: jsSource
  });

  // Add documentation source resulting from jsdoc compilation
  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(/.jsdoc$/i, '.doc.js'),
    sourcePath: compileStep.inputPath,
    data: docSource
  });  
}


// Compile as '.jsdoc' file using the jsdoc executable
var compileJSDoc = function(compileStep) {
  var future = new Future;

  // XXX TODO smart path
  var script = 'packages/hckrs\:docs/.npm/plugin/jsdoc/node_modules/jsdoc/jsdoc.js';
  var args = [ 
    '-t', "packages/hckrs:docs/plugin/jsdoc-template",
    '-c', "packages/hckrs:docs/plugin/jsdoc-conf.json",
    compileStep.fullInputPath
  ];

  // Compile using jsdoc 
  jsdoc = spawnProc(script, args);

  // Listen for compiled jsdoc data
  jsdoc.on('message', function(data) {
    future.return(makeDocSource(data));
  });

  return future;
}


// Transform output data from jsdoc executable to a javascript string
// that we can use in the client application to build a documentation view.
var makeDocSource = function(data) {

  // docs to JSON
  var jsonDataString = JSON.stringify(data.docTree);
  var jsonNamesString = JSON.stringify(data.docNames, null, 2);

  // JSON to javascript string
  var jsDataString = "DocsData = _.extend(this.DocsData || {}, " + jsonDataString + ");";
  var jsNamesString = "DocsNames = (this.DocsNames || []).concat(" + jsonNamesString + ");";

  // return doc source
  return jsNamesString + jsDataString;
}


// Register compilation step for .jsdoc file extension
Plugin.registerSourceHandler("jsdoc", sourceHandler);



