const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'processed_tweets.json');

// Initialize DB (load JSON or create empty)
function initDb() {
    return new Promise((resolve) => {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify([]));
        }
        resolve();
    });
}

function getProcessedTweets() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveProcessedTweets(tweets) {
    fs.writeFileSync(dbPath, JSON.stringify(tweets, null, 2));
}

function isTweetProcessed(id) {
    return new Promise((resolve) => {
        const tweets = getProcessedTweets();
        resolve(tweets.includes(id));
    });
}

function markTweetAsProcessed(id) {
    return new Promise((resolve) => {
        const tweets = getProcessedTweets();
        if (!tweets.includes(id)) {
            tweets.push(id);
            // Keep file size manageable (keep last 1000 IDs)
            if (tweets.length > 1000) {
                tweets.shift();
            }
            saveProcessedTweets(tweets);
        }
        resolve();
    });
}

module.exports = { initDb, isTweetProcessed, markTweetAsProcessed };
