-- updated_at helpers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.set_server_updated_at()
returns trigger as $$
begin
  new.server_updated_at = now();
  return new;
end;
$$ language plpgsql;

-- updated_at triggers

-- profiles
alter table public.profiles enable row level security;
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- user_settings
alter table public.user_settings enable row level security;
drop trigger if exists trg_user_settings_updated_at on public.user_settings;
create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

-- entries
alter table public.entries enable row level security;
drop trigger if exists trg_entries_server_updated_at on public.entries;
create trigger trg_entries_server_updated_at
before update on public.entries
for each row execute function public.set_server_updated_at();

-- devices/bookmarks/progress
alter table public.devices enable row level security;
alter table public.bookmarks enable row level security;
alter table public.progress enable row level security;

-- indexes for sync
create index if not exists entries_user_server_updated_at_idx
on public.entries(user_id, server_updated_at);

-- RLS policies

-- profiles

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own
on public.profiles
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

-- devices

drop policy if exists devices_select_own on public.devices;
create policy devices_select_own
on public.devices
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists devices_insert_own on public.devices;
create policy devices_insert_own
on public.devices
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists devices_update_own on public.devices;
create policy devices_update_own
on public.devices
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists devices_delete_own on public.devices;
create policy devices_delete_own
on public.devices
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

-- user_settings

drop policy if exists user_settings_select_own on public.user_settings;
create policy user_settings_select_own
on public.user_settings
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists user_settings_insert_own on public.user_settings;
create policy user_settings_insert_own
on public.user_settings
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists user_settings_update_own on public.user_settings;
create policy user_settings_update_own
on public.user_settings
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists user_settings_delete_own on public.user_settings;
create policy user_settings_delete_own
on public.user_settings
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

-- entries

drop policy if exists entries_select_own on public.entries;
create policy entries_select_own
on public.entries
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists entries_insert_own on public.entries;
create policy entries_insert_own
on public.entries
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists entries_update_own on public.entries;
create policy entries_update_own
on public.entries
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists entries_delete_own on public.entries;
create policy entries_delete_own
on public.entries
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

-- bookmarks

drop policy if exists bookmarks_select_own on public.bookmarks;
create policy bookmarks_select_own
on public.bookmarks
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists bookmarks_insert_own on public.bookmarks;
create policy bookmarks_insert_own
on public.bookmarks
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists bookmarks_update_own on public.bookmarks;
create policy bookmarks_update_own
on public.bookmarks
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists bookmarks_delete_own on public.bookmarks;
create policy bookmarks_delete_own
on public.bookmarks
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

-- progress

drop policy if exists progress_select_own on public.progress;
create policy progress_select_own
on public.progress
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

drop policy if exists progress_insert_own on public.progress;
create policy progress_insert_own
on public.progress
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists progress_update_own on public.progress;
create policy progress_update_own
on public.progress
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

drop policy if exists progress_delete_own on public.progress;
create policy progress_delete_own
on public.progress
for delete
to authenticated
using (auth.uid() is not null and user_id = auth.uid());
