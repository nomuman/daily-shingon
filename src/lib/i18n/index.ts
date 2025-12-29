/* eslint-disable import/no-named-as-default-member */
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

const resources = {
  ja: { common: jaCommon },
  en: { common: enCommon },
} as const;

let currentPref: LanguagePreference = 'system';
let attached = false;

export async function initI18n() {
  currentPref = await loadLanguagePreference();
  const lang = currentPref === 'system' ? detectDeviceLanguage() : currentPref;

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

  attachForegroundLocaleSync();
}

export function getI18n() {
  return i18n;
}

export async function setLanguagePreference(pref: LanguagePreference) {
  currentPref = pref;
  await saveLanguagePreference(pref);

  const lang = pref === 'system' ? detectDeviceLanguage() : pref;
  await i18n.changeLanguage(lang);
}

export async function getLanguagePreference(): Promise<LanguagePreference> {
  currentPref = await loadLanguagePreference();
  return currentPref;
}

async function syncWithDeviceIfNeeded() {
  if (currentPref !== 'system') return;
  const lang = detectDeviceLanguage();
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
}

function attachForegroundLocaleSync() {
  if (attached) return;
  attached = true;

  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void syncWithDeviceIfNeeded();
    }
  });
}
