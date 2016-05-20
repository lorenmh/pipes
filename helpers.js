function isFunc(v) {
  return typeof(v) === 'function';
}

function isValue(v) {
  return !(v === undefined || v === null);
}

module.exports = { isFunc, isValue };
