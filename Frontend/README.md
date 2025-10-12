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

## Backend connection (API)

This app talks to your Node/Express backend. Configure the API base URL via environment variables.

1) Create a `.env` file in the `Frontend/` folder (same place as `package.json`).

Pick ONE base URL depending on your platform and paste it into `.env`:

```
# Android Emulator
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:5000/api/medicine

# iOS Simulator
# EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api/medicine

# Physical device (replace with your PC LAN IP)
# EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api/medicine

# Optional: prefill a pharmacy id for the Admin form
# EXPO_PUBLIC_PHARMACY_ID=66f1c1...
```

2) Restart the Expo dev server so new env vars are loaded.

3) Test a backend route quickly (PowerShell):

```
curl -Method Get "http://localhost:5000/api/medicine/master/search?q=para"
```

4) In the app, go to Admin → "+ Add Medicine" and fill the form.
   - Pharmacy ID must be a valid ID from your database
   - Batch qty must equal stockQty (server rule)
   - Expiry must be a future date

If your medicine endpoints require auth later, add a Bearer token header in the request; we’ll wire this when you enable the middleware.
