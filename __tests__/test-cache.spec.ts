import * as fs from "fs";
import { BasicCache } from "../src";

const TEST_CACHE_FILE = "/tmp/test-cache.json";
const TEST_OBJECT = {
  foo: "bar",
  arr: [1, 2, 3],
  nested: { a: "b", c: { d: "e", f: [4, 5, 6] } },
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Test basic cache operations", () => {
  let cache: BasicCache;

  beforeEach(() => {
    cache = new BasicCache({ cacheFile: TEST_CACHE_FILE });
    cache.clear();
  });

  afterAll(() => {
    // Clean up
    if (fs.existsSync(TEST_CACHE_FILE)) {
      fs.unlinkSync(TEST_CACHE_FILE);
    }
  });

  it("should cache and retrieve values", () => {
    // Arrange

    // Act
    cache.set("stringKey", "value");
    cache.set("numKey", 123);
    cache.set("boolKey", true);
    cache.set("objKey", TEST_OBJECT);

    // Assert
    expect(cache.get("stringKey")).toBe("value");
    expect(cache.get("numKey")).toBe(123);
    expect(cache.get("boolKey")).toBe(true);
    expect(cache.get("objKey")).toEqual(TEST_OBJECT);
  });

  it("should delete cached value", () => {
    // Arrange

    // Act
    cache.set("key", TEST_OBJECT);
    cache.delete("key");

    // Assert
    expect(cache.get("key")).toBeUndefined();
  });

  it("should delete cached value after ttl", async () => {
    // Arrange

    // Act
    cache.set("key", TEST_OBJECT, 1000);
    await delay(1000);

    // Assert
    expect(cache.get("key")).toBeUndefined();
  });

  it("should persist cache", () => {
    // Arrange
    cache.set("key", TEST_OBJECT, 1000);

    // Act
    cache = new BasicCache({ cacheFile: TEST_CACHE_FILE });

    // Assert
    expect(cache.get("key")).toEqual(TEST_OBJECT);
  });
});
