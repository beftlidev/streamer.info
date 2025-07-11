import { exec } from 'child_process';
import { promisify } from 'util';
import { UpdateCheckResponse } from '../types';
import { ErrorHandler } from '../utils/error';

const execAsync = promisify(exec);

export class UpdateService {
  private static readonly PACKAGE_NAME = 'streamer.info';
  private static _currentVersion: string;

  static {
    try {
      const packageJson = require('../../package.json');
      this._currentVersion = packageJson.version;
    } catch {
      this._currentVersion = '2.0.0';
    }
  }

  private static get CURRENT_VERSION(): string {
    return this._currentVersion;
  }

  private static async getLatestVersion(): Promise<UpdateCheckResponse> {
    try {
      const { stdout, stderr } = await execAsync(`npm view ${this.PACKAGE_NAME} version`);
      
      if (stderr) {
        return { error: stderr.trim() };
      }

      const version = stdout.trim();
      if (!version) {
        return { error: 'Version information could not be retrieved' };
      }

      return { version, error: false };
    } catch (error) {
      return { 
        error: ErrorHandler.handleError(error, 'Update Check') 
      };
    }
  }

  private static compareVersions(current: string, latest: string): number {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const latestPart = latestParts[i] || 0;
      
      if (currentPart < latestPart) return -1;
      if (currentPart > latestPart) return 1;
    }
    
    return 0;
  }

  static async checkUpdate(): Promise<void> {
    try {
      const versionInfo = await this.getLatestVersion();
      
      if (versionInfo.error) {
        console.warn(`[Update] Update check failed: ${versionInfo.error}`);
        return;
      }

      if (!versionInfo.version) {
        console.warn('[Update] Version information not found');
        return;
      }

      const comparison = this.compareVersions(this.CURRENT_VERSION, versionInfo.version);
      
      if (comparison < 0) {
        console.log(
          `\x1b[34m${this.PACKAGE_NAME} is out of date!\x1b[0m ` +
          `Use \x1b[32m"npm update ${this.PACKAGE_NAME}"\x1b[0m ` +
          `to take advantage of new features (${this.CURRENT_VERSION} -> ${versionInfo.version})`
        );
      } else if (comparison > 0) {
        console.log(`\x1b[33m[Update] You are using a development version: ${this.CURRENT_VERSION}\x1b[0m`);
      } else {
        console.log(`\x1b[32m[Update] ${this.PACKAGE_NAME} is up to date (v${this.CURRENT_VERSION})\x1b[0m`);
      }
    } catch (error) {
      ErrorHandler.logError(error, 'Update Check');
    }
  }

  static async silentCheckUpdate(): Promise<{
    isUpdateAvailable: boolean;
    currentVersion: string;
    latestVersion?: string;
    error?: string;
  }> {
    try {
      const versionInfo = await this.getLatestVersion();
      
      if (versionInfo.error) {
        return {
          isUpdateAvailable: false,
          currentVersion: this.CURRENT_VERSION,
          error: versionInfo.error
        };
      }

      if (!versionInfo.version) {
        return {
          isUpdateAvailable: false,
          currentVersion: this.CURRENT_VERSION,
          error: 'Version information not found'
        };
      }

      const comparison = this.compareVersions(this.CURRENT_VERSION, versionInfo.version);
      
      return {
        isUpdateAvailable: comparison < 0,
        currentVersion: this.CURRENT_VERSION,
        latestVersion: versionInfo.version
      };
    } catch (error) {
      return {
        isUpdateAvailable: false,
        currentVersion: this.CURRENT_VERSION,
        error: ErrorHandler.handleError(error, 'Update Check')
      };
    }
  }

  static getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }
} 