import { StartInfo, TimeInfo, DateInfo, DateTimeInfo, TimestampInfo, DiscordTimestamp } from '../types';

export class DateTimeUtil {
  static extractTimeInfo(date: Date): TimeInfo {
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return {
      full: `${hours}:${minutes}:${seconds}`,
      hours,
      minutes,
      seconds
    };
  }

  static extractDateInfo(date: Date): DateInfo {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear());

    return {
      full: `${month}/${day}/${year}`,
      month,
      day,
      year
    };
  }

  static extractDateTimeInfo(date: Date): DateTimeInfo {
    return {
      time: this.extractTimeInfo(date),
      date: this.extractDateInfo(date)
    };
  }

  static createDiscordTimestamp(timestamp: number): DiscordTimestamp {
    return {
      shortTime: `<t:${timestamp}:t>`,
      longTime: `<t:${timestamp}:T>`,
      shortDate: `<t:${timestamp}:d>`,
      longDate: `<t:${timestamp}:D>`,
      longDateWithShortTime: `<t:${timestamp}:f>`,
      longDateWithDayOfWeekAndShortTime: `<t:${timestamp}:F>`,
      relative: `<t:${timestamp}:R>`
    };
  }

  static createTimestampInfo(timestamp: number): TimestampInfo {
    return {
      row: timestamp,
      discord: this.createDiscordTimestamp(timestamp)
    };
  }

  static createStartInfo(dateString: string): StartInfo {
    const date = new Date(dateString);
    const timestamp = Math.floor(date.getTime() / 1000);
    const timeInfo = this.extractTimeInfo(date);
    const dateInfo = this.extractDateInfo(date);

    return {
      date: {
        row: dateString,
        full: `${timeInfo.full} ${dateInfo.full}`,
        separately: {
          time: timeInfo,
          date: dateInfo
        }
      },
      timestamp: this.createTimestampInfo(timestamp)
    };
  }

  static isValidDateString(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  static getMinutesDifference(date1: Date, date2: Date): number {
    return Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60);
  }

  static isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }
} 