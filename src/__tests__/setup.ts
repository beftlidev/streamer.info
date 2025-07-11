/**
 * Jest Test Setup
 * Test ortamı için gerekli global konfigürasyonlar
 */

// Test timeout'ını artır
jest.setTimeout(30000);

// Console log'ları test sırasında göster
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  if (args[0]?.includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (args[0]?.includes && args[0].includes('Warning:')) {
    return;
  }
  originalConsoleWarn.call(console, ...args);
};

// Global test teardown
afterAll(async () => {
  // Cleanup any open browser instances
  try {
    const { Utils } = await import('../index');
    await Utils.Browser.closeAll();
  } catch (error) {
    // Silent fail in tests
  }
});

// Mock puppeteer for tests that don't need real browser
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn().mockResolvedValue({ ok: () => true }),
      evaluate: jest.fn().mockResolvedValue({}),
      setUserAgent: jest.fn(),
      setViewport: jest.fn(),
      setRequestInterception: jest.fn(),
      on: jest.fn(),
      setDefaultNavigationTimeout: jest.fn(),
      setDefaultTimeout: jest.fn(),
      close: jest.fn()
    }),
    close: jest.fn(),
    version: jest.fn().mockResolvedValue('120.0.0')
  })
})); 