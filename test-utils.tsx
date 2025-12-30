import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

import { ThemeProvider } from './src/ui/theme';

export function withProviders(ui: ReactElement) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>{ui}</ThemeProvider>
    </I18nextProvider>
  );
}
