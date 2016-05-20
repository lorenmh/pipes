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

function idGenerator() {
  var index = 0;

  return function idForEl(el) {
    if (el.$$searchId$$ === undefined) {
      return (el.$$searchId$$ = index++);
    } else {
      return el.$$searchId$$;
    }
  };
}

var visited, foundInChild = {}, found = [], current, next, inNext
function searchDocument(doc, re, output, error) {
  visited = {}
  foundInChild = {}
  found = []
  

  current = getLeaves(doc);
  next = [];
  inNext = {};
  var node, nodeId, match, parent, parentId;

  var idForEl = idGenerator();

  while (current.length !== 0) {
    for (var i = 0; i < current.length; i++) {
      node = current[i];
      nodeId = idForEl(node);

      if (!visited[nodeId]) {
        visited[nodeId] = true;
        if (!foundInChild[nodeId]) {
          match = node.textContent.match(re);
          if (match) {
            parent = node;
            do {
              parent = parent.parentElement;
              if (parent !== null) {
                parentId = idForEl(parent);
                if (foundInChild[parentId]) {
                  break;
                }
                foundInChild[parentId] = true;
              }
            } while(parent !== doc && parent !== null);

            //while(node.nodeName === '#text' && node.parentElement !== null) {
              //node = node.parentElement;
            //}

            found.push(node);
          } else {
            parent = node.parentElement;
            parentId = idForEl(parent);
            if (parent && !inNext[parentId]) {
              next.push(parent);
              inNext[parentId] = true;
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
