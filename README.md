# Cuban Cigar App

Ionic React app built with Vite and Capacitor for Android.

## Prerequisites

- Node.js and npm installed.
- Android Studio installed if you want to run the Android app.
- Android SDK configured in Android Studio.

## Install Dependencies

Run this once after cloning the project:

```bash
npm install
```

## Run Locally in the Browser

Start the Vite development server:

```bash
npm run dev
```

Then open the local URL printed in the terminal, usually:

```text
http://localhost:5173
```

The browser view supports hot reload, so code changes should appear automatically while the dev server is running.

## Run in Android Studio

Capacitor uses the production web build from `dist`, so build and sync the web app before opening Android Studio:

```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio will open the `android` project. From there:

1. Wait for Gradle sync to finish.
2. Select an emulator or connected Android device.
3. Click Run.

## Updating the Android App After Web Changes

Any time you change the React/Ionic code and want to test it again in Android Studio, run:

```bash
npm run build
npx cap sync android
```

Then run the app again from Android Studio.

## Useful Commands

```bash
npm run dev       # Run the app locally in the browser
npm run build     # Create the production web build in dist
npm run preview   # Preview the production build locally
npx cap sync android
npx cap open android
```
