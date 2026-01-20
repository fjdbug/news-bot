# Twitter-to-Telegram News Bot

A Node.js bot that monitors specific Twitter accounts, scrapes new tweets, summarizes them using OpenAI, and broadcasts the summary to a Telegram channel.

## Features
- **Scraping**: Uses Puppeteer with stealth plugins to scrape public Twitter profiles.
- **AI Summarization**: Uses OpenAI (GPT-4o/GPT-3.5) to convert tweets into news-style bullet points.
- **Telegram Broadcast**: Sends summaries directly to a specified Telegram channel.
- **Duplicate Prevention**: Tracks processed tweets in a local SQLite database.
- **Scheduling**: Runs automatically every 10 minutes.

## Prerequisites
- Node.js (Latest LTS)
- A Telegram Bot Token (from @BotFather)
- A Telegram Channel ID (where the bot is an admin)
- An OpenAI API Key

## Setup

1.  **Clone/Download the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Edit `.env` and fill in your details:
        ```env
        TELEGRAM_BOT_TOKEN=your_token_here
        TELEGRAM_CHANNEL_ID=@your_channel_handle
        OPENAI_API_KEY=your_openai_key
        TARGET_TWITTER_HANDLES=["@NASA", "@SpaceX"]
        ```

## Usage

To start the bot:

```bash
node index.js
```

The bot will run immediately upon start and then schedule itself to run every 30 minutes.

## Troubleshooting

### Twitter Scraping Issues
- If you see timeout errors or empty results, Twitter might be rate-limiting your IP or requiring login.
- **Solution (Advanced):** You can update `scraper.js` to load cookies from a file if needed, but this basic version relies on public access.
- **Stealth Mode:** The bot uses `puppeteer-extra-plugin-stealth` to try and look like a real user.

### Database
- The bot creates a `tweets.db` file in the project directory. If you want to reset the bot's memory, simply delete this file.
