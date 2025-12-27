# AGENTS.md

Project: sanmitsu-app (Expo + Expo Router)

## Quickstart

- Install deps: `npm install`
- Run app: `npx expo start` (or `npm run start`)

## Scripts

- Lint: `npm run lint`
- Tests: `npm test`

## Runtime notes

- CI uses Node 20.19.4; align local Node when possible.
- Expo Router app root is `src/app` (configured in `app.json`).

## Directory map

- `src/app/`: Screens / routes (Expo Router)
- `src/components/`: Reusable UI components
- `src/lib/`: Domain logic (storage, notifications, date math)
- `src/content/`: Content loaders and typed data
- `src/types/`: TypeScript types
- `content/`: Raw curriculum JSON (source of truth)

## Docs

- Product and UX docs live in `docs/` (see `docs/00_summary.md`).

## UI/UX conventions

- Theme tokens live in `src/ui/theme.ts`. Prefer these for colors, spacing, radius, and fonts.
- Screen backgrounds should use `theme.colors.background`; cards use `theme.colors.surface`.
- Wrap screens in `SafeAreaView` from `react-native-safe-area-context` to respect notches.
- Root layout uses `SafeAreaProvider` (`src/app/_layout.tsx`).
- Tab icons use SF Symbols on iOS via `expo-symbols` with MaterialIcons fallback (`src/app/(tabs)/_layout.tsx`).
