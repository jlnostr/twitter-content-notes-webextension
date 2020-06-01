import TweetInformation from "./models/TweetInformation";
import { CONTENT_NOTE_REGEX } from "./constants";

export function parseTweetContainer(node: HTMLElement): TweetInformation {
	const divs = node.getElementsByTagName("div");

	// HTML elements that could have texts, and therefore content notes
	const textContainers: HTMLElement[] = [];

	// The final element that should be hidden.
	let elemToHide: HTMLElement = null;

	for (let j = 0; j < divs.length; j++) {
		const t = divs[j];

		/**
		 * Explanation: Every tweet contains the "lang" attribute. This applies to regular tweets as well
		 * as the tweet of a quoted retweet. So "hi there" is a separate div from "Check out this content <link to another tweet>".
		 * In the latter, there will be two content containers.
		 */
		if (t.hasAttribute("lang")) {
			textContainers.push(t);
		}

		// The <div> with the role="group" attribute contains the counters for
		// likes and retweets. The parent element is the whole tweet.
		if (t.hasAttribute("role") && t.attributes["role"].value == "group") {
			elemToHide = t.parentElement;
			break;
		}
	}

	// should not happen, but if it does, simply return
	if (textContainers.length == 0 || elemToHide == null) return;

	// find out, if the tweet contains a content note
	let hasContentNote = false;
	textContainers.forEach((c) => {
		if (hasContentNote) return;

		hasContentNote = CONTENT_NOTE_REGEX.test(c.innerText);
	});

	// If tweet has no content notes/warnings, return
	if (!hasContentNote) return;

	// Combine all content notes into a single string
	const contentNotes: string[] = [];

	textContainers.forEach((c) => {
		const match = CONTENT_NOTE_REGEX.exec(c.innerText);
		if (match == null) return;

		contentNotes.push(match[1]);
	});

	// Build the result
	const result = new TweetInformation();
	result.container = elemToHide;
	result.hasContentNote = hasContentNote;
	result.contentNote = contentNotes.join("; ");
	return result;
}
