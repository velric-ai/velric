// utils/envSafe.ts
export const isBrowser = typeof window !== "undefined";

export const getLocalStorageItem = (key: string): string | null => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setLocalStorageItem = (key: string, value: string) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    console.warn("Failed to write localStorage:", key);
  }
};
