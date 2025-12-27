# sanmitsu-app

三密（身・口・意）の「学び→実践→整え（懺悔・発願・回向）」を、毎日短時間で回すための実践サポートアプリ。

## Features (MVP)
- Morning: 三密チェックイン（3分）
- Learn: 1日1枚の学びカード（30秒）
- Night: 懺悔→発願→回向（45秒）
- Log: 週次の三密バランス

## Tech
- Expo + Expo Router (file-based routing)
- Local storage: AsyncStorage (MVP)
- Notifications: expo-notifications

## Setup
```bash
npm install
npx expo start
```

## Scripts
- `npm run lint`
- `npm test`

Note: CI uses Node 20.19.4. Aligning local Node is recommended.

## Privacy (MVP)
- No personal data collection
- Logs stay on device (no sync)
- If sensitive data is introduced later, consider SecureStore

## Directory Conventions
- `src/app/`: Screens (Expo Router app root)
- `src/content/`: Content loaders (JSON -> typed data)
- `src/lib/`: Domain logic (day calculation, storage, notifications)
- `src/components/`: UI components (LearnCard, Button, etc.)
- `src/types/`: TypeScript types
- `content/`: Raw curriculum JSON (source of truth)

Note: Expo Router app root is configured to `src/app` via the `expo-router` plugin in `app.json`.

## Project Docs
- docs/00_summary.md
- docs/01_concept.md
- docs/02_lean_canvas.md
- docs/03_ux_ia.md
- docs/04_data_model.md
- docs/05_content_policy.md
- docs/06_copy_tone.md
- docs/10_curriculum_30days.md
- docs/11_release_eas.md

## Content
- content/curriculum/30days.ja.json
