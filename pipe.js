const EOF = require('./const').EOF
;

var helpers = require('./helpers'),
    isFunc = helpers.isFunc,
    isValue = helpers.isValue
;

// breadth
// function getLeaves(doc) {
//   var leaves = [],
//       current = [doc.body],
//       next = []
//   ;
// 
//   while (current.length !== 0) {
//     for (var i = 0; i < current.length; i++) {
//       var node = current[i];
//       var children = Array.prototype.slice.apply(node.children);
// 
//       if (children.length) {
//         next = next.concat(children);
//       } else {
//         leaves.push(node);
//       }
//     }
//     current = next;
//     next = [];
//   }
// 
//   return leaves;
// }

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
      depths = getDepths(document),
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
            console.log('matched');
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
// 
// 
//   while (current.length !== 0) {
//     for (var i = 0; i < current.length; i++) {
//       node = current[i];
//       nodeId = idForEl(node);
// 
//       if (!visited[nodeId]) {
//         visited[nodeId] = true;
//         if (!foundInChild[nodeId]) {
//           match = node.textContent.match(re);
//           if (match) {
//             parent = node;
//             do {
//               parent = parent.parentElement;
//               if (parent !== null) {
//                 parentId = idForEl(parent);
//                 if (foundInChild[parentId]) {
//                   break;
//                 }
//                 foundInChild[parentId] = true;
//               }
//             } while(parent !== doc && parent !== null);
// 
//             //while(node.nodeName === '#text' && node.parentElement !== null) {
//               //node = node.parentElement;
//             //}
// 
//             found.push(node);
//           } else {
//             parent = node.parentElement;
//             parentId = idForEl(parent);
//             if (parent && !inNext[parentId]) {
//               next.push(parent);
//               inNext[parentId] = true;
//             }
//           }
//         }
//       }
//     }
// 
//     current = next;
//     next = [];
//   }
// 
//   return found;
// }

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
