import TweetContainer from "./elements/TweetContainer";

function attachButtonTo(tweet: TweetContainer): void {
	const btn = document.createElement("button");
	btn.style.marginBottom = "1em";
	btn.style.padding = ".5em";
	btn.style.fontFamily = "system-ui";
	btn.style.cursor = "pointer";
	btn.innerText = tweet.information.contentNote;
	btn.onclick = tweet.switchVisibility;

	tweet.isVisible = false;
	tweet.insertBeforeContent(btn);
}

// Select the node that will be observed for mutations
const targetNode = document.getElementById("react-root");
const observer = new MutationObserver(() => {
	const tweets = document.getElementsByTagName("article");

	for (let i = 0; i < tweets.length; i++) {
		const container = new TweetContainer(tweets[i]);

		if (container.isProcessed) continue;

		const tweetInfo = container.parseInformation();

		// Skip invalid recognizations
		if (tweetInfo == null || !tweetInfo.hasContentNote) continue;

		// Hide all tweets behind a warning
		attachButtonTo(container);
	}
});

// Start observing the target node for configured mutations
observer.observe(targetNode, {
	childList: true,
	subtree: true,
});
