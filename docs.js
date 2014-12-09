DocsPackage = {};

DocsPackage.addDocTree = function(docTree) {
  _docTree.set(_.deepExtendWithoutArrays(_docTree.get(), docTree));
}

DocsPackage.addDocNames = function(docNames) {
  _docNames.set(_.uniq(_docNames.get().concat(docNames)));
}

DocsPackage.getDocTree = function() {
  return _docTree.get(); 
}

DocsPackage.getDocNames = function() {
  return _docNames.get(); 
}



if (Meteor.isClient) {

  // Define local variables
  var _docTree = new ReactiveVar({})
    , _docNames = new ReactiveVar([]);

  // Fetch server documentation
  Meteor.call('DocsPackageGetServerDocs', function(err, data) {
    if (err) throw err;
    DocsPackage.addDocNames(data.docNames);
    DocsPackage.addDocTree(data.docTree);
  });
} 


if (Meteor.isServer) {

  // Simulate reactive-var interface
  var NonreactiveVar = function(initialValue) {
    var value = initialValue;
    this.get = function() { return value; };
    this.set = function(v) { value = v; return this; };
  }

  // Define local variables
  var _docTree = new NonreactiveVar({})
    , _docNames = new NonreactiveVar([]);

  // Serve server documentation to client  
  Meteor.methods({
    'DocsPackageGetServerDocs': function() {
      return {
        docNames: DocsPackage.getDocNames(), 
        docTree: DocsPackage.getDocTree()
      }
    }
  });
}


