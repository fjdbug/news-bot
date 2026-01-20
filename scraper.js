const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeTweets(username) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.goto(`https://twitter.com/${username}`, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for tweets to load
        // Twitter (X) class names are dynamic and obfuscated. We often look for article tags.
        // This selector might need adjustment if Twitter updates their UI.
        await page.waitForSelector('article', { timeout: 15000 });

        const tweets = await page.evaluate(() => {
            const tweetElements = document.querySelectorAll('article');
            const results = [];

            // Scrape the top 5 tweets to ensure we catch the latest one, even if pinned tweets exist
            // We will sort by timestamp later to find the true latest.
            for (let i = 0; i < Math.min(tweetElements.length, 5); i++) {
                const el = tweetElements[i];

                const textEl = el.querySelector('[data-testid="tweetText"]');
                const timeEl = el.querySelector('time');

                if (textEl && timeEl) {
                    const text = textEl.innerText;
                    // Twitter timestamps are ISO strings, easily sortable
                    const time = timeEl.getAttribute('datetime');

                    const links = Array.from(el.querySelectorAll('a'));
                    const statusLink = links.find(a => a.href.includes('/status/'));
                    const permalink = statusLink ? statusLink.href : '';
                    const id = permalink.split('/').pop();

                    results.push({
                        id,
                        text,
                        url: permalink,
                        timestamp: time
                    });
                }
            }
            return results;
        });

        await browser.close();

        // sort by timestamp descending (Newest first)
        // This automatically handles Pinned tweets (which are usually older) vs New tweets
        const sortedTweets = tweets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (sortedTweets.length > 0) {
            console.log(`[Scraper] Top tweet for ${username}: ${sortedTweets[0].timestamp} (ID: ${sortedTweets[0].id})`);
            console.log(`[Scraper] Text snippet: ${sortedTweets[0].text.substring(0, 50)}...`);
        }

        return sortedTweets;

    } catch (error) {
        console.error(`Error scraping ${username}:`, error.message);
        await browser.close();
        return [];
    }
}

module.exports = { scrapeTweets };
