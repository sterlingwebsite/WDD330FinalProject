// LocalStorage wrapper

export const storage = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load(key, fallback = null) {
    const item = localStorage.getItem(key);
    if (!item) return fallback;

    try {
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Invalid JSON for key "${key}". Resetting it.`);
      this.save(key, fallback);
      return fallback;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};
