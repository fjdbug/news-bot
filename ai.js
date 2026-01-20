const OpenAI = require('openai');
const config = require('./config');

const openai = new OpenAI({
    apiKey: config.openaiApiKey,
});

async function summarizeTweet(text, url) {
    if (!config.openaiApiKey) {
        console.warn("OpenAI API Key is missing. Returning raw text.");
        return `${text}\n\nSource: ${url}`;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo
            messages: [
                {
                    role: "system",
                    content: `You are a news editor. Summarize the tweet into a concise, professional Telegram message following this exact template:

[Emoji] [Headline]
[Summary body text]

Source: [Link]

Example:
🚨 Shakeup in the House: Reform Party Gains Momentum!
Reform now holds 6 seats, with half originally elected as Conservatives, showcasing a significant political realignment. Could this spark new prediction markets?

Source: https://twitter.com/example/status/123456789`
                },
                {
                    role: "user",
                    content: `Tweet: ${text}\nLink: ${url}`
                }
            ],
            max_tokens: 150
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Error:", error.message);
        return `${text}\n\nSource: ${url}`; // Fallback to raw text
    }
}

module.exports = { summarizeTweet };
