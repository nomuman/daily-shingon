-- 0) extensions
create extension if not exists "pgcrypto";

-- 1) profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) devices
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('ios','android','web','unknown')),
  model text,
  push_token text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists devices_user_id_idx on public.devices(user_id);

-- 3) user_settings
create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reminder_morning_time text not null default '07:00',
  reminder_night_time text not null default '21:00',
  reminder_enabled boolean not null default true,
  tone text not null default 'neutral' check (tone in ('neutral','gentle')),
  sync_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  settings_version int not null default 1
);

-- 4) entries
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid references public.devices(id) on delete set null,

  entry_date date not null,
  slot text not null check (slot in ('morning','night')),

  body_done boolean not null default false,
  speech_done boolean not null default false,
  mind_done boolean not null default false,

  action_pick text check (action_pick in ('body','speech','mind')),
  sange text check (sange in ('body','speech','mind')),
  hatsugan text check (hatsugan in ('body','speech','mind')),
  eko text check (eko in ('self','family','team','all')),

  note_ciphertext text,
  note_nonce text,
  note_version int not null default 1,

  client_updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint entries_unique_user_day_slot unique (user_id, entry_date, slot)
);

create index if not exists entries_user_day_idx on public.entries(user_id, entry_date);

-- 5) bookmarks
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

-- 6) progress
create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

-- 7) RLS enable（ポリシーは別ファイルで定義してもOK）
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.user_settings enable row level security;
alter table public.entries enable row level security;
alter table public.bookmarks enable row level security;
alter table public.progress enable row level security;
