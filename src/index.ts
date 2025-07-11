import { UpdateService } from './services/update';
import { KickService } from './services/kick';
import { TwitchService } from './services/twitch';
import { YouTubeRSSService } from './services/youtube-rss';

import { BrowserManager } from './utils/browser';
import { ErrorHandler } from './utils/error';
import { DateTimeUtil } from './utils/date';

export * from './types';

export class Kick {
  static async getStream(username: string) {
    return await KickService.getStream(username);
  }

  static async getStreamerProfile(username: string) {
    return await KickService.getStreamerProfile(username);
  }
}

export class Twitch {
  static async getStream(username: string) {
    return await TwitchService.getStream(username);
  }
}

export class YouTube {
  static async getLatestVideo(username: string) {
    return await YouTubeRSSService.getLatestVideo(username);
  }

  static async getLatestShorts(username: string) {
    return await YouTubeRSSService.getLatestShorts(username);
  }

  static async getStream(username: string) {
    return await YouTubeRSSService.getStream(username);
  }
}

export async function checkUpdate(): Promise<void> {
  return await UpdateService.checkUpdate();
}

export async function silentCheckUpdate() {
  return await UpdateService.silentCheckUpdate();
}

export function getCurrentVersion(): string {
  return UpdateService.getCurrentVersion();
}

export async function cleanup(): Promise<void> {
  await BrowserManager.closeAll();
}

export async function isBrowserConnected(key?: string): Promise<boolean> {
  return await BrowserManager.isConnected(key);
}

export { checkUpdate as default };

export const Utils = {
  Browser: BrowserManager,
  Error: ErrorHandler,
  DateTime: DateTimeUtil
};

process.on('exit', () => {
  BrowserManager.closeAll().catch(() => {
  });
});

process.on('SIGINT', async () => {
  console.log('\n[Streamer.Info] Cleaning up...');
  await BrowserManager.closeAll();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await BrowserManager.closeAll();
  process.exit(0);
}); 