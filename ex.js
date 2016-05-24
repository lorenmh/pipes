var io = {
  read: null, // returns an array of work to do
  write: null, // returns false if should sleep
  error: null,
  done: null,
  env: null,
  controller: null,
  document: null,
  pid: 0
};

function foo() {
}

var BLOCK_SIZE = 512;
function Buffer() {
  this.blocks       = [];
  this.blockWrite   = 0;
  this.blockRead    = 0;
  this.cursorWrite  = 0;
  this.cursorRead   = 0;
}

// resize if necessary
Buffer.prototype.read = function buf_read() {
  var indices = this.resizeAndGetIndices();

  return this.blocks[indices[0]][indices[1]];
};

//Buffer



function Process(controller) {
  return {
  };
}

function Kernel() {
  return {
    processes: {},
    // command = string name of command
    // env = object of env vars
    // upstream = pid of upstream process (to read from)
    // downstream = pid of downstream process
    exec: function(command, env, upstreamPid, downstreamPid) {}
  };
}

// example:
// function foo(io) {
//   function exec() {
//     while (io.continue) {
//       input = io.read();
// 
//       if (input % 2) {
//         io.write(input * 2);
//       }
//     }
//   }
// }
