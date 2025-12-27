import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getString(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function setString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function getAllKeys(): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return [...keys];
}

export async function multiRemove(keys: string[]): Promise<void> {
  if (!keys.length) return;
  await AsyncStorage.multiRemove(keys);
}

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await getString(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    await removeItem(key);
    return null;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await setString(key, JSON.stringify(value));
}
