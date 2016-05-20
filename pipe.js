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

// function searchDocument(doc, output, error) {
//   var visited = {},
//       foundInChild = {}
//   ;
// 
//   for (var i
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
