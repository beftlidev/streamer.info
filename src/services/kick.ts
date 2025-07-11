import { Page } from 'puppeteer';
import { KickStreamResult, KickProfileResult, SocialMediaProfiles } from '../types';
import { BrowserManager } from '../utils/browser';
import { DateTimeUtil } from '../utils/date';
import { ErrorHandler } from '../utils/error';

interface KickStreamData {
  id: string;
  session_title: string;
  created_at: string;
  language: string;
  is_mature: boolean;
  viewers: number;
  category: string;
  thumbnail: {
    src?: string;
  };
}

interface KickProfileData {
  verified: boolean;
  user: {
    profile_pic: string;
    bio: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    discord?: string;
    tiktok?: string;
    facebook?: string;
  };
}

export class KickService {
  private static readonly BASE_URL = 'https://kick.com';
  private static readonly API_BASE = 'https://kick.com/api/v2';

  private static validateUsername(username: string): void {
    if (!username) {
      throw ErrorHandler.createStreamerError('Username cannot be empty', 'Kick');
    }
    
    if (username.length > 50) {
      throw ErrorHandler.createStreamerError('Username is too long', 'Kick', username);
    }
  }

  private static parseJsonResponse<T>(data: string): T | null {
    try {
      const parsed = JSON.parse(data);
      return parsed.data || parsed;
    } catch (error) {
      ErrorHandler.logError(error, 'JSON Parse');
      return null;
    }
  }

  private static createSocialProfiles(user: KickProfileData['user']): SocialMediaProfiles {
    return {
      instagram: {
        row: user.instagram || false,
        link: user.instagram ? `https://instagram.com/${user.instagram}` : false
      },
      x: {
        row: user.twitter || false,
        link: user.twitter ? `https://x.com/${user.twitter}` : false
      },
      youtube: {
        row: user.youtube || false,
        link: user.youtube ? `https://youtube.com/${user.youtube}` : false
      },
      discord: {
        row: user.discord || false
      },
      tiktok: {
        row: user.tiktok || false,
        link: user.tiktok ? `https://tiktok.com/${user.tiktok}` : false
      },
      facebook: {
        row: user.facebook || false,
        link: user.facebook ? `https://facebook.com/${user.facebook}` : false
      }
    };
  }

  private static async fetchStreamData(username: string): Promise<KickStreamResult> {
    return await BrowserManager.withPage(async (page: Page) => {
      const url = `${this.API_BASE}/channels/${encodeURIComponent(username)}/livestream`;
      
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

      const data = await page.evaluate(() => document.body.textContent);
      if (!data) {
        return { live: false, error: 'Unable to fetch page content' };
      }

      const streamInfo = this.parseJsonResponse<KickStreamData>(data);
      if (!streamInfo) {
        return { live: false, error: false };
      }

      const {
        id,
        session_title,
        created_at,
        language,
        is_mature,
        viewers,
        category,
        thumbnail
      } = streamInfo;

      return {
        live: true,
        error: false,
        id,
        title: session_title,
        language,
        viewers,
        category,
        thumbnail: thumbnail.src || false,
        urls: {
          stream: `${this.BASE_URL}/${username}`
        },
        isMature: is_mature,
        start: DateTimeUtil.createStartInfo(created_at)
      };
    });
  }

  private static async fetchProfileData(username: string): Promise<KickProfileResult> {
    return await BrowserManager.withPage(async (page: Page) => {
      const url = `${this.API_BASE}/channels/${encodeURIComponent(username)}`;
      
      const response = await page.goto(url, {
        waitUntil: 'networkidle2'
      });

      if (!response || !response.ok()) {
        return {
          success: false,
          error: ErrorHandler.createHttpError(
            response?.status() || 0,
            response?.statusText() || 'Unknown error'
          )
        };
      }

      const data = await page.evaluate(() => document.body.textContent);
      if (!data) {
        return { success: false, error: 'Unable to fetch page content' };
      }

      const profileInfo = this.parseJsonResponse<KickProfileData>(data);
      if (!profileInfo) {
        return { success: false, error: false };
      }

      const { verified, user } = profileInfo;

      return {
        success: true,
        error: false,
        avatar: user.profile_pic,
        bio: user.bio,
        verified,
        socials: this.createSocialProfiles(user)
      };
    });
  }

  static async getStream(username: string): Promise<KickStreamResult> {
    try {
      this.validateUsername(username);
      return await this.fetchStreamData(username);
    } catch (error) {
      ErrorHandler.logError(error, 'Kick Stream');
      return {
        live: false,
        error: ErrorHandler.handleError(error, 'Kick Stream')
      };
    }
  }

  static async getStreamerProfile(username: string): Promise<KickProfileResult> {
    try {
      this.validateUsername(username);
      return await this.fetchProfileData(username);
    } catch (error) {
      ErrorHandler.logError(error, 'Kick Profile');
      return {
        success: false,
        error: ErrorHandler.handleError(error, 'Kick Profile')
      };
    }
  }
} 