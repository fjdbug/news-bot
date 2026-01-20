const cron = require('node-cron');
const config = require('./config');
const { scrapeTweets } = require('./scraper');
const { initDb, isTweetProcessed, markTweetAsProcessed } = require('./database');
const { summarizeTweet } = require('./ai');
const { sendBroadcast } = require('./telegram');

async function runJob() {
    console.log("Starting job...");

    for (const handle of config.twitterHandles) {
        console.log(`Checking ${handle}...`);
        // Remove '@' if present for URL construction in scraper
        const username = handle.replace('@', '');
        const tweets = await scrapeTweets(username);

        for (const tweet of tweets) {
            const isProcessed = await isTweetProcessed(tweet.id);
            if (!isProcessed) {
                console.log(`New tweet found from ${handle}: ${tweet.id}`);
                const summary = await summarizeTweet(tweet.text, tweet.url);
                await sendBroadcast(summary);
                await markTweetAsProcessed(tweet.id);
            } else {
                console.log(`Skipping ${tweet.id} from ${handle} (Already processed)`);
            }
        }
    }
    console.log("Job finished.");
}

async function main() {
    await initDb();

    // Check if running in "Once" mode (for GitHub Actions)
    const runOnce = process.argv.includes('--once') || process.env.GITHUB_ACTIONS;

    if (runOnce) {
        console.log("Running in single-execution mode for GitHub Actions...");
        await runJob();
        // Successful exit
        process.exit(0);
    } else {
        // Run immediately on startup
        await runJob();

        // Schedule every 10 minutes
        cron.schedule('*/10 * * * *', () => {
            runJob();
        });
    }
}

main();
