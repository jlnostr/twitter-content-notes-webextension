import { ALREADY_PARSED_ATTRIBUTE_NAME, CONTENT_NOTE_REGEX } from "../constants";
import TweetInformation from "../models/TweetInformation";

export default class TweetContainer {
	private __root: HTMLElement;
	private __container: HTMLElement;
	private __information: TweetInformation;

	/**
	 * Creates a new TweetContainer for the given HTML element.
	 */
	constructor(root: HTMLElement) {
		this.__root = root;
	}

	/** Returns the information about this tweet. */
	get information(): TweetInformation {
		return this.__information;
	}

	/** Returns the visibility status of the tweet. */
	get isVisible(): boolean {
		return this.__container.style.display === "block";
	}

	/** Sets the visibility status of the tweet. */
	set isVisible(value: boolean) {
		this.__container.style.display = value ? "block" : "none";
	}

	/** Inverts the visibility. */
	switchVisibility(): void {
		this.isVisible = !this.isVisible;
	}

	/** Returns the processing state of the tweet. True if processed. */
	get isProcessed(): boolean {
		return this.__root.attributes[ALREADY_PARSED_ATTRIBUTE_NAME] != null;
	}

	/** Sets the container as processed. */
	private markAsProcessed(): void {
		this.__root.attributes[ALREADY_PARSED_ATTRIBUTE_NAME] = "parsed";
	}

	/**
	 * Parse the container.
	 *
	 * @returns The tweet information.
	 */
	parseInformation(): TweetInformation {
		const divs = this.__root.getElementsByTagName("div");

		// HTML elements that could have texts, and therefore content notes
		const textContainers: HTMLElement[] = [];

		for (let j = 0; j < divs.length; j++) {
			const t = divs[j];

			/**
			 * Explanation: Every tweet in the timeline contains the "lang" attribute. This applies to regular tweets as well
			 * as the tweet of a quoted retweet. So "hi there" is a separate div from "Check out this content <link to another tweet>".
			 * In the latter, there will be two content containers.
			 *
			 * In case of direct tweet pages, like https://twitter.com/user/status/id, this attribute is not always given.
			 * The dir attribute is used as a fallback in this case.
			 */
			if (t.hasAttribute("lang") || (t.hasAttribute("dir") && t.attributes["dir"].value == "auto")) {
				textContainers.push(t);
			}

			// The <div> with the role="group" attribute contains the counters for
			// likes and retweets. The parent element is the whole tweet.
			if (t.hasAttribute("role") && t.attributes["role"].value == "group") {
				this.__container = t.parentElement;
				break;
			}
		}

		// should not happen, but if it does, simply return
		if (textContainers.length == 0 || this.__container == null) return;

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
		result.hasContentNote = hasContentNote;
		result.contentNote = this.combineContentNotes(contentNotes);

		this.__information = result;
		this.markAsProcessed();
		return result;
	}

	/**
	 * Insert a element before the tweet content.
	 * @param el The element
	 */
	insertBeforeContent(el: HTMLElement): void {
		this.__container.parentElement.insertBefore(el, this.__container);
	}

	/**
	 * Combine multiple content notes to a comma-separated string and remove duplicates.
	 *
	 * @param contentNotes The content notes
	 */
	public combineContentNotes(contentNotes: string[]): string {
		// By using a set we automatically remove duplicate entries.
		// See also: https://www.samanthaming.com/tidbits/10-remove-array-duplicates-using-set/
		const unique = [...new Set(contentNotes)];

		// If there is just one entry left, return
		if (unique.length == 1) return unique[0];

		// If there is still more than one entry, pin the first and compare the following entries with that.
		// The keywords need to be split by a comma to avoid false positive.
		//
		// So, "CN foo, bar" assumes two keywords, while "CN foo bar" assumes just one keyword ("foo bar").
		const allKeywords = this.getUniqueContentNotes(unique[0]);

		for (let i = 1; i < unique.length; i++) {
			const compare = this.getUniqueContentNotes(unique[i]);

			compare.forEach((k) => {
				// Check if keyword is already in array, otherwise push
				if (!allKeywords.includes(k)) allKeywords.push(k);
			});
		}

		return allKeywords.join(", ");
	}

	/**
	 * Returns unique content notes for a given input.
	 *
	 * @param input The input string
	 */
	public getUniqueContentNotes(input: string): string[] {
		const keywords = input.split(",");

		// Trim whitespace from keywords
		for (let i = 0; i < keywords.length; i++) {
			keywords[i] = keywords[i].trim();
		}

		return keywords;
	}
}
