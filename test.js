var EOF = {};

function isFunc(v) {
  return typeof(v) === 'function';
}

function isValue(v) {
  return !(v === undefined || v === null);
}

var id = (function() {
  var index = 0;
  return function idForEl(el) {
    if (el.$$searchId$$ === undefined) {
      return (el.$$searchId$$ = index++);
    } else {
      return el.$$searchId$$;
    }
  };
})();

function Depth() {
  this.exists = {};
  this.nodes = [];
}

Depth.factory = function DepthFactory() {
  return new Depth();
};

Depth.prototype.insert = function insert(n) {
  if (!n) { return; }

  var nodeId = id(n);

  if (!this.exists[nodeId]) {
    this.exists[nodeId] = true;
    this.nodes.push(n);
  }
};

function getDepths(doc) {
  var depths = [],
      current = [doc],
      next = [],
      node, children, nodeId
  ;

  var depth = 0;
  while (current.length !== 0) {
    depths[depth] = Depth.factory();

    for (var i = 0; i < current.length; i++) {
      node = current[i];
      children = Array.prototype.slice.apply(node.children);

      if (children.length) {
        next = next.concat(children);
      } else {
        depths[depth].insert(node);
      }
    }
    current = next;
    next = [];
    depth++;
  }

  return depths;
}

function searchDocument(doc, re, output, error) {
  var visited = {},
      foundInChild = {},
      found = [],
      depths = getDepths(doc),
      depth, node, nodeId, match, parent, parentId, parentDepth
  ;
  for (var i = depths.length - 1; i >= 0; i--) {
    depth = depths[i];
    for (var j = 0; j < depth.nodes.length; j++) {
      node = depth.nodes[j];
      nodeId = id(node);

      if (!visited[nodeId]) {
        visited[nodeId] = true;
        if (!foundInChild[nodeId]) {
          match = node.textContent.match(re);
          if (match) {
            parent = node;
            while (parent.parentElement) {
              parent = parent.parentElement;
              parentId = id(parent);
              if (foundInChild[parentId]) {
                break;
              }
              foundInChild[parentId] = true;
            }
            found.push(node);
          } else {
            parentDepth = i - 1;
            if (parentDepth >= 0) {
              parent = node.parentElement;
              depths[parentDepth].insert(parent);
            }
          }
        }
      }
    }
  }

  return found;
}

// A command looks like:
var tre = function(io) {
  // var io = {
  //   input: null,
  //   output: output,
  //   error: error,
  //   commandError: commandError
  //   start: start,
  //   document: null
  // }
  var re = new RegExp(io.args[0]);

  io.exec(function execute() {
    if (io.input) {
      io.input(function(buffer) {
        var i, value, match
        ;

        if (io.finished) { return; }
        if (buffer === EOF) { return (io.finished = true); }

        for (i = 0; i < buffer.length; i++) {
          value = buffer[i];
          if (isValue(value)) {
            match = String(value).match(re);
            if (match) {
              io.output(match);
            }
          }
        }
      });
    } else {
      var nodes, i, node, match
      ;

      nodes = searchDocument(io.document, re);
      for (i = 0; i < nodes.length; i++) {
        node = nodes[i];
        match = node.textContent.match(re);
        if (match) {
          io.output(match);
        }
      }
    }
  });
};

p = {
  exec: function(fn) { window.exec = fn; },
  input: null,
  output: console.log.bind(console),
  finished: false,
  args: ['All'],
  document: document
}

tre(p);