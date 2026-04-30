import '@testing-library/jest-dom';
import 'vitest-canvas-mock';

// jsdom does not implement ResizeObserver — provide a minimal stub
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this._callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};
