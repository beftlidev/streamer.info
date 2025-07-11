import puppeteer, { Browser, Page } from 'puppeteer';
import { BrowserConfig } from '../types';

export class BrowserManager {
  private static instances: Map<string, Browser> = new Map();
  private static readonly DEFAULT_CONFIG: BrowserConfig = {
    headless: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    timeout: 30000
  };

  static async getInstance(key: string = 'default'): Promise<Browser> {
    if (!this.instances.has(key)) {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      this.instances.set(key, browser);
    }
    
    const instance = this.instances.get(key);
    if (!instance) {
      throw new Error(`Browser instance ${key} not found`);
    }
    
    return instance;
  }

  static async createPage(browserKey: string = 'default'): Promise<Page> {
    const browser = await this.getInstance(browserKey);
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setUserAgent(this.DEFAULT_CONFIG.userAgent);
    await page.setViewport({ width: 1920, height: 1080 });
    
    page.setDefaultNavigationTimeout(this.DEFAULT_CONFIG.timeout);
    page.setDefaultTimeout(this.DEFAULT_CONFIG.timeout);

    return page;
  }

  static async withPage<T>(
    operation: (page: Page) => Promise<T>,
    browserKey: string = 'default'
  ): Promise<T> {
    const page = await this.createPage(browserKey);
    try {
      return await operation(page);
    } finally {
      await page.close();
    }
  }

  static async closeBrowser(key: string = 'default'): Promise<void> {
    const browser = this.instances.get(key);
    if (browser) {
      await browser.close();
      this.instances.delete(key);
    }
  }

  static async closeAll(): Promise<void> {
    const closePromises = Array.from(this.instances.values()).map(browser => browser.close());
    await Promise.all(closePromises);
    this.instances.clear();
  }

  static async isConnected(key: string = 'default'): Promise<boolean> {
    const browser = this.instances.get(key);
    if (!browser) return false;
    
    try {
      await browser.version();
      return true;
    } catch {
      this.instances.delete(key);
      return false;
    }
  }
} 