# <img src="https://cdn.discordapp.com/emojis/1221913766145429505.png" alt="Kick logo" width="30"/> Streamer.Info - Streamer Information Module
It gives you information about the active streams of streamers on **Kick**, **Twitch** and **YouTube**.
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
Below are examples and results for **Kick**, **Twitch** and **YouTube**. And if you want to do version control automatically, we have extra code.
## <img src="https://cdn.discordapp.com/emojis/1217435722789683241.png" alt="Kick logo" width="17"/> Check Update
- Code: 
```js
const { checkUpdate } = require("streamer.info")

client.on("ready", async() => {

    await checkUpdate()
    
})
```
- Result if the module is out of date (Automatically logs to the console.):
```shell
Streamer.Info is out of date! Remember to use "npm update streamer.info" ( Old Version -> New Version ) in powershell to take advantage of the new features.
```
## <img src="https://cdn.discordapp.com/emojis/1249372855796502539.png" alt="Kick logo" width="17"/> Kick Get Stream
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
## <img src="https://cdn.discordapp.com/emojis/1249372855796502539.png" alt="Kick logo" width="17"/> Kick Get Streamer Profile
- Code:
```js
const { Kick } = require("streamer.info")

const kick = new Kick()

const streamerUsername = "elraenn"

const info = await kick.getStreamerProfile(streamerUsername)

console.log(info)
```
- Success Result: 
```js
{
  success: true,
  error: false,
  avatar: 'https://files.kick.com/images/user/27018175/profile_image/conversion/3c56e5cb-afc0-4760-93fb-f1e1bfb44e86-fullsize.webp',
  bio: '"What we do in life, echoes in eternity."',
  verified: true,
  socials: {
    instagram: {
      row: 'tugkangonultas',
      link: 'https://instagram.com/tugkangonultas'
    },
    x: { 
      row: false, 
      link: false 
    },
    youtube: { 
      row: 'Elraenn', 
      link: 'https://youtube.com/Elraenn' 
    },
    discord: { 
      row: false 
    },
    tiktok: { 
      row: false, 
      link: false 
    },
    facebook: { 
      row: false, 
      link: false
    }
  }
}
```
- If No Profile Result:
```js
{ success: false, error: false }
```
- Error Result:
```js
{ success: false, error: string }
```
## <img src="https://cdn.discordapp.com/emojis/1221761381942956033.png" alt="Kick logo" width="17"/> Twitch Get Stream
- Code:
```js
const { Twitch } = require("streamer.info")

const twitch = new Twitch()

const streamerUsername = "grimm"

const info = await twitch.getStream(streamerUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  live: true,
  error: false,
  name: 'Grimm - Twitch',
  avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/460b9db2-562d-4bd0-af57-f1eb6f5a462c-profile_image-300x300.png',
  title: '🟥T1 GRIM🟥AWOKEN FROM MY SLUMBER🟥TIME TO GET ACTIVE🟥SAGE WALL ALL OVER THE ENEMIES🟥LETS BE GREAT🟥',
  thumbnail: {
    src: [
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_grimm-80x45.jpg',
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_grimm-320x180.jpg',
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_grimm-640x360.jpg'
    ],
    bestResolution: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_grimm-640x360.jpg'
  },
  urls: {
    stream: 'https://www.twitch.tv/grimm',
    fullScreen: 'https://player.twitch.tv/?channel=grimm&player=facebook&autoplay=true&parent=meta.tag'
  },
  start: {
    date: {
      row: '2024-07-09T17:56:00Z',
      full: '17:56:00 07/09/2024',
      separately: {
        time: { 
          full: '17:56:00', 
          hours: '17', 
          minutes: '56', 
          seconds: '00' 
        },
        date: { 
          full: '07/09/2024', 
          month: '07', 
          day: '09', 
          year: 2024 
        }
      }
    },
    timestamp: { 
      row: 1720547760, 
      discord: {
        shortTime: '<t:1720547760:t>',
        longTime: '<t:1720547760:T>',
        shortDate: '<t:1720547760:d>',
        longDate: '<t:1720547760:D>',
        longDateWithShortTime: '<t:1720547760:f>',
        longDateWithDayOfWeekAndShortTime: '<t:1720547760:F>',
        relative: '<t:1720547760:R>'
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
## <img src="https://cdn.discordapp.com/emojis/1221202822071324682.png" alt="Kick logo" width="17"/> YouTube Get Latest Shorts
- Code:
```js
const { YouTube } = require("streamer.info")

const youtube = new YouTube()

const youtuberUsername = "dinocornel"

const info = await youtube.getLatestShorts(youtuberUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  success: true,
  error: false,
  title: 'Bro did it again #theultimatenerd #gamingsetup #gamingroom #gamer',
  avatar: 'https://yt3.googleusercontent.com/U3Q8WfcBnhzaAMuNZO8XuhUM5E1ZAAOx-Yfp307QiAZipbEjSOAOVUdTHEu3zaZSlcENNV4FW-s=s160-c-k-c0x00ffffff-no-rj',
  thumbnail: 'https://i.ytimg.com/vi/2375amwi4oE/oar2.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&rs=AOn4CLBFe_br2Z8x44HoQhVcPzLMLyhEcQ',
  urls: { 
    video: 'https://www.youtube.com/shorts/2375amwi4oE' 
  }
}
```
- Not On Stream Result:
```js
{ success: false, error: false }
```
- Error Result:
```js
{ success: false, error: string }
```
## <img src="https://cdn.discordapp.com/emojis/1221202822071324682.png" alt="Kick logo" width="17"/> YouTube Get Latest Video
- Code:
```js
const { YouTube } = require("streamer.info")

const youtube = new YouTube()

const youtuberUsername = "TenZ"

const info = await youtube.getLatestVideo(youtuberUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  success: true,
  error: false,
  title: 'The VALORANT Ultimate Guide for Beginners !! | SEN TenZ',
  avatar: 'https://yt3.googleusercontent.com/U3Q8WfcBnhzaAMuNZO8XuhUM5E1ZAAOx-Yfp307QiAZipbEjSOAOVUdTHEu3zaZSlcENNV4FW-s=s160-c-k-c0x00ffffff-no-rj',
  thumbnail: 'https://i.ytimg.com/vi/3xjpx8-2gD0/hqdefault.jpg?sqp=-oaymwE2CNACELwBSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARh_IDUoITAP&rs=AOn4CLCl-uWjDEg22mbHexdehEkulmkC9w',
  urls: { 
    video: 'https://www.youtube.com/watch?v=3xjpx8-2gD0' 
  }
}
```
- Not On Stream Result:
```js
{ success: false, error: false }
```
- Error Result:
```js
{ success: false, error: string }
```
## <img src="https://cdn.discordapp.com/emojis/1221202822071324682.png" alt="Kick logo" width="17"/> YouTube Get Stream
- Code:
```js
const { YouTube } = require("streamer.info")

const youtube = new YouTube()

const youtuberUsername = "apex47"

const info = await youtube.getStream(youtuberUsername)

console.log(info)
```
- On Stream Result: 
```js
{
  live: true,
  error: false,
  title: 'AP BREN VS ONIC// ESL SNAPDRAGON 5  PLAYOFF',
  avatar: 'https://yt3.googleusercontent.com/U3Q8WfcBnhzaAMuNZO8XuhUM5E1ZAAOx-Yfp307QiAZipbEjSOAOVUdTHEu3zaZSlcENNV4FW-s=s160-c-k-c0x00ffffff-no-rj',
  viewers: '364',
  thumbnail: 'https://i.ytimg.com/vi/gpCMTU2oSE0/hqdefault_live.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBsxG64BrXJf5LKs1F04fgI6fHs9A',
  urls: { 
    video: 'https://www.youtube.com/watch?v=gpCMTU2oSE0' 
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
