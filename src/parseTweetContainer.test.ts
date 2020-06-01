import { combineContentNotes } from "./parseTweetContainer";

test("content notes are combined", () => {
	const input = ["first", "second"];
	const result = combineContentNotes(input);

	expect(result).toBe("first; second");
});
