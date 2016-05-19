// regex to match individual characters
var RE = {
  EXPANSION: /\$/,
  IDENTIFIER: /\w/,
  CURLY_OPEN: /\{/,
  CURLY_CLOSE: /\}/,
  PAREN_OPEN: /\(/,
  PAREN_CLOSE: /\)/,
  VALUE: /[^\s\$\|'"]/,
  SPACE: /\s/,
  ESCAPE: /\\/,
  STRING_EXPANSION: /"/,
  STRING_RAW: /'/,
  PIPE: /\|/
};

module.exports = RE;
