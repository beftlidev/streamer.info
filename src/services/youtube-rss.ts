import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { YouTubeVideoResult, YouTubeStreamResult } from '../types';
import { ErrorHandler } from '../utils/error';

interface YouTubeRSSEntry {
  'yt:videoId': string;
  title: string;
  link: {
    '@_href': string;
  };
  author: {
    name: string;
    uri: string;
  };
  published: string;
  updated: string;
  'media:group': {
    'media:title': string;
    'media:content': {
      '@_url': string;
      '@_type': string;
      '@_width': string;
      '@_height': string;
    };
    'media:thumbnail': {
      '@_url': string;
      '@_width': string;
      '@_height': string;
    };
    'media:description': string;
    'media:community': {
      'media:starRating': {
        '@_count': string;
        '@_average': string;
      };
      'media:statistics': {
        '@_views': string;
      };
    };
  };
}

interface YouTubeRSSFeed {
  feed: {
    entry: YouTubeRSSEntry[];
  };
}

export class YouTubeRSSService {
  private static readonly RSS_BASE_URL = 'https://www.youtube.com/feeds/videos.xml';
  
  private static validateUsername(username: string): void {
    if (!username) {
      throw ErrorHandler.createStreamerError('Username cannot be empty', 'YouTube');
    }
    
    if (username.length > 100) {
      throw ErrorHandler.createStreamerError('Username is too long', 'YouTube', username);
    }
  }

  private static async getChannelId(username: string): Promise<string | null> {
    try {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      
      const response = await axios.get(`https://www.youtube.com/${cleanUsername}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const channelIdMatch = response.data.match(/"channelId":"([^"]+)"/);
      if (channelIdMatch) {
        return channelIdMatch[1];
      }

      const externalIdMatch = response.data.match(/"externalId":"([^"]+)"/);
      if (externalIdMatch) {
        return externalIdMatch[1];
      }

      return null;
    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Channel ID');
      return null;
    }
  }

  private static async fetchRSSFeed(channelId: string): Promise<YouTubeRSSEntry[]> {
    try {
      const rssUrl = `${this.RSS_BASE_URL}?channel_id=${channelId}`;
      
      const response = await axios.get(rssUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
      });

      const feedData: YouTubeRSSFeed = parser.parse(response.data);
      
      if (!feedData.feed || !feedData.feed.entry) {
        return [];
      }

      const entries = Array.isArray(feedData.feed.entry) 
        ? feedData.feed.entry 
        : [feedData.feed.entry];

      return entries;
    } catch (error) {
      ErrorHandler.logError(error, 'YouTube RSS Fetch');
      return [];
    }
  }

  private static createVideoResult(entry: YouTubeRSSEntry): YouTubeVideoResult {
    try {
      const videoId = entry['yt:videoId'];
      const title = entry['media:group']['media:title'] || entry.title;
      const thumbnail = entry['media:group']['media:thumbnail']?.['@_url'] || '';
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      return {
        success: true,
        error: false,
        title,
        thumbnail,
        urls: {
          video: videoUrl
        }
      };
    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Create Video Result');
      return {
        success: false,
        error: 'Error processing video information'
      };
    }
  }

  private static async checkIfLive(videoId: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const isLive = response.data.includes('"isLiveContent":true') ||
                    response.data.includes('LIVE_STREAM_OFFLINE') ||
                    response.data.includes('live-badge') ||
                    response.data.includes('"isLive":true');

      return isLive;
    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Live Check');
      return false;
    }
  }

  static async getLatestVideo(username: string): Promise<YouTubeVideoResult> {
    try {
      this.validateUsername(username);
      
      const channelId = await this.getChannelId(username);
      if (!channelId) {
        return {
          success: false,
          error: 'Channel not found'
        };
      }

      const entries = await this.fetchRSSFeed(channelId);
      if (entries.length === 0) {
        return {
          success: false,
          error: 'No videos found'
        };
      }

      const latestVideo = entries[0];
      return this.createVideoResult(latestVideo);

    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Latest Video RSS');
      return {
        success: false,
        error: ErrorHandler.handleError(error, 'YouTube Latest Video RSS')
      };
    }
  }

  static async getLatestShorts(username: string): Promise<YouTubeVideoResult> {
    try {
      this.validateUsername(username);
      
      const channelId = await this.getChannelId(username);
      if (!channelId) {
        return {
          success: false,
          error: 'Channel not found'
        };
      }

      const entries = await this.fetchRSSFeed(channelId);
      if (entries.length === 0) {
        return {
          success: false,
          error: 'No shorts found'
        };
      }

      const latestShorts = entries[0];
      const result = this.createVideoResult(latestShorts);
      
      if (result.success && result.urls.video) {
        const videoId = result.urls.video.split('v=')[1];
        result.urls.video = `https://www.youtube.com/shorts/${videoId}`;
      }

      return result;

    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Latest Shorts RSS');
      return {
        success: false,
        error: ErrorHandler.handleError(error, 'YouTube Latest Shorts RSS')
      };
    }
  }

  static async getStream(username: string): Promise<YouTubeStreamResult> {
    try {
      this.validateUsername(username);
      
      const channelId = await this.getChannelId(username);
      if (!channelId) {
        return {
          live: false,
          error: 'Channel not found'
        };
      }

      const entries = await this.fetchRSSFeed(channelId);
      if (entries.length === 0) {
        return {
          live: false,
          error: false
        };
      }

      for (const entry of entries.slice(0, 3)) {
        const videoId = entry['yt:videoId'];
        const isLive = await this.checkIfLive(videoId);
        
        if (isLive) {
          const title = entry['media:group']['media:title'] || entry.title;
          const thumbnail = entry['media:group']['media:thumbnail']?.['@_url'] || '';
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          return {
            live: true,
            error: false,
            title,
            viewers: 'N/A',
            thumbnail,
            urls: {
              video: videoUrl
            }
          };
        }
      }

      return {
        live: false,
        error: false
      };

    } catch (error) {
      ErrorHandler.logError(error, 'YouTube Stream RSS');
      return {
        live: false,
        error: ErrorHandler.handleError(error, 'YouTube Stream RSS')
      };
    }
  }
} 