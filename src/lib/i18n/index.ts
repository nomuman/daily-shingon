/**
 * Purpose: i18n initialization and language preference handling. / 目的: i18n初期化と言語設定の管理。
 * Responsibilities: initialize i18next, switch languages, and sync on foreground. / 役割: i18next初期化、言語切替、フォアグラウンド同期。
 * Inputs: stored language preference and device language. / 入力: 保存済み言語設定と端末言語。
 * Outputs: configured i18n instance and setters/getters. / 出力: 設定済みi18nインスタンスと操作関数。
 * Dependencies: i18next, react-i18next, AsyncStorage, device locale detection. / 依存: i18next、react-i18next、AsyncStorage、端末言語検出。
 * Side effects: i18n init and language change; AppState listener registration. / 副作用: i18n初期化/言語変更、AppStateリスナー登録。
 * Edge cases: init failures fall back to English. / 例外: 初期化失敗時は英語にフォールバック。
 */
/* eslint-disable import/no-named-as-default-member -- i18nリソースのデフォルト取り込みに対するLintを無効化 */
import '@formatjs/intl-pluralrules/locale-data/en.js';
import '@formatjs/intl-pluralrules/locale-data/ja.js';
import '@formatjs/intl-pluralrules/polyfill-force.js';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppState } from 'react-native';

import { detectDeviceLanguage } from './detectLocale';
import type { LanguageCode, LanguagePreference } from './storage';
import { loadLanguagePreference, saveLanguagePreference } from './storage';

import enCommon from '../../locales/en/common.json';
import jaCommon from '../../locales/ja/common.json';

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['ja', 'en'];

// Static resource bundle for common namespace. / common名前空間の静的リソース。
const resources = {
  ja: { common: jaCommon },
  en: { common: enCommon },
} as const;

let currentPref: LanguagePreference = 'system';
let attached = false;
let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;

// Initialize i18n with stored or system preference. / 保存済みまたはシステム設定でi18n初期化。
export async function initI18n() {
  try {
    currentPref = await loadLanguagePreference();
  } catch (err) {
    console.error('Failed to load language preference. Falling back to system.', err);
    currentPref = 'system';
  }

  const lang = currentPref === 'system' ? detectDeviceLanguage() : currentPref;

  try {
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        resources,
        lng: lang,
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        react: {
          useSuspense: false,
        },
        interpolation: {
          escapeValue: false,
        },
      });
    } else {
      await i18n.changeLanguage(lang);
    }
  } catch (err) {
    console.error('Failed to initialize i18n. Falling back to English.', err);
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        react: {
          useSuspense: false,
        },
        interpolation: {
          escapeValue: false,
        },
      });
    } else {
      await i18n.changeLanguage('en');
    }
  }

  attachForegroundLocaleSync();
}

export function getI18n() {
  return i18n;
}

// Persist preference and apply it, with rollback on failure. / 設定を保存して適用（失敗時はロールバック）。
export async function setLanguagePreference(pref: LanguagePreference) {
  const prev = currentPref;
  currentPref = pref;
  try {
    await saveLanguagePreference(pref);
    const lang = pref === 'system' ? detectDeviceLanguage() : pref;
    await i18n.changeLanguage(lang);
  } catch (err) {
    console.error('Failed to update language preference.', err);
    currentPref = prev;
    const prevLang = prev === 'system' ? detectDeviceLanguage() : prev;
    try {
      await i18n.changeLanguage(prevLang);
    } catch (restoreErr) {
      console.error('Failed to restore language after update error.', restoreErr);
    }
    throw err;
  }
}

export async function getLanguagePreference(): Promise<LanguagePreference> {
  currentPref = await loadLanguagePreference();
  return currentPref;
}

// Sync language when app comes to foreground and pref is "system". / フォアグラウンド復帰時にシステム言語へ同期。
async function syncWithDeviceIfNeeded() {
  if (currentPref !== 'system') return;
  const lang = detectDeviceLanguage();
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
}

// Register AppState listener once. / AppStateリスナーを一度だけ登録。
function attachForegroundLocaleSync() {
  if (attached) return;
  attached = true;

  appStateSubscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      syncWithDeviceIfNeeded().catch((err) => {
        console.error('Failed to sync locale on app foreground.', err);
      });
    }
  });
}

// Remove AppState listener and reset attachment state. / AppStateリスナー解除と状態リセット。
export function detachForegroundLocaleSync() {
  appStateSubscription?.remove();
  appStateSubscription = null;
  attached = false;
}
