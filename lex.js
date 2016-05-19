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

// an enumeration of type constants
var eni = 0,
		TYPE = {
			value:							eni++,
			stringExpansion:		eni++,
			stringRaw:					eni++,
			pipe:								eni++,
			directExpansion:		eni++,
			indirectExpansion:	eni++,

			invalid: {
				value:							eni++,
				stringExpansion:		eni++,
				stringRaw:					eni++,
				indirectExpansion:	eni++
			}
		}
;

var TYPE_INT_MAP = {
	VALUE:											TYPE.value,
	STRING_EXPANSION:						TYPE.stringExpansion,
	STRING_RAW:									TYPE.stringRaw,
	PIPE:												TYPE.pipe,
	INVALID_VALUE:							TYPE.invalid.value,
	INVALID_STRING_EXPANSION:		TYPE.invalid.stringExpansion,
	INVALID_STRING_RAW:					TYPE.invalid.stringRaw
};

var INT_TYPE_MAP = Object.keys(TYPE_INT_MAP)
		.reduce((map, k) => {
			map[TYPE_INT_MAP[k]] = k;
			return map;
		}, {})
;

var ttoi = (t) => TYPE_INT_MAP[t];
var itot = (i) => INT_TYPE_MAP[i];

// regex to match individual characters
var RE_EXPANSION = /\$/,
		RE_IDENTIFIER = /\w/,
		RE_CURLY_OPEN = /\{/,
		RE_CURLY_CLOSE = /\}/,
		RE_PAREN_OPEN = /\(/,
		RE_PAREN_CLOSE = /\)/,
		RE_VALUE = /[^\s\$\|'"]/,
		RE_SPACE = /\s/,
		RE_ESCAPE = /\\/,
		RE_STRING_EXPANSION = /"/,
		RE_STRING_RAW = /'/,
		RE_PIPE = /\|/
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
	var debug=0;
	main:
	while (true) {
		if (cursor >= len) { break main; }

		if (input[cursor].match(RE_SPACE)) {
			cursor++;
			continue main;
		}

		// Value
		if (input[cursor].match(RE_VALUE)) {
			subcursor = cursor + 1;

			value:
			while (true) {
				if (subcursor >= len) {
					token = Token(
						TYPE.value,
						input.substring(cursor, subcursor)
					);

					tokens.push(token);
					break main;
				}

				if (!input[subcursor].match(RE_VALUE)) {
					if (input[subcursor].match(RE_SPACE)) {
						token = Token(
							TYPE.value,
							input.substring(cursor, subcursor)
						);
					} else {
						token = Token(
							TYPE.invalid.value,
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
		if (input[cursor].match(RE_STRING_EXPANSION)) {
			subcursor = cursor + 1;

			stringExpansion:
			while (true) {
				if (subcursor >= len) {
					token = Token(
						TYPE.invalid.stringExpansion,
						input.substring(cursor, subcursor)
					);

					tokens.push(token);
					break main;
				}

				if (input[subcursor].match(RE_ESCAPE)) {
					subcursor += 2;
					continue stringExpansion;
				}

				if (input[subcursor].match(RE_STRING_EXPANSION)) {
					subcursor++;
					token = Token(
						TYPE.stringExpansion,
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
		if (input[cursor].match(RE_STRING_RAW)) {
			subcursor = cursor + 1;

			stringRaw:
			while (true) {
				if (subcursor >= len) {
					token = Token(
						TYPE.invalid.stringRaw,
						input.substring(cursor, subcursor)
					);

					tokens.push(token);
					break main;
				}

				if (input[subcursor].match(RE_ESCAPE)) {
					subcursor += 2;
					continue stringRaw;
				}

				if (input[subcursor].match(RE_STRING_RAW)) {
					subcursor++;
					token = Token(
						TYPE.stringRaw,
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
		if (input[cursor].match(RE_PIPE)) {
			token = Token(
				TYPE.pipe,
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
