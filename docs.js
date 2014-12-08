var _docTree = {}
  , _docNames = [];


Docs = {};

Docs.addDocTree = function(docTree) {
  _.deepExtend(_docTree, docTree);
}

Docs.getDocTree = function() {
  return _docTree; 
}

Docs.addDocNames = function(docNames) {
  _.each(docNames, Docs.addDocName);
}

Docs.addDocName = function(docName) {
  _docNames.push(docName);
}

Docs.getDocNames = function() {
  return _docNames; 
}