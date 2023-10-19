import { ScrapedTweet } from "../models/scrapedTweet.models.";

export const getAllTweetDomElements = () : ScrapedTweet[] => {
    const scraped = <ScrapedTweet[]>[];
    const articles = document.querySelectorAll('[data-testid="tweet"]');

    if (!articles) {
        return null;
    }

    const user = <HTMLAnchorElement>document.querySelector('[data-testid="AppTabBar_Profile_Link"]');
    const userHandle = '@' + user.href.split('/')[3]

    articles.forEach(async article => {

        const content = <HTMLElement>article.querySelector('[data-testid="tweet"] [data-testid="tweetText"]');
        const user = article.querySelector('[data-testid="tweet"] [data-testid="User-Name"]');

        const spans = user.querySelectorAll('span');
        let username = ""
        for (let i = 0; i < spans.length; i++) {
            if (spans[i].innerText.startsWith("@")) {
                username = spans[i].innerText || "";
                break;
            }
        }

        if (userHandle == username) {
            return;
        }

        const tweetRef = article.querySelectorAll('[id="generated-reply"]');

        if (tweetRef.length > 0) {
            return;
        }

        if (content == undefined) {
            return;
        }

        const allRefs = user.querySelectorAll('a');
        if (allRefs.length < 3) {
            return;
        }

        const ref = allRefs[2].getAttribute('href');
        const tweetId = ref.split('/')[3];

        scraped.push({
            tweetId: tweetId,
            contentText: content.innerText,
            contentEl: content,
            userHandle: username
        });
    });

    return scraped;
} 