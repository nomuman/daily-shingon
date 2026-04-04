/**
 * Purpose: Persist whether the user has completed the initial onboarding flow. / 目的: 初回オンボーディング完了状態を保持。
 * Responsibilities: read/write onboarding completion as a simple app-level flag. / 役割: オンボーディング完了フラグの読込/保存。
 * Inputs: none for reads; completion state is always persisted as done. / 入力: 読込はなし、保存は常に完了状態。
 * Outputs: completion boolean or persisted completion marker. / 出力: 完了状態の真偽値または保存済みマーカー。
 * Dependencies: shared storage helpers. / 依存: 共通ストレージヘルパー。
 * Side effects: AsyncStorage reads/writes. / 副作用: AsyncStorageの読書き。
 * Edge cases: missing flag is treated as incomplete. / 例外: フラグ未保存は未完了として扱う。
 */
import { getString, setString } from './storage';

export const KEY_ONBOARDING_COMPLETED = 'app:onboardingCompleted';

export async function hasCompletedOnboarding(): Promise<boolean> {
  return (await getString(KEY_ONBOARDING_COMPLETED)) === '1';
}

export async function completeOnboarding(): Promise<void> {
  await setString(KEY_ONBOARDING_COMPLETED, '1');
}
