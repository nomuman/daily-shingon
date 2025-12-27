import { KEY_LAST_ACTIVE_DATE } from './engagement';
import { KEY_START_DATE } from './programDay';
import { getAllKeys, multiRemove } from './storage';

const KEY_PREFIXES = ['todayLog:action:', 'morningLog:', 'nightLog:'];

export async function resetAllProgress(): Promise<void> {
  const keys = await getAllKeys();
  const target = keys.filter((key) => {
    if (key === KEY_START_DATE) return true;
    if (key === KEY_LAST_ACTIVE_DATE) return true;
    return KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
  });

  await multiRemove(target);
}
