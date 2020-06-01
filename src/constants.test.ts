import { CONTENT_NOTE_REGEX } from "./constants";

describe.each([
	// Regular
	["CN test", "test"],
	["CW test", "test"],
	["TW test", "test"],
	["cn test", "test"],
	["cw test", "test"],
	["tw test", "test"],

	// With colon
	["CN: test", "test"],
	["CW: test", "test"],
	["TW: test", "test"],

	// With hashtags
	["CN #test", "#test"],

	// With separators
	["CN #test #test", "#test #test"],
	["CN #test; #test", "#test; #test"],
	["CN #test, #test", "#test, #test"],
])("'%s' has note '%s'", (input, note) => {
	test(`returns ${note}`, () => {
		expect(input).toMatch(CONTENT_NOTE_REGEX);

		const result = CONTENT_NOTE_REGEX.exec(input)[1];
		expect(result).toBe(note);
	});
});

describe.each([
	// pattern in test
	["acn foo bar"],
	["btw this is a test"],
	["// CN something"],
])("'%s' does not match", (input) => {
	test("does not match", () => {
		expect(input).not.toMatch(CONTENT_NOTE_REGEX);
	});
});
