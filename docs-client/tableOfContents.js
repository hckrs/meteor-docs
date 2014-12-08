

Template.nav.helpers({
  sections: function () {
    var ret = [];
    var walk = function (items, depth) {
      _.each(items, function (item) {
        // Work around (eg) accidental trailing commas leading to spurious holes
        // in IE8.
        if (!item)
          return;
        if (item instanceof Array) {
          walk(item, depth + 1);
          if (depth === 2)
            ret.push({type: 'spacer', depth: 2});
        }
        else {
          if (typeof(item) === "string")
            item = {name: item};
          ret.push(_.extend({
            type: "section",
            depth: depth,
            id: item.name.replace(/[.#]/g, "-"),
          }, item));
        }
      });
    };
    
    var groupByNamespace = function(name) {
      return name.split('.')[0];
    }
    var listNamespace = function(functions, namespace) { 
      return [namespace, functions]; 
    }

    var namespaces = _.groupBy(Docs.getDocNames(), groupByNamespace);
    var toc = _.chain(namespaces).map(listNamespace).flatten(true).value();
    
    walk(['Docs', toc], 1);
    return ret;
  },

  type: function (what) {
    return this.type === what;
  },
});

Template.nav_section.helpers({
  depthIs: function (n) {
    return this.depth === n;
  }
});