var path = Npm.require('path');
var jsdoc = Npm.require('jsdoc-meteor');
var Future = Npm.require('fibers/future');



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


// Compile as '.jsdoc' file using the jsdoc executable
var compileJSDoc = function(compileStep) {
  var future = new Future;

  // Compile using jsdoc 
  compiler = jsdoc(compileStep.fullInputPath, function(err, data) {
    future.return(err ? null : makeDocSource(data));
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



