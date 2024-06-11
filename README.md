# <img src="https://cdn.discordapp.com/emojis/1221913766145429505.png" alt="Kick logo" width="30"/> Streamer.Info - Streamer Information Module
It gives you information about the active streams of streamers on **Kick** and **Twitch**.
# 🔧 Installation
- You can download `streamer.info` in powershell with this code.
```js
npm install streamer.info
```
- With this powershell code you need to download the modules needed for `streamer.info` to work. 
```sheel
npm install axios cheerio puppeteer
```
```shell
npx puppeteer browsers install chrome
```
# 🧱 Basic Usage
Below are examples and results for **Kick** and **Twitch**.
## <img src="https://cdn.discordapp.com/emojis/1249372855796502539.png" alt="Kick logo" width="17"/> Kick
- Code:
```js
const { Kick } = require("streamer.info")

const kick = new Kick()

const streamerUsername = "sam"

const info = await kick.getStream(streamerUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  live: true,
  error: false,
  id: 30166828,
  title: 'IRL IS BACK! Gamble > BUY WORLDS SMALLEST CAR > Amsterdam |  Sam Pepper Live',
  language: 'English',
  viewers: 5221,
  category: {
    id: 15,
    name: 'Just Chatting',
    slug: 'just-chatting',
    tags: [ 'IRL' ],
    parent_category: { 
      id: 2, 
      slug: 'irl' 
    }
  },
  thumbnail: 'https://images.kick.com/video_thumbnails/z7oMLoDcD3va/V5nebj3n2vqk/720.webp',
  urls: { 
    stream: 'https://kick.com/sam'
  },
  isMature: true,
  start: {
    date: { 
      row: '2024-06-10T15:03:09.000000Z',
      full: '15:03:09 06/10/2024', 
      separately: {
        time: { 
          full: '15:03:09', 
          hours: '15', 
          minutes: '03', 
          seconds: '09' 
        },
        date: { 
          full: '06/10/2024', 
          month: '06', 
          day: '10', 
          year: 2024 
        }
      }
    },
    timestamp: { 
      row: 1718031789, 
      discord: {
        shortTime: '<t:1718031789:t>',
        longTime: '<t:1718031789:T>',
        shortDate: '<t:1718031789:d>',
        longDate: '<t:1718031789:D>',
        longDateWithShortTime: '<t:1718031789:f>',
        longDateWithDayOfWeekAndShortTime: '<t:1718031789:F>',
        relative: '<t:1718031789:R>'
      }
    }
  }
}
```
- Not On Stream Result:
```js
{ live: false, error: false }
```
- Error Result:
```js
{ live: false, error: string }
```
## <img src="https://cdn.discordapp.com/emojis/1221761381942956033.png" alt="Kick logo" width="17"/> Twitch
- Code:
```js
const { Twitch } = require("streamer.info")

const twitch = new Twitch()

const streamerUsername = "lec"

const info = await twitch.getStream(streamerUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  live: true,
  error: false,
  name: 'LEC - Twitch',
  title: 'GX vs SK | 2024 LEC Summer Split Regular Season',
  thumbnail: {
    src: [
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_lec-80x45.jpg',
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_lec-320x180.jpg',
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_lec-640x360.jpg'
    ],
    bestResolution: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_lec-640x360.jpg'
  },
  urls: {
    stream: 'https://www.twitch.tv/lec',
    fullScreen: 'https://player.twitch.tv/?channel=lec&player=facebook&autoplay=true&parent=meta.tag'
  },
  start: {
    date: { 
      row: '2024-06-10T13:45:28Z',
      full: '13:45:28 06/10/2024', 
      separately: {
        time: { 
          full: '13:45:28', 
          hours: '13', 
          minutes: '45', 
          seconds: '28' 
        },
        date: { 
          full: '06/10/2024', 
          month: '06', 
          day: '10', 
          year: 2024 
        }
      } 
    },
    timestamp: { 
        row: 1718027128, 
        discord: {
          shortTime: '<t:1718027128:t>',
          longTime: '<t:1718027128:T>',
          shortDate: '<t:1718027128:d>',
          longDate: '<t:1718027128:D>',
          longDateWithShortTime: '<t:1718027128:f>',
          longDateWithDayOfWeekAndShortTime: '<t:1718027128:F>',
          relative: '<t:1718027128:R>'
        }
    }
  }
}
```
- Not On Stream Result:
```js
{ live: false, error: false }
```
- Error Result:
```js
{ live: false, error: string }
```
# ✨ Support
You can come to our [Discord server](https://discord.gg/TCWbk7zWY5) and get help and support on [#npm-support](https://discord.com/channels/1196503995661942965/1249767884159455355) channel. Or if you send a friend to my [discord account](https://discord.com/users/389071682649849868), I will return as soon as possible.

<p align="center"><a href="https://discord.gg/TCWbk7zWY5"><img src="https://api.weblutions.com/discord/invite/TCWbk7zWY5/"></a></p>
<p align="center"><a href="https://discord.com/users/389071682649849868"><img src="https://lanyard-profile-readme.vercel.app/api/389071682649849868"></a></p>

# 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/beftlidev/streamer.info/blob/main/LICENSE) file for details.
