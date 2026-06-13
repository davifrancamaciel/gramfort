type Stored<T> = {
  value: T;
  expiresAt?: number;
};

const buildKey = (key: string, namespace?: string) =>
  namespace && namespace.length ? `${namespace}:${key}` : key;

const safeParse = (raw: string | null) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const localStorageRepository = {
  setItem<T = any>(key: string, value: T, options?: { namespace?: string; ttlSeconds?: number }) {
    try {
      const k = buildKey(key, options?.namespace);
      const stored: Stored<T> = { value };
      if (options?.ttlSeconds && options.ttlSeconds > 0) {
        stored.expiresAt = Date.now() + options.ttlSeconds * 1000;
      }
      localStorage.setItem(k, JSON.stringify(stored));
      return true;
    } catch (e) {
      return false;
    }
  },

  getItem<T = any>(key: string, namespace?: string): T | null {
    try {
      const k = buildKey(key, namespace);
      const raw = localStorage.getItem(k);
      const parsed = safeParse(raw) as Stored<T> | null;
      if (!parsed) return null;
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(k);
        return null;
      }
      return parsed.value;
    } catch (e) {
      return null;
    }
  },

  removeItem(key: string, namespace?: string) {
    try {
      const k = buildKey(key, namespace);
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  },

  clearNamespace(namespace: string) {
    try {
      const prefix = `${namespace}:`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      return true;
    } catch (e) {
      return false;
    }
  },

  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  },

  keys(namespace?: string) {
    const result: string[] = [];
    const prefix = namespace && namespace.length ? `${namespace}:` : undefined;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (prefix) {
        if (k.startsWith(prefix)) result.push(k.replace(prefix, ''));
      } else {
        result.push(k);
      }
    }
    return result;
  }
};

export default localStorageRepository;
