/**
 * Basic functionality tests
 */

import { 
  Kick, 
  Twitch, 
  YouTube, 
  checkUpdate, 
  getCurrentVersion, 
  Utils 
} from '../index';

describe('Streamer.Info Basic Tests', () => {
  
  describe('Version and Update Functions', () => {
    test('getCurrentVersion should return a version string', () => {
      const version = getCurrentVersion();
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('checkUpdate should not throw error', async () => {
      await expect(checkUpdate()).resolves.not.toThrow();
    });
  });

  describe('Platform Classes Exist', () => {
    test('Kick class should exist with getStream method', () => {
      expect(Kick).toBeDefined();
      expect(typeof Kick.getStream).toBe('function');
      expect(typeof Kick.getStreamerProfile).toBe('function');
    });

    test('Twitch class should exist with getStream method', () => {
      expect(Twitch).toBeDefined();
      expect(typeof Twitch.getStream).toBe('function');
    });

    test('YouTube class should exist with required methods', () => {
      expect(YouTube).toBeDefined();
      expect(typeof YouTube.getLatestVideo).toBe('function');
      expect(typeof YouTube.getLatestShorts).toBe('function');
      expect(typeof YouTube.getStream).toBe('function');
    });
  });

  describe('Utils Classes', () => {
    test('Utils should contain Browser, Error, DateTime classes', () => {
      expect(Utils).toBeDefined();
      expect(Utils.Browser).toBeDefined();
      expect(Utils.Error).toBeDefined();
      expect(Utils.DateTime).toBeDefined();
    });

    test('Utils.DateTime should have required methods', () => {
      expect(typeof Utils.DateTime.getCurrentTimestamp).toBe('function');
      expect(typeof Utils.DateTime.createStartInfo).toBe('function');
    });

    test('Utils.Error should have required methods', () => {
      expect(typeof Utils.Error.handleError).toBe('function');
      expect(typeof Utils.Error.createStreamerError).toBe('function');
    });
  });

  describe('Error Handling', () => {
    test('Kick.getStream should handle invalid username', async () => {
      const result = await Kick.getStream('');
      expect(result.live).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('Twitch.getStream should handle invalid username', async () => {
      const result = await Twitch.getStream('');
      expect(result.live).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('YouTube.getLatestVideo should handle invalid username', async () => {
      const result = await YouTube.getLatestVideo('');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Date Utils', () => {
    test('getCurrentTimestamp should return number', () => {
      const timestamp = Utils.DateTime.getCurrentTimestamp();
      expect(typeof timestamp).toBe('number');
      expect(timestamp).toBeGreaterThan(0);
    });

    test('createStartInfo should handle valid date string', () => {
      const startInfo = Utils.DateTime.createStartInfo('2024-01-01T12:00:00Z');
      expect(startInfo).toHaveProperty('date');
      expect(startInfo).toHaveProperty('timestamp');
      expect(startInfo.timestamp).toHaveProperty('discord');
      expect(startInfo.timestamp.discord).toHaveProperty('relative');
    });
  });
}); 