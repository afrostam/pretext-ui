import { describe, it, expect, beforeEach } from "vitest";
import { prepareCached, prepareWithSegmentsCached, clearPreparedCache } from "./pretext-helpers.js";

describe("pretext-helpers", () => {
  beforeEach(() => {
    clearPreparedCache();
  });

  describe("prepareCached", () => {
    it("returns a PreparedText object", () => {
      const result = prepareCached("hello world", "16px sans-serif");
      expect(result).toBeDefined();
      expect(typeof result).toBe("object");
    });

    it("returns the same object for the same text+font", () => {
      const a = prepareCached("hello", "16px sans-serif");
      const b = prepareCached("hello", "16px sans-serif");
      expect(a).toBe(b);
    });

    it("returns different objects for different text", () => {
      const a = prepareCached("hello", "16px sans-serif");
      const b = prepareCached("world", "16px sans-serif");
      expect(a).not.toBe(b);
    });

    it("returns different objects for different fonts", () => {
      const a = prepareCached("hello", "16px sans-serif");
      const b = prepareCached("hello", "14px monospace");
      expect(a).not.toBe(b);
    });
  });

  describe("prepareWithSegmentsCached", () => {
    it("returns an object with segments", () => {
      const result = prepareWithSegmentsCached("hello world", "16px sans-serif");
      expect(result).toBeDefined();
      expect(Array.isArray(result.segments)).toBe(true);
    });

    it("caches results", () => {
      const a = prepareWithSegmentsCached("test", "16px sans-serif");
      const b = prepareWithSegmentsCached("test", "16px sans-serif");
      expect(a).toBe(b);
    });
  });

  describe("clearPreparedCache", () => {
    it("clears the cache so new objects are returned", () => {
      const a = prepareCached("hello", "16px sans-serif");
      clearPreparedCache();
      const b = prepareCached("hello", "16px sans-serif");
      expect(a).not.toBe(b);
    });
  });
});
