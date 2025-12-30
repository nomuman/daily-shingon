/**
 * Purpose: Thin AsyncStorage wrapper with JSON helpers. / 目的: AsyncStorageの薄いラッパーとJSONヘルパー。
 * Responsibilities: get/set/remove string values and safe JSON parse/serialize. / 役割: 文字列の取得/保存/削除と安全なJSON変換。
 * Inputs: storage keys and values. / 入力: ストレージキーと値。
 * Outputs: stored data or parsed JSON. / 出力: 保存データまたは解析済みJSON。
 * Dependencies: @react-native-async-storage/async-storage. / 依存: AsyncStorageライブラリ。
 * Side effects: persistent storage I/O. / 副作用: 永続ストレージI/O。
 * Edge cases: invalid JSON clears the stored value and returns null. / 例外: 不正JSONは削除しnull返却。
 */
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

// Parse JSON and self-heal by removing invalid payloads. / JSONを解析し不正なら自己修復（削除）。
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
