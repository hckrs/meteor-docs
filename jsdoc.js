// Write your package code here!

var compileDoc = function(compileStep) {
  var source = compileStep.read().toString('utf8');

  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(/.jsdoc$/i, '.js'),
    sourcePath: compileStep.inputPath,
    data: source
  });

  /*
  compileStep.addJavaScript({
    path: compileStep.inputPath.replace(/.jsdoc$/i, '.doc.js'),
    sourcePath: compileStep.inputPath,
    data: "console.log('doc');"
  });
  */
}


Plugin.registerSourceHandler("jsdoc", compileDoc);