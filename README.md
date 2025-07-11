# Streamer.Info - TypeScript Edition 🚀

[![npm version](https://badge.fury.io/js/streamer.info.svg)](https://badge.fury.io/js/streamer.info)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D16-green.svg)](https://nodejs.org)

A high-performance, type-safe, and modular library for fetching streamer information from **Kick**, **Twitch**, and **YouTube** platforms.

## ✨ Features

- 🎯 **Type Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **High Performance**: Browser instance pooling, RSS feeds, and optimized requests
- 🔄 **Auto Retry**: Intelligent retry mechanism for network failures
- 🧹 **Clean API**: Simple and consistent interface across all platforms
- 📦 **Modular**: Use only the platforms you need
- 🚀 **Modern**: ES2020+ with async/await support
- 🌐 **RSS Support**: YouTube integration via RSS feeds for better reliability

## 🚀 Installation

```bash
npm install streamer.info
```

## 📖 Quick Start

```typescript
import { Kick, Twitch, YouTube, checkUpdate } from 'streamer.info';

// Check for updates
await checkUpdate();

// Kick stream information
const kickStream = await Kick.getStream('username');
if (kickStream.live) {
  console.log(`${kickStream.title} - ${kickStream.viewers} viewers`);
}

// Twitch stream information
const twitchStream = await Twitch.getStream('username');
if (twitchStream.live) {
  console.log(`${twitchStream.title} - ${twitchStream.viewers} viewers`);
}

// YouTube latest video
const youtubeVideo = await YouTube.getLatestVideo('username');
if (youtubeVideo.success) {
  console.log(`Latest video: ${youtubeVideo.title}`);
}
```

## 🎮 Platform Support

### Kick.com

```typescript
import { Kick } from 'streamer.info';

// Stream information
const stream = await Kick.getStream('username');
/*
Response:
{
  live: true,
  error: false,
  id: "stream-id",
  title: "Stream title",
  language: "en",
  viewers: 1250,
  category: "Just Chatting",
  thumbnail: "https://...",
  urls: { stream: "https://kick.com/username" },
  isMature: false,
  start: { date: {...}, timestamp: {...} }
}
*/

// Profile information
const profile = await Kick.getStreamerProfile('username');
/*
Response:
{
  success: true,
  error: false,
  avatar: "https://...",
  bio: "Streamer bio",
  verified: true,
  socials: {
    instagram: { row: "username", link: "https://..." },
    x: { row: "username", link: "https://..." },
    // ... other social media accounts
  }
}
*/
```

### Twitch.tv

```typescript
import { Twitch } from 'streamer.info';

const stream = await Twitch.getStream('username');
/*
Response:
{
  live: true,
  error: false,
  name: "Streamer Name",
  avatar: "https://...",
  title: "Stream title",
  viewers: 2500,
  thumbnail: {
    src: ["https://..."],
    bestResolution: "https://..."
  },
  urls: {
    stream: "https://twitch.tv/username",
    fullScreen: "https://player.twitch.tv/..."
  },
  start: { date: {...}, timestamp: {...} }
}
*/
```

### YouTube.com (RSS-based)

```typescript
import { YouTube } from 'streamer.info';

// Latest video
const video = await YouTube.getLatestVideo('username');
/*
Response:
{
  success: true,
  error: false,
  title: "Video title",
  thumbnail: "https://...",
  urls: { video: "https://youtube.com/watch?v=..." }
}
*/

// Latest shorts
const shorts = await YouTube.getLatestShorts('username');

// Live stream
const stream = await YouTube.getStream('username');
/*
Response:
{
  live: true,
  error: false,
  title: "Live stream title",
  viewers: "N/A", // RSS doesn't provide viewer count
  thumbnail: "https://...",
  urls: { video: "https://youtube.com/watch?v=..." }
}
*/
```

## 🛠️ Advanced Usage

### Type-Safe Development

```typescript
import { 
  Kick, 
  YouTube, 
  cleanup, 
  Utils,
  type KickStreamResult,
  type YouTubeVideoResult 
} from 'streamer.info';

// Type-safe usage
async function getStreamInfo(username: string): Promise<KickStreamResult> {
  try {
    const result = await Kick.getStream(username);
    
    if (result.live) {
      console.log('Stream info:', {
        title: result.title,
        viewers: result.viewers,
        category: result.category,
        startTime: result.start.timestamp.discord.relative
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error:', Utils.Error.handleError(error));
    return { live: false, error: 'Unknown error' };
  }
}

// Cleanup on app termination
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});
```

### Utility Functions

```typescript
import { Utils, silentCheckUpdate, getCurrentVersion } from 'streamer.info';

// Browser management
const isConnected = await Utils.Browser.isConnected();
await Utils.Browser.closeAll();

// Error handling
const errorMessage = Utils.Error.handleError(error);
const isRetryable = Utils.Error.isRetryableError(error);

// Date/time utilities
const timestamp = Utils.DateTime.getCurrentTimestamp();
const discordFormat = Utils.DateTime.createDiscordTimestamp(timestamp);

// Silent update check
const updateInfo = await silentCheckUpdate();
if (updateInfo.isUpdateAvailable) {
  console.log(`New version available: ${updateInfo.latestVersion}`);
}

// Current version
console.log(`Current version: ${getCurrentVersion()}`);
```

## ⚡ Performance Features

- **Browser Instance Pooling**: Reuses browser instances across multiple operations
- **Request Filtering**: Blocks unnecessary resources (images, CSS, fonts) for faster loading
- **RSS Integration**: YouTube uses RSS feeds for improved reliability and speed
- **Intelligent Caching**: Temporary response caching for better performance
- **Concurrent Operations**: Supports parallel operations across platforms

## 📊 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  KickStreamResult, 
  TwitchStreamResult, 
  YouTubeVideoResult,
  YouTubeStreamResult,
  KickProfileResult 
} from 'streamer.info';

// Type-safe variable declarations
const stream: KickStreamResult = await Kick.getStream('username');

// Type guards
if (stream.live) {
  // TypeScript knows stream is live here
  console.log(stream.title); // ✅ Type safe
  console.log(stream.viewers); // ✅ Type safe
}
```

## 🔧 Configuration

### Browser Settings

Default browser settings are optimized for performance:

- Headless mode enabled
- Unnecessary resources blocked (images, CSS, fonts)
- Request timeout: 30 seconds
- Connection pooling active

### Error Handling

The library automatically retries on:

- Network errors
- Timeout errors
- Browser connection errors

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Build project
npm run build
```

## 📋 Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0.0 (for development)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

MIT - See [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

If you find a bug, please report it on [GitHub Issues](https://github.com/beftlidev/streamer.info/issues).

## 💖 Support

If you like this project, please give it a ⭐ on GitHub!

---

**Developer**: [Beftli](https://github.com/beftlidev), [sw3do](https://github.com/sw3do) 
**Version**: 2.0.0  
**License**: MIT
