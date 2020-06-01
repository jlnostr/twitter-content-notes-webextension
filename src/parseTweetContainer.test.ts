import { combineContentNotes, getKeywords } from "./parseTweetContainer";

test("content notes are combined", () => {
	const input = ["first", "second"];
	const result = combineContentNotes(input);

	expect(result).toBe("first, second");
});

describe.each([
	[["test", "test"], "test"],
	[["racism, police", "police"], "racism, police"],
	[["my test", "another test"], "my test, another test"],
	[["my test", "my test"], "my test"],
])("duplicates", (input, expectedOutput) => {
	test("are removed", () => {
		expect(combineContentNotes(input)).toBe(expectedOutput);
	});
});

describe.each([
	["test", ["test"]],
	["racism, police", ["racism", "police"]],
	["racism,      police", ["racism", "police"]],
])("export contains valid", (input, expectedOutput) => {
	const result = getKeywords(input);
	expect(result).toStrictEqual(expectedOutput);
});
