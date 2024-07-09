const axios = require("axios").default;
const { load } = require("cheerio").default;
const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const package = require("./package.json");

async function checkUpdate() {

    function getPackageVersion() {

        return new Promise((resolve, reject) => {
            exec(`npm view streamer.info version`, (error, stdout, stderr) => {
                if (error) return { error };
                if (stderr) return { error: stderr };
                resolve({ version: stdout.trim(), error: false });
            });
        });
        
    }

    const version = await getPackageVersion()

    if(version.error) return;

    if(version.version) {
        if(version.version !== package.version) {
            console.log(`\x1b[34mStreamer.Info is out of date!\x1b[0m Remember to use \x1b[32m"npm update streamer.info" ( ${package.version} -> ${version.version} )\x1b[0m in powershell to take advantage of the new features.`)
        } else return;
    } else return;

}

class Kick {
    
    async getStream(username) {
        
        let browser;

        if(!username) return { live: false, error: "You have to enter a streamer name." }
    
        try {

            browser = await puppeteer.launch({
                headless: 'new'
            });
    
            const page = await browser.newPage();
            
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    
            const response = await page.goto(`https://kick.com/api/v2/channels/${username}/livestream`, {
                waitUntil: 'networkidle2'
            });
    
            if (response && response.ok()) {
    
                const data = await page.evaluate(() => document.body.textContent);
            
                const info = JSON.parse(data).data
          
                if(info == null) return { live: false, error: false }
            
                const { id, session_title, created_at, language, is_mature, viewers, category, thumbnail } = info;

                const date = new Date(created_at)
                const timestamp = Math.floor(date / 1000)
                const hours = String(date.getUTCHours()).padStart(2, '0');
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                const seconds = String(date.getUTCSeconds()).padStart(2, '0');
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear();
            
                return {
                    live: true,
                    error: false,
                    id,
                    title: session_title, 
                    language,
                    viewers,
                    category,
                    thumbnail: thumbnail.src ? thumbnail.src : false,
                    urls: {
                        stream: `https://kick.com/${username}`
                    },
                    isMature: is_mature,
                    start: {
                        date: {
                            row: created_at,
                            full: `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`,
                            separately: {
                                time: {
                                    full: `${hours}:${minutes}:${seconds}`,
                                    hours,
                                    minutes,
                                    seconds,
                                },
                                date: {
                                    full: `${month}/${day}/${year}`,
                                    month,
                                    day,
                                    year
                                }
                            }
                        },
                        timestamp: {
                            row: timestamp,
                            discord: {
                                shortTime: `<t:${timestamp}:t>`,
                                longTime: `<t:${timestamp}:T>`,
                                shortDate: `<t:${timestamp}:d>`,
                                longDate: `<t:${timestamp}:D>`,
                                longDateWithShortTime: `<t:${timestamp}:f>`,
                                longDateWithDayOfWeekAndShortTime: `<t:${timestamp}:F>`,
                                relative: `<t:${timestamp}:R>`
                            }
                        }
                    }
                };
        
            } else {
                return { live: false, error: `Failed to load URL: ${response?.status()} - ${response?.statusText()}` }
            }

        } catch (error) {
            return { live: false, error }
        } finally {
            if (browser) {
                await browser.close();
            }
        }
      
    }

    async getStreamerProfile(username) {
        
        let browser;

        if(!username) return { live: false, error: "You have to enter a streamer name." }
    
        try {

            browser = await puppeteer.launch({
                headless: 'new'
            });
    
            const page = await browser.newPage();
            
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    
            const response = await page.goto(`https://kick.com/api/v2/channels/${username}`, {
                waitUntil: 'networkidle2'
            });
    
            if (response && response.ok()) {
    
                const data = await page.evaluate(() => document.body.textContent);
            
                const info = JSON.parse(data)
          
                if(info == null) return { live: false, error: false }
            
                const { verified } = info;

                const { profile_pic, bio, instagram, twitter, youtube, discord, tiktok, facebook } = info.user;
            
                return {
                    success: true,
                    error: false,
                    avatar: profile_pic,
                    bio,
                    verified, 
                    socials: {
                        instagram: {
                            row: instagram ? instagram : false,
                            link: instagram ? `https://instagram.com/${instagram}` : false
                        }, 
                        x: {
                            row: twitter ? twitter : false,
                            link: twitter ? `https://x.com/${twitter}` : false
                        }, 
                        youtube: {
                            row: youtube ? youtube : false,
                            link: youtube ? `https://youtube.com/${youtube}` : false
                        }, 
                        discord: {
                            row: discord ? discord : false
                        }, 
                        tiktok: {
                            row: tiktok ? tiktok : false,
                            link: tiktok ? `https://tiktok.com/${tiktok}` : false
                        }, 
                        facebook: {
                            row: facebook ? facebook : false,
                            link: facebook ? `https://facebook.com/${facebook}` : false
                        }
                    }
                };
        
            } else {
                return { success: false, error: `Failed to load URL: ${response?.status()} - ${response?.statusText()}` }
            }

        } catch (error) {
            return { success: false, error }
        } finally {
            if (browser) {
                await browser.close();
            }
        }
      
    }
    
}

class Twitch {
    
    async getStream (username) {

        if(!username) return { live: false, error: "You have to enter a streamer name." }
    
        const { data } = await axios(`https://www.twitch.tv/${encodeURIComponent(username)}`);
    
        if (!data.includes("isLiveBroadcast")) return { live: false, error: false };
    
        try {
          
            const $ = load(data, { xmlMode: false });
    
            let scriptTagContent;
            $("script").each((i, elem) => {
                const scriptContent = $(elem).html();
                if (scriptContent.includes("isLiveBroadcast")) {
                    scriptTagContent = scriptContent;
                    return false;
                }
            });
    
            if (!scriptTagContent) return { live: false, error: "Live broadcast information not found in script tags." };
    
            const json = JSON.parse(scriptTagContent);
    
            const { name, description, embedUrl, thumbnailUrl, publication: { startDate } } = json["@graph"][0];
            const profilePhoto = $('meta[property="og:image"]').attr('content')

            let thumbnail;
            if (thumbnailUrl.length > 0) {
                const regex = /(\d+)x(\d+)/;
                let maxUrl = thumbnailUrl[0];
                let maxSize = 0;
                thumbnailUrl.forEach(url => {
                    const match = url.match(regex);
                    if (match) {
                        const width = parseInt(match[1], 10);
                        const height = parseInt(match[2], 10);
                        const size = width * height;
              
                        if (size > maxSize) {
                            maxSize = size;
                            maxUrl = url;
                        }
                    }
                });
                thumbnail = maxUrl
            }

            const date = new Date(startDate)
            const timestamp = Math.floor(date / 1000)
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
    
            return {
                live: true,
                error: false,
                name,
                avatar: profilePhoto,
                title: description,
                thumbnail: {
                    src: thumbnailUrl ? thumbnailUrl : false,
                    bestResolution: thumbnail ? thumbnail : false
                },
                urls: {
                    stream: `https://www.twitch.tv/${username}`,
                    fullScreen: embedUrl,
                },
                start: {
                    date: {
                        row: startDate,
                        full: `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`,
                        separately: {
                            time: {
                                full: `${hours}:${minutes}:${seconds}`,
                                hours,
                                minutes,
                                seconds,
                            },
                            date: {
                                full: `${month}/${day}/${year}`,
                                month,
                                day,
                                year
                            }
                        }
                    },
                    timestamp: {
                        row: timestamp,
                        discord: {
                            shortTime: `<t:${timestamp}:t>`,
                            longTime: `<t:${timestamp}:T>`,
                            shortDate: `<t:${timestamp}:d>`,
                            longDate: `<t:${timestamp}:D>`,
                            longDateWithShortTime: `<t:${timestamp}:f>`,
                            longDateWithDayOfWeekAndShortTime: `<t:${timestamp}:F>`,
                            relative: `<t:${timestamp}:R>`
                        }
                    }
                }
            } 

        } catch (error) {

            return { live: false, error };

        }
    }

}
  
module.exports = {
    checkUpdate,
    Kick,
    Twitch
}
