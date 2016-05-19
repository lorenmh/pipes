var types = require('./types'),
    TYPE = types.TYPE,
    itot = types.itot,
    Token = require('./token'),
    RE = require('./re')
;

/**
 * Parses strings and returns an array of tokens.
 * COMMAND [OPTIONS] [PIPE]
 * @param {String} input - the string to be parsed
 */
function lex(input) {
  var cursor = 0, // start index
      len = input.length,
      tokens = [],
      token, subcursor
  ;

  // finite state machine
  main:
  while (true) {
    if (cursor >= len) { break main; }

    if (input[cursor].match(RE.SPACE)) {
      cursor++;
      continue main;
    }

    // Value
    if (input[cursor].match(RE.VALUE)) {
      subcursor = cursor + 1;

      value:
      while (true) {
        if (subcursor >= len) {
          token = Token(
            TYPE.VALUE,
            input.substring(cursor, subcursor)
          );

          tokens.push(token);
          break main;
        }

        if (!input[subcursor].match(RE.VALUE)) {
          if (input[subcursor].match(RE.SPACE)) {
            token = Token(
              TYPE.VALUE,
              input.substring(cursor, subcursor)
            );
          } else {
            token = Token(
              TYPE.INVALID_VALUE,
              input.substring(cursor, subcursor)
            );
          }
          tokens.push(token);
          cursor = subcursor + 1;
          continue main;
        }

        subcursor++;
      }

    }

    // String expansion
    if (input[cursor].match(RE.STRING_EXPANSION)) {
      subcursor = cursor + 1;

      stringExpansion:
      while (true) {
        if (subcursor >= len) {
          token = Token(
            TYPE.INVALID_STRING_EXPANSION,
            input.substring(cursor, subcursor)
          );

          tokens.push(token);
          break main;
        }

        if (input[subcursor].match(RE.ESCAPE)) {
          subcursor += 2;
          continue stringExpansion;
        }

        if (input[subcursor].match(RE.STRING_EXPANSION)) {
          subcursor++;
          token = Token(
            TYPE.STRING_EXPANSION,
            input.substring(cursor, subcursor)
          );

          tokens.push(token);

          cursor = subcursor;
          continue main;
        }

        subcursor++;
      }

    }

    // String raw
    if (input[cursor].match(RE.STRING_RAW)) {
      subcursor = cursor + 1;

      stringRaw:
      while (true) {
        if (subcursor >= len) {
          token = Token(
            TYPE.INVALID_STRING_RAW,
            input.substring(cursor, subcursor)
          );

          tokens.push(token);
          break main;
        }

        if (input[subcursor].match(RE.ESCAPE)) {
          subcursor += 2;
          continue stringRaw;
        }

        if (input[subcursor].match(RE.STRING_RAW)) {
          subcursor++;
          token = Token(
            TYPE.STRING_RAW,
            input.substring(cursor, subcursor)
          );

          tokens.push(token);

          cursor = subcursor;
          continue main;
        }

        subcursor++;
      }

    }

    // Pipe
    if (input[cursor].match(RE.PIPE)) {
      token = Token(
        TYPE.PIPE,
        input.substring(cursor, cursor + 1)
      );

      tokens.push(token);

      cursor++;

      continue main;
    }
  }
  return tokens;
}

var str = "re 'COEN\d{3}' | fmt 'Santa Clara University {{0}}' | google-url | nt";
var lexed = lex(str);

lexed.map((t) => { t.type = itot(t.type); return t; });

console.log(lexed);
