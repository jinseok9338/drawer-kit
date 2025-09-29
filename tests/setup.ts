import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver for vaul compatibility
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver for vaul compatibility
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock requestAnimationFrame for smooth animations in tests
global.requestAnimationFrame = (cb) => {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock CSS custom properties for vaul animations
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    webkitTransform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
    mozTransform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
  }),
});

// Mock pointer capture for vaul drag interactions
HTMLElement.prototype.setPointerCapture = vi.fn();
HTMLElement.prototype.releasePointerCapture = vi.fn();

// Mock CSS transform properties for elements
Object.defineProperty(HTMLElement.prototype, "style", {
  value: new Proxy(
    {},
    {
      get: (target, prop) => {
        if (prop === "transform" || prop === "webkitTransform" || prop === "mozTransform") {
          return "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)";
        }
        if (prop === "setProperty") {
          return vi.fn();
        }
        if (prop === "getPropertyValue") {
          return vi.fn(() => "");
        }
        if (prop === "removeProperty") {
          return vi.fn();
        }
        return target[prop] || "";
      },
      set: (target, prop, value) => {
        target[prop] = value;
        return true;
      },
    }
  ),
  writable: true,
  configurable: true,
});

// Mock getBoundingClientRect for layout calculations
HTMLElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {},
}));
