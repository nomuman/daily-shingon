# セキュリティ設計（RLS）

## 前提: RLS を必ず有効化

Supabaseでは Postgres RLS（Policy）で “行単位の認可” を実装する。  
`auth.uid()` は未認証だと null になるので、意図を明確に書くのが推奨。  
:contentReference[oaicite:16]{index=16}

## 基本パターン

- SELECT: 自分の行だけ
- INSERT: user_id が auth.uid() と一致する行だけ
- UPDATE/DELETE: 自分の行だけ

## Policy SQL（例）

※ 実運用はテーブルごとに同じ型で揃える。

### entries: select

- authenticated + user_id一致

### entries: insert/update

- `with check` で user_idのすり替えを防ぐ

## Realtime を使う場合

- supabase_realtime publication に entries 等を追加する  
  :contentReference[oaicite:17]{index=17}
- ただし “RealtimeはUX補助”。正は必ず Pull（再同期）で担保する

```sql
-- （RLS policy例。migrationに分けてもOK）

-- profiles
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

create policy "profiles_upsert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

-- entries
create policy "entries_select_own"
on public.entries for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

create policy "entries_insert_own"
on public.entries for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

create policy "entries_update_own"
on public.entries for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

create policy "entries_delete_own"
on public.entries for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());
```
