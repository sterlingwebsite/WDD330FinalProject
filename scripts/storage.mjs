export const storage = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load(key, fallback = null) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};
