# 🎤 Voice Search Not Listening - Troubleshooting Guide

## Why Voice Search Is Not Working

The voice recognition library needs additional setup beyond just installing it. Here's what you need to do:

## ✅ Step-by-Step Fix

### Step 1: Verify Installation

Run this to make sure the package is installed:

```bash
cd PharmaPlus-client/Frontend
npm list @react-native-voice/voice
```

If not installed, run:

```bash
npm install @react-native-voice/voice
```

### Step 2: For iOS (If testing on iPhone/iPad)

**A. Install CocoaPods dependencies:**

```bash
cd ios
pod install
cd ..
```

**B. Add permissions to `ios/PharmaPlus/Info.plist`:**

```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs speech recognition to search medicines by voice</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for voice search</string>
```

### Step 3: For Android (If testing on Android device)

**Add permission to `android/app/src/main/AndroidManifest.xml`:**

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### Step 4: Rebuild the App

Voice recognition requires **native modules**, so you need to rebuild:

**For iOS:**

```bash
npx expo run:ios
```

**For Android:**

```bash
npx expo run:android
```

**NOTE:** `expo start` or `npx expo start` **won't work** for voice - you MUST use `run:ios` or `run:android`!

### Step 5: Grant Microphone Permission

When you first click the microphone:

1. App will ask for microphone permission
2. Click **"Allow"** or **"OK"**
3. Try again

## 🚨 Common Issues

### Issue 1: "Voice Search Not Available" Alert

**Cause:** The voice library didn't load

**Solutions:**

1. Make sure package is installed: `npm install @react-native-voice/voice`
2. Restart Metro bundler: Stop (Ctrl+C) and run `npx expo start --clear`
3. Rebuild app: `npx expo run:ios` or `npx expo run:android`

### Issue 2: Nothing Happens When Clicking Mic

**Cause:** Running on web or emulator

**Solutions:**

- Voice recognition **doesn't work on web**
- Voice recognition **doesn't work well on emulators**
- **Test on a real physical device** (iPhone or Android phone)

### Issue 3: Permission Denied

**Cause:** Microphone permission not granted

**Solutions:**

1. Go to phone Settings → Apps → PharmaPlus → Permissions
2. Enable "Microphone"
3. Try again

### Issue 4: "Voice Not Available" Alert

**Cause:** Device doesn't support voice recognition

**Solutions:**

- Make sure device is connected to internet (some devices need it)
- Update iOS/Android to latest version
- Try on a different device

## 📱 Platform Requirements

### iOS:

- ✅ Works on **physical iPhone/iPad**
- ❌ Limited support on **iOS Simulator**
- Requirements: iOS 13.0+

### Android:

- ✅ Works on **physical Android phone**
- ❌ Limited support on **Android Emulator**
- Requirements: Android 5.0+

### Web:

- ❌ `@react-native-voice/voice` **doesn't work on web**
- Alternative: Use Web Speech API (different implementation)

## 🧪 How to Test

### Quick Test (After Setup):

1. **Rebuild app** (important!):

   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

2. **Open app on physical device**

3. **Go to Search tab**

4. **Click microphone button** 🎤

5. **Allow microphone permission** (first time)

6. **Speak clearly**: "Paracetamol"

7. **Watch**:
   - Button turns red (listening)
   - Console shows: "🎤 Started listening..."
   - Speak your query
   - Console shows: "📝 Voice results: ['paracetamol']"
   - Search bar fills with "paracetamol"
   - Results appear!

## 🎯 Expected Behavior

### Working Correctly:

```
Click Mic
    ↓
Button turns RED + solid mic icon
    ↓
Console: "🎤 Started listening..."
    ↓
Speak: "Paracetamol"
    ↓
Console: "📝 Voice results: ['Paracetamol']"
    ↓
Search bar shows: "Paracetamol"
    ↓
Results appear
    ↓
Button returns to TEAL + outline icon
```

### Not Working (Current State):

```
Click Mic
    ↓
Alert appears: "Voice Search Not Available"
    ↓
Need to follow setup steps above
```

## ⚡ Quick Fix Checklist

- [ ] Package installed? Run: `npm list @react-native-voice/voice`
- [ ] Using physical device? (Not emulator or web)
- [ ] Rebuilt with `run:ios` or `run:android`? (Not just `expo start`)
- [ ] Microphone permission granted?
- [ ] Internet connection active?
- [ ] Console shows any errors?

## 💡 Alternative: Simple Voice Feedback (Without Recognition)

If voice recognition is too complex for now, you can add **voice feedback** (app speaks to you):

```bash
expo install expo-speech
```

Then update `handleVoiceSearch`:

```typescript
import * as Speech from "expo-speech";

const handleVoiceSearch = () => {
  Speech.speak("What medicine are you looking for?");
  // User still types, but app gives voice feedback
};
```

This works on web and emulators too!

## 🔍 Debug Mode

Add this temporary button to test:

```typescript
<TouchableOpacity
  onPress={async () => {
    if (Voice) {
      const available = await Voice.isAvailable();
      const hasPermission = await Voice.isRecognizing();
      Alert.alert(
        "Debug",
        `Available: ${available}\nRecognizing: ${hasPermission}`
      );
    } else {
      Alert.alert("Debug", "Voice is null - library not loaded");
    }
  }}
  className="bg-gray-200 p-2 rounded"
>
  <Text>Test Voice Status</Text>
</TouchableOpacity>
```

## 📞 Need Help?

Check Metro bundler console for errors:

- Look for "Voice library not installed" message
- Look for permission errors
- Look for native module errors

---

**The Bottom Line:**

Voice recognition **requires**:

1. ✅ Native library installed
2. ✅ App rebuilt with `npx expo run:ios/android` (not just `expo start`)
3. ✅ Physical device (not emulator)
4. ✅ Microphone permissions granted
5. ✅ Internet connection (on some devices)

**Current Status:** Code is ready, but needs rebuild and permissions!

---

**Created:** October 10, 2025  
**Status:** 🛠️ Setup Required
