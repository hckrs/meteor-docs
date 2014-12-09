var path = Npm.require('path');
var spawnProc = Npm.require('child_process').fork;
var Future = Npm.require('fibers/future');


// XXX make sure to activate only at development, 
// that means, only when starting with "meteor run".
var cmd = process.argv[2];
var enable = cmd === 'run'; 


// Handle files with .jsdoc extension
// Generates two javascript files, containing:
// 1. Original source code
// 2. Documentation stored in a global object called `DocsData`
var sourceHandler = function(compileStep) {
  var fileName = path.basename(compileStep.inputPath, '.jsdoc')
    , dirName  = path.dirname(compileStep.inputPath);

  // Copy javascript source from original file
  compileStep.addJavaScript({
    path: path.join(dirName, fileName) + '.js',
    sourcePath: compileStep.inputPath,
    data: compileStep.read().toString('utf8')
  });

  // Add documentation source resulting from jsdoc compilation.
  // Only when we are on a development machine.
  if (enable) {
    var docSource = compileJSDoc(compileStep).wait();

    if (docSource) {
      compileStep.addJavaScript({
        path: path.join(dirName, fileName) + '.doc.js',
        sourcePath: compileStep.inputPath,
        data: docSource
      });  
    } else {
      compileStep.error({
        message: "Failed to compile jsdoc file.",
        sourcePath: compileStep.inputPath,
      });
    }
  }
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
  jsdoc.on('error', function(data) {
    future.return(null);
  });

  // Listen for compiled jsdoc data
  jsdoc.on('message', function(data) {
    future.return(makeDocSource(data));
  });

  return future;
}


// Transform output data from jsdoc executable to a javascript string
// that we can use in the client application to build a documentation view.
var makeDocSource = function(data) {

  // Docs to JSON
  var docTree     =  JSON.stringify(data.docTree);
  var names       =  JSON.stringify(data.docNames, null, 2);

  // JSON to javascript string
  var jsDocTree   =  "DocsPackage.addDocTree("+docTree+");\n";
  var jsNames     =  "DocsPackage.addDocNames("+names+");\n";

  // Doc source
  return jsNames + jsDocTree;
}


// Register compilation step for .jsdoc file extension
Plugin.registerSourceHandler("jsdoc", sourceHandler);



