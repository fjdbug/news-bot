const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.telegramToken, { polling: false });

async function sendBroadcast(message) {
    if (!config.telegramToken || !config.telegramChannelId) {
        console.error("Telegram Token or Channel ID missing.");
        return;
    }

    try {
        await bot.sendMessage(config.telegramChannelId, message);
        console.log(`Message sent to ${config.telegramChannelId}`);
    } catch (error) {
        console.error("Telegram Error:", error.message);
    }
}

module.exports = { sendBroadcast };
