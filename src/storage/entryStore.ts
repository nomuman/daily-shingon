/**
 * Purpose: Shared EntryStore exports. / 目的: EntryStore共通エクスポート。
 * Notes: Platform-specific implementations live in entryStore.native/web. / 備考: 実装はplatform別。
 */
export type { Entry, EntryEko, EntryPick, EntrySlot, EntryStore } from './entryStore.types';
export { entryStore } from './entryStore.native';
