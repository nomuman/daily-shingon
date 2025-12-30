jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const SafeAreaView = React.forwardRef((props, ref) =>
    React.createElement(View, { ...props, ref }),
  );
  SafeAreaView.displayName = 'SafeAreaView';

  return {
    SafeAreaView,
    SafeAreaProvider: ({ children }) => children,
    SafeAreaInsetsContext: React.createContext(null),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const i18n = require('i18next');
const { initReactI18next } = require('react-i18next');
const enCommon = require('./src/locales/en/common.json');
const jaCommon = require('./src/locales/ja/common.json');

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    ja: { common: jaCommon },
  },
  lng: 'ja',
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  initImmediate: false,
});
