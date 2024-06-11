const axios = require("axios").default;
const { load } = require("cheerio").default;
const puppeteer = require('puppeteer');

class Kick {
    
    async getStream(username) {
        
        let browser;
    
        try {

            browser = await puppeteer.launch({
                headless: 'new'
            });
    
            const page = await browser.newPage();

            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
            
            await page.setUserAgent(userAgent);
    
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
    
}

class Twitch {
    
    async getStream (username) {
    
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
    Kick,
    Twitch
}