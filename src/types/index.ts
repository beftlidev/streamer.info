export interface BaseResponse {
  error: string | false;
}

export interface BaseStreamResponse extends BaseResponse {
  live: boolean;
}

export interface BaseSuccessResponse extends BaseResponse {
  success: boolean;
}
export interface TimeInfo {
  full: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export interface DateInfo {
  full: string;
  month: string;
  day: string;
  year: string;
}

export interface DateTimeInfo {
  time: TimeInfo;
  date: DateInfo;
}

export interface DiscordTimestamp {
  shortTime: string;
  longTime: string;
  shortDate: string;
  longDate: string;
  longDateWithShortTime: string;
  longDateWithDayOfWeekAndShortTime: string;
  relative: string;
}

export interface TimestampInfo {
  row: number;
  discord: DiscordTimestamp;
}

export interface StartInfo {
  date: {
    row: string;
    full: string;
    separately: DateTimeInfo;
  };
  timestamp: TimestampInfo;
}

export interface StreamUrls {
  stream: string;
  fullScreen?: string;
}

export interface VideoUrls {
  video: string;
}
export interface TwitchThumbnail {
  src: string[] | false;
  bestResolution: string | false;
}

export interface SimpleThumbnail {
  src: string | false;
}

export interface SocialMedia {
  row: string | false;
  link?: string | false;
}

export interface SocialMediaProfiles {
  instagram: SocialMedia;
  x: SocialMedia;
  youtube: SocialMedia;
  discord: Omit<SocialMedia, 'link'>;
  tiktok: SocialMedia;
  facebook: SocialMedia;
}
export interface KickStreamResponse extends BaseStreamResponse {
  live: true;
  id?: string;
  title: string;
  language: string;
  viewers: number;
  category: string;
  thumbnail: string | false;
  urls: StreamUrls;
  isMature: boolean;
  start: StartInfo;
}

export interface KickStreamOfflineResponse extends BaseStreamResponse {
  live: false;
}

export type KickStreamResult = KickStreamResponse | KickStreamOfflineResponse;

export interface KickProfileResponse extends BaseSuccessResponse {
  success: true;
  avatar: string;
  bio: string;
  verified: boolean;
  socials: SocialMediaProfiles;
}

export interface KickProfileErrorResponse extends BaseSuccessResponse {
  success: false;
}

export type KickProfileResult = KickProfileResponse | KickProfileErrorResponse;

export interface TwitchStreamResponse extends BaseStreamResponse {
  live: true;
  name: string;
  avatar: string;
  title: string;
  viewers: number;
  thumbnail: TwitchThumbnail;
  urls: StreamUrls;
  start: StartInfo;
}

export interface TwitchStreamOfflineResponse extends BaseStreamResponse {
  live: false;
}

export type TwitchStreamResult = TwitchStreamResponse | TwitchStreamOfflineResponse;

export interface YouTubeVideoResponse extends BaseSuccessResponse {
  success: true;
  title: string;
  thumbnail: string;
  urls: VideoUrls;
}

export interface YouTubeVideoErrorResponse extends BaseSuccessResponse {
  success: false;
}

export type YouTubeVideoResult = YouTubeVideoResponse | YouTubeVideoErrorResponse;

export interface YouTubeStreamResponse extends BaseStreamResponse {
  live: true;
  title: string;
  viewers: string;
  thumbnail: string;
  urls: VideoUrls;
}

export interface YouTubeStreamOfflineResponse extends BaseStreamResponse {
  live: false;
}

export type YouTubeStreamResult = YouTubeStreamResponse | YouTubeStreamOfflineResponse;

export interface UpdateCheckResponse {
  version?: string;
  error: string | false;
}

export interface BrowserConfig {
  headless: boolean;
  userAgent: string;
  timeout: number;
}
export interface StreamerError extends Error {
  platform?: string;
  username?: string;
  statusCode?: number;
} 