/*global require: true */
(function () {
  'use strict';

  var path = require('path');
  var fs = require('jsdoc/fs');
  var helper = require('jsdoc/util/templateHelper');

  var root = path.dirname(process.mainModule.filename);
  var _ = require(path.join(root, 'node_modules/underscore'));

  var names = [];

  /**
   * Get a tag dictionary from the tags field on the object, for custom fields
   * like package
   * @param  {JSDocData} data The thing you get in the TaffyDB from JSDoc
   * @return {Object}      Keys are the parameter names, values are the values.
   */
  var getTagDict = function (data) {
    var tagDict = {};

    if (data.tags) {
      _.each(data.tags, function (tag) {
        tagDict[tag.title] = tag.value;
      });
    }

    return tagDict;
  };

  var addToTree = function (root, location, data) {
    var path = location.split(".");

    _.each(path, function (segment) {
      if (! (segment in root)) {
        root[segment] = {};
      }

      root = root[segment];
    });

    for (var prop in data) {
      if (data.hasOwnProperty(prop)) {
        root[prop] = data[prop];
      }
    }

    root.comment = undefined;
    root.meta = undefined;
    root.___id = undefined;
    root.___s = undefined;
    root.tags = undefined;

    _.extend(root, getTagDict(data));
    names.push(location);
  };

  /**
    @param {TAFFY} taffyData See <http://taffydb.com/>.
    @param {object} opts
    @param {Tutorial} tutorials
   */
  exports.publish = function(taffyData) {
    var data = helper.prune(taffyData);
    var docTree = {};

    var namespaces = helper.find(data, {kind: "namespace"});

    // prepare all of the namespaces
    _.each(namespaces, function (namespace) {
      if (namespace.summary) {
        addToTree(docTree, namespace.longname, namespace);
      }
    });

    var properties = helper.find(data, {kind: "member"});

    _.each(properties, function (property) {
      if (property.summary) {
        addToTree(docTree, property.longname, property);
      }
    });

    var functions = helper.find(data, {kind: "function"});
    var constructors = helper.find(data, {kind: "class"});

    // we want to do all of the same transformations to classes and functions
    functions = functions.concat(constructors);

    // insert all of the function data into the namespaces
    _.each(functions, function (func) {
      if (! func.summary) {
        // we use the @summary tag to indicate that an item is documented
        return;
      }

      func.options = [];
      var filteredParams = [];

      _.each(func.params, function (param) {
        param.name = param.name.replace(/,|\|/g, ", ");

        var splitName = param.name.split(".");

        if (splitName.length < 2 || splitName[0] !== "options") {
          // not an option
          filteredParams.push(param);
          return;
        }

        param.name = splitName[1];

        func.options.push(param);
      });

      func.params = filteredParams;

      // takes up too much room
      delete func.comment;

      addToTree(docTree, func.longname, func);
    });

    // output docs to parent process
    process.send({
      docTree: docTree,
      docNames: names.sort()
    });
  };
})();
