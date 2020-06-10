import TweetContainer from "./TweetContainer";

test("content notes are combined", () => {
	const input = ["first", "second"];
	const sut = new TweetContainer(null);
	const result = sut.combineContentNotes(input);

	expect(result).toBe("first, second");
});

describe.each([
	[["test", "test"], "test"],
	[["racism, police", "police"], "racism, police"],
	[["my test", "another test"], "my test, another test"],
	[["my test", "my test"], "my test"],
])("duplicates", (input, expectedOutput) => {
	test("are removed", () => {
		const sut = new TweetContainer(null);
		expect(sut.combineContentNotes(input)).toBe(expectedOutput);
	});
});

describe.each([
	["test", ["test"]],
	["racism, police", ["racism", "police"]],
	["racism,      police", ["racism", "police"]],
])("export contains valid", (input, expectedOutput) => {
	const sut = new TweetContainer(null);

	const result = sut.getUniqueContentNotes(input);
	expect(result).toStrictEqual(expectedOutput);
});
