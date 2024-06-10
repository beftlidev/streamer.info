# Streamer.Info - Streamer Information Module
It gives you information about the active streams of streamers on Twitch and `Kick (coming soon)`.
# 🔧 Installation
```js
npm install streamer.info
```
# 🧱 Basic Usage
- Code:
```js
const { Twitch } = require("streamer.info")

const twitch = new Twitch()

const info = await twitch.getStream("valorant")

console.log(info)
```
- On Stream Result: 
```js
{
  live: true,
  error: false,
  name: 'LEC - Twitch',
  title: 'GX vs SK | 2024 LEC Summer Split Regular Season',
  thumbnails: {
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
    row: '2024-06-10T13:45:28Z',
    date: { 
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
<br> </br>
[![Discord Banner](https://api.weblutions.com/discord/invite/TCWbk7zWY5/)](https://discord.gg/TCWbk7zWY5)
[![Discord User](https://lanyard-profile-readme.vercel.app/api/389071682649849868?hideActivity=true)](https://discord.com/users/389071682649849868)
# 📚 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/beftlidev/streamer.info/blob/main/LICENSE) file for details.
