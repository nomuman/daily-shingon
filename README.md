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
- Notifications: expo-notifications (予定)

## Project Docs
- docs/00_concept.md
- docs/01_lean_canvas.md
- docs/02_ux_ia.md
- docs/03_data_model.md
- docs/04_content_policy.md
- docs/05_copy_tone.md
- docs/10_curriculum_30days.md

## Content
- content/curriculum/30days.ja.json


---

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
