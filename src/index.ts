import * as fs from "fs";

interface BasicCacheOptions {
  cacheFile?: string;
  defaultTTL?: number;
}

interface BasicCacheValue {
  value: unknown;
  ttl?: number;
}

export class BasicCache {
  cache: Map<string, BasicCacheValue>;
  options: BasicCacheOptions;

  constructor(options: BasicCacheOptions = {}) {
    this.options = { ...options };

    if (this.options.cacheFile && fs.existsSync(this.options.cacheFile)) {
      // Load cache from disk
      const data = fs.readFileSync(this.options.cacheFile, "utf-8");
      const dataObj = JSON.parse(data);

      this.cache = new Map(Object.entries(dataObj));
    } else {
      this.cache = new Map();
    }
  }

  set(key: string, value: unknown, ttl?: number) {
    this.cache.set(key, {
      value,
      ttl: ttl ? Date.now() + ttl : this.options.defaultTTL,
    });
    this.persist();
  }

  get(key: string) {
    const val = this.cache.get(key);

    if (val && (!val.ttl || val.ttl > Date.now())) {
      return val.value;
    }
  }

  delete(key: string) {
    this.cache.delete(key);
    this.persist();
  }

  clear() {
    this.cache.clear();
    this.persist();
  }

  private persist() {
    // Persist cache to disk
    if (this.options.cacheFile) {
      const data = Object.fromEntries(this.cache.entries());

      fs.writeFileSync(this.options.cacheFile, JSON.stringify(data));
    }
  }
}
