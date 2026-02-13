# Unrot

Your brain deserves better than doomscrolling.

Unrot replaces mindless feeds with a single, curated stream of content that actually makes you smarter. Open the app, and instead of rage bait and engagement traps, you get:

- **News** — Tech, AI, security, and dev news scraped daily from trusted sources, summarized so you stay informed in minutes, not hours.
- **Books** — Bite-sized summaries and key takeaways from books on personal growth, habits, communication, and self-improvement. Read the ideas without the filler.
- **Math** — Random math topics with clear explanations. Keeps your analytical thinking sharp through passive exposure.
- **GitHub** — Pull requests from repos you care about, woven into your feed so you stay connected to the projects that matter.

Everything shows up in one unified, Twitter-style feed. No algorithmic manipulation, no infinite scroll tricks — just good content, interleaved and ready to go.

## Why

The average person spends 2+ hours a day on social media consuming content designed to keep them scrolling, not learning. Unrot is the opposite: a feed designed to be finished. You open it, absorb something useful, and move on with your day.

## Features

- Unified feed with filtering by content type
- Text-to-speech on math topics and book summaries with adjustable speed, pitch, and voice
- Configurable GitHub repo tracking
- Category-based browsing for news and books
- Daily news scraping with server-side caching

## Stack

- **Mobile** — React Native + Expo (SDK 54), Expo Router, expo-speech, expo-audio
- **Server** — Bun + Elysia, web scraping via Cheerio, GitHub API integration

## Getting Started

```bash
# Install dependencies
bun install

# Start the server
cd apps/server && bun run dev

# Start the mobile app (Expo Go)
cd apps/mobile && bun run start
```

Scan the QR code with Expo Go on your phone.
