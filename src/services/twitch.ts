import axios from 'axios';
import { load } from 'cheerio';
import { Page } from 'puppeteer';
import { TwitchStreamResult, TwitchThumbnail } from '../types';
import { BrowserManager } from '../utils/browser';
import { DateTimeUtil } from '../utils/date';
import { ErrorHandler } from '../utils/error';

interface TwitchJsonData {
  '@graph': Array<{
    name: string;
    description: string;
    embedUrl: string;
    thumbnailUrl: string[];
    publication: {
      startDate: string;
    };
  }>;
}

export class TwitchService {
  private static readonly BASE_URL = 'https://www.twitch.tv';

  private static validateUsername(username: string): void {
    if (!username) {
      throw ErrorHandler.createStreamerError('Username cannot be empty', 'Twitch');
    }
    
    if (username.length > 25) {
      throw ErrorHandler.createStreamerError('Username is too long', 'Twitch', username);
    }

    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(username)) {
      throw ErrorHandler.createStreamerError('Invalid username format', 'Twitch', username);
    }
  }

  private static async preCheckStream(username: string): Promise<boolean> {
    try {
      const { data } = await axios.get(`${this.BASE_URL}/${encodeURIComponent(username)}`, {
        timeout: 10000
      });
      return data.includes('isLiveBroadcast');
    } catch (error) {
      ErrorHandler.logError(error, 'Twitch Pre-check');
      return false;
    }
  }

  private static selectBestThumbnail(thumbnailUrls: string[]): string | false {
    if (!thumbnailUrls || thumbnailUrls.length === 0) {
      return false;
    }

    const regex = /(\d+)x(\d+)/;
    let maxUrl = thumbnailUrls[0];
    let maxSize = 0;

    for (const url of thumbnailUrls) {
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
    }

    return maxUrl;
  }

  private static createThumbnailObject(thumbnailUrls: string[]): TwitchThumbnail {
    const bestResolution = this.selectBestThumbnail(thumbnailUrls);
    
    return {
      src: thumbnailUrls.length > 0 ? thumbnailUrls : false,
      bestResolution
    };
  }

  private static async fetchStreamData(username: string): Promise<TwitchStreamResult> {
    const hasStream = await this.preCheckStream(username);
    if (!hasStream) {
      return { live: false, error: false };
    }

    return await BrowserManager.withPage(async (page: Page) => {
      const url = `${this.BASE_URL}/${encodeURIComponent(username)}`;
      
      const response = await page.goto(url, {
        waitUntil: 'networkidle2'
      });

      if (!response || !response.ok()) {
        return {
          live: false,
          error: ErrorHandler.createHttpError(
            response?.status() || 0,
            response?.statusText() || 'Unknown error'
          )
        };
      }

      const pageContent = await page.content();
      const $ = load(pageContent, { xmlMode: false });

      let jsonData: TwitchJsonData | null = null;
      $('script').each((_index: number, elem: any) => {
        const scriptContent = $(elem).html();
        if (scriptContent && scriptContent.includes('isLiveBroadcast')) {
          try {
            jsonData = JSON.parse(scriptContent);
            return false;
          } catch (error) {
            ErrorHandler.logError(error, 'Twitch JSON Parse');
          }
        }
        return undefined;
      });

      const graphData = jsonData?.['@graph'] as TwitchJsonData['@graph'] | undefined;
      if (!jsonData || !graphData || graphData.length === 0) {
        return { 
          live: false, 
          error: 'Live broadcast information not found in script tags' 
        };
      }

      const streamInfo = graphData[0];
      const {
        name,
        description,
        embedUrl,
        thumbnailUrl,
        publication: { startDate }
      } = streamInfo;

      const profilePhoto = $('meta[property="og:image"]').attr('content') || '';

      let viewers = 0;
      try {
        const viewerElement = await page.$('#live-channel-stream-information .live-time');
        if (viewerElement) {
          const viewerText = await page.evaluate((el: any) => el.textContent, viewerElement);
          const viewerMatch = viewerText?.match(/(\d+)/);
          if (viewerMatch) {
            viewers = parseInt(viewerMatch[1], 10);
          }
        }
      } catch (error) {
        ErrorHandler.logError(error, 'Twitch Viewer Count');
      }

      return {
        live: true,
        error: false,
        name,
        avatar: profilePhoto,
        title: description,
        viewers,
        thumbnail: this.createThumbnailObject(thumbnailUrl),
        urls: {
          stream: url,
          fullScreen: embedUrl
        },
        start: DateTimeUtil.createStartInfo(startDate)
      };
    });
  }

  static async getStream(username: string): Promise<TwitchStreamResult> {
    try {
      this.validateUsername(username);
      
      const result = await this.fetchStreamData(username);
      return result;
    } catch (error) {
      ErrorHandler.logError(error, 'Twitch Stream');
      return {
        live: false,
        error: ErrorHandler.handleError(error, 'Twitch Stream')
      };
    }
  }
} 