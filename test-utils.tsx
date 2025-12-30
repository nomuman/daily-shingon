import type { ReactElement } from 'react';
import renderer from 'react-test-renderer';
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

export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

export async function renderWithProviders(ui: ReactElement) {
  let tree: renderer.ReactTestRenderer | undefined;
  await renderer.act(async () => {
    tree = renderer.create(withProviders(ui));
    await flushPromises();
  });
  if (!tree) throw new Error('renderer not created');
  return tree;
}

export async function unmountWithAct(tree: renderer.ReactTestRenderer) {
  await renderer.act(async () => {
    tree.unmount();
    await flushPromises();
  });
}
