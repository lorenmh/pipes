const EOF = require('./const').EOF
;

var helpers = require('./helpers'),
    isFunc = helpers.isFunc,
    isValue = helpers.isValue
;

// breadth
var l = [];
function getLeaves(doc) {
  var leaves = [],
      current = [doc.body],
      next = []
  ;

  while (current.length !== 0) {
    for (var i = 0; i < current.length; i++) {
      var node = current[i];
      var children = Array.prototype.slice.apply(node.children);

      if (children.length) {
        next = next.concat(children);
      } else {
        leaves.push(node);
      }
    }
    current = next;
    next = [];
  }

  return leaves;
}

function searchDocument(doc, re, output, error) {
  var visited = {},
      foundInChild = {},
      found = []
  ;

  var current = getLeaves(doc);
  var next = [];
  var inNext = {};
  var node, match, parent;

  while (current.length !== 0) {
    for (var i = 0; i < current.length; i++) {
      node = current[i];
      if (!visited[node]) {
        visited[node] = true;
        if (!foundInChild[node]) {
          match = node.textContent.match(re);
          if (match) {
            found.push(node);
            parent = node;
            do {
              parent = parent.parentElement;
              if (foundInChild[parent]) {
                break;
              }
              foundInChild[parent] = true;
            } while(parent !== doc && parent !== null);
          } else {
            parent = node.parentElement;
            if (!inNext[parent] && parent) {
              next.push(parent);
              inNext[parent] = true;
            }
          }
        }
      }
    }

    current = next;
    next = [];
  }

  return found;
}

// A command looks like:
var tre = function(io, args) {
  // var io = {
  //   input: null,
  //   output: output,
  //   error: error,
  //   commandError: commandError
  //   start: start,
  //   doc: null
  // }

  var re = new RegExp(args[0]);

  io.execute = function execute() {
    function fn(v) {
      v = String(v);

      if (v.match(re)) {
        io.write(v);
      }
    }

//     if (isFunc(io.input)) {
//       input = io.input();
//       
//       if isValue(input) {
//         fn(v);
//       }
//     } else {
//       io.document
//     }
  };

};
