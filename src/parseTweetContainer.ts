import TweetInformation from "./models/TweetInformation";
import { CONTENT_NOTE_REGEX } from "./constants";

export function parseTweetContainer(node: HTMLElement): TweetInformation {
    const divs = node.getElementsByTagName("div");
    const anchors = node.getElementsByTagName("a");

    // HTML elements that could have texts, and therefore content notes
    let contentContainers: HTMLElement[] = [];

    // HTML elements that only show images/videos and need to be hidden
    let mediaContainers: HTMLElement[] = [];

    for (let j = 0; j < divs.length; j++) {
        const t = divs[j];

        /**
         * Explanation: Every tweet contains the "lang" attribute. This applies to regular tweets as well
         * as the tweet of a quoted retweet. So "hi there" is a separate div from "Check out this content <link to another tweet>".
         * In the latter, there will be two content containers.
         */
        if (t.hasAttribute("lang")) {
            contentContainers.push(t);
        }

        // Applies to quoted media retweets
        if (t.hasAttribute("role") && t.attributes["role"].value == "blockquote") {
            mediaContainers.push(t);
        }
    }

    // should not happen, but if it does, simply return
    if (contentContainers.length == 0) return;

    // find out, if the tweet contains a content note
    let hasContentNote: boolean = false;
    contentContainers.forEach(c => {
        if (hasContentNote)
            return;

        hasContentNote = CONTENT_NOTE_REGEX.test(c.innerText);
    });

    // If tweet has no content notes/warnings, return
    if (!hasContentNote) return;

    // Combine all content notes into a single string
    let contentNotes: string[] = [];

    contentContainers.forEach(c => {
        const match = CONTENT_NOTE_REGEX.exec(c.innerText);
        if (match == null)
            return;

        contentNotes.push(match[1]);

        // TODO: Remove the CN line from the original tweet
        // c.innerText = (<string>c.innerText).replace(match[0], "").trim();
    });

    // Build the result
    let result = new TweetInformation();
    result.containers = [...contentContainers, ...mediaContainers];
    result.hasContentNote = hasContentNote;
    result.contentNote = contentNotes.join("; ");
    return result;
}
