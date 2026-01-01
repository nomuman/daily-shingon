# クライアント保存（iOS/Android/Web）

## 方針
- 既存: AsyncStorage key-value → 今後: ローカルDBへ集約
- native: SQLite（expo-sqlite）
- web: IndexedDB（idb等）

## Repository層
UIからは必ず Repository を通す：
- EntryRepository
  - upsertLocal()
  - listByDate()
  - listDirty()
  - applyRemote()
  - markClean()
  - syncNow()（同期は上位で呼ぶ）

## 注意
- Authセッション保存は Supabase推奨のstorageを使用（環境依存）
