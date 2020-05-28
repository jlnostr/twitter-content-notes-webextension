import { ALREADY_PARSED_ATTRIBUTE_NAME } from "./constants";
import { parseTweetContainer } from "./parseTweetContainer";
import TweetInformation from "./models/TweetInformation";

export function findAndTagTweets() {
    var tweets = document.getElementsByTagName("article");

    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];

        // Skip already processed tweets
        if (tweet.hasAttribute(ALREADY_PARSED_ATTRIBUTE_NAME))
            continue;

        const tweetInfo = parseTweetContainer(tweet);

        // Skip invalid recognizations
        if (tweetInfo == null || !tweetInfo.hasContentNote) {
            continue;
        }

        // Mark the tweet as processed
        tweet.setAttribute(ALREADY_PARSED_ATTRIBUTE_NAME, "");

        // Hide all tweets behind a warning
        const btn = createButton(tweetInfo);

        var firstContainer = tweetInfo.containers[0];
        firstContainer.parentElement.insertBefore(btn, firstContainer);
    }
}

function createButton(tweet: TweetInformation): HTMLButtonElement {
    let isShown = false;
    let switchVisibility = () => {
        let displayValue = isShown ? "block" : "none";
        tweet.containers.forEach(c => c.style.display = displayValue);
        isShown = !isShown;
    }

    let btn = document.createElement("button");
    btn.style.marginBottom = "1em";
    btn.style.padding = ".5em";
    btn.innerText = tweet.contentNote;
    btn.onclick = switchVisibility;

    return btn;
}