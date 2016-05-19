/**
 * Returns an object corresponding to a token. Do NOT use 'new' on me!
 * @param {Number} type - an integer corresponding to the type of the token
 * @param {String} value - the string value of the token
 */
function Token(type, value) {
  return {
    type: type,
    value: value
  };
}

module.exports = Token;
