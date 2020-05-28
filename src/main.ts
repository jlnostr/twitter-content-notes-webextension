import TweetInformation from "./models/TweetInformation";

function test() {
    var tweets = document.getElementsByTagName("article");
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        if (tweet.hasAttribute("data-cn-warning"))
            continue;

        const parsed = parseTweetContainer(tweet);
        if (parsed == null || !parsed.hasContentNote) {
            continue;
        }

        tweet.setAttribute("data-cn-warning", "");

        let hidden = true;
        parsed.containers.forEach((c: HTMLElement) => c.style.display = "none");

        let showBtn = document.createElement("button");
        showBtn.style.marginBottom = "1em";
        showBtn.style.padding = ".5em";
        showBtn.innerText = parsed.contentNote;
        showBtn.onclick = () => {
            if (hidden) {
                parsed.containers.forEach((c: HTMLElement) => c.style.display = "block");
            } else {
                parsed.containers.forEach((c: HTMLElement) => c.style.display = "none");
            }
            hidden = !hidden;
        }

        var firstContainer = parsed.containers[0];
        firstContainer.parentElement.insertBefore(showBtn, firstContainer);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    test();
})

function parseTweetContainer(node: HTMLElement): TweetInformation {
    var divs = node.getElementsByTagName("div");
    var contentContainer = null;
    var quotedContentContainer = null;

    for (var j = 0; j < divs.length; j++) {
        var tmp = divs[j];

        // Assume that the first div with the lang attribute is the content
        // TODO: What happens if quoted retweets has CN?
        if (tmp.hasAttribute("lang") && contentContainer == null) {
            contentContainer = tmp;
        }

        if (tmp.hasAttribute("role") && tmp.attributes["role"].value == "blockquote") {
            quotedContentContainer = tmp;
        }
    }

    if (contentContainer == null) return;


    // CN/CW: <content>
    const contentNotesPattern = /[Cc][WwNn]:?\s+?([\S ]+)/;
    var hasContentNote = contentNotesPattern.test(contentContainer.innerText);

    if (!hasContentNote) return;

    var result = new TweetInformation();
    result.containers.push(contentContainer)

    if (quotedContentContainer != null)
        result.containers.push(quotedContentContainer);

    result.hasContentNote = hasContentNote;

    var match = contentNotesPattern.exec(contentContainer.innerText)
    contentContainer.innerText = (<string>contentContainer.innerText).replace(match[0], "").trim();
    result.contentNote = match[1];

    return result;
}