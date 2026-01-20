require('dotenv').config();

module.exports = {
    telegramToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChannelId: process.env.TELEGRAM_CHANNEL_ID,
    openaiApiKey: process.env.OPENAI_API_KEY,
    twitterHandles: JSON.parse(process.env.TARGET_TWITTER_HANDLES || '[]')
};
