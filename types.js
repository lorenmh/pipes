// type enumerator (see 'TYPE' below)
var te = 0;

var TYPE = {
  VALUE:                      te++,
  STRING_EXPANSION:           te++,
  STRING_RAW:                 te++,
  PIPE:                       te++,
  INVALID_VALUE:              te++,
  INVALID_STRING_EXPANSION:   te++,
  INVALID_STRING_RAW:         te++
};

var INT_TYPE_MAP = Object.keys(TYPE)
    .reduce((map, k) => {
      map[TYPE[k]] = k;
      return map;
    }, {})
;

var ttoi = (t) => TYPE[t];
var itot = (i) => INT_TYPE_MAP[i];

module.exports = { TYPE, INT_TYPE_MAP, ttoi, itot };
