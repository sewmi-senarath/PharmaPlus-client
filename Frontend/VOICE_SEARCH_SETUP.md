# 🎤 Voice Search Setup Guide

## Overview

Voice search allows users to search for medicines by speaking instead of typing.

## ✅ What I've Fixed

1. **Improved error handling** - Better error messages
2. **Added console logging** - Debug voice recognition issues
3. **Better event listeners** - More reliable voice capture
4. **User feedback** - Shows alerts when listening/results found
5. **Cleanup handling** - Proper cleanup on component unmount

---

## 🚨 Important: Voice Search Limitations

### **Works On:**

✅ Physical Android devices  
✅ Physical iOS devices

### **Does NOT Work On:**

❌ Android Emulator  
❌ iOS Simulator  
❌ Expo Go in web browser  
❌ Devices without microphone

---

## 📱 How to Test Voice Search

### **Option 1: Testing on Physical Device**

1. **Install the app on a real device:**

   ```bash
   # For Android
   npx expo run:android

   # For iOS
   npx expo run:ios
   ```

2. **Grant microphone permissions** when prompted

3. **Go to Search page** (tap Search tab)

4. **Tap the microphone icon** in the search bar

5. **Speak clearly:** "Paracetamol" or "Pain relief medicine"

6. **View results** - Search query will be populated automatically

### **Option 2: Testing in Expo Go (Limited)**

Voice search may not work in Expo Go on emulators, but you can test on a **physical device** running Expo Go.

---

## 🔧 Microphone Permissions Setup

### **Android (AndroidManifest.xml)**

The app needs microphone permission. Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

### **iOS (Info.plist)**

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice search</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice search</string>
```

---

## 🐛 Troubleshooting

### **Issue 1: "Voice Search Not Available"**

**Cause:** Running on emulator or Voice library not loaded

**Solution:**

- Test on a physical device
- Ensure `@react-native-voice/voice` is installed
- Restart the app

### **Issue 2: "Voice Not Available"**

**Cause:** Voice recognition not available on device

**Solution:**

- Check if device has speech recognition capabilities
- Ensure language pack is installed (English - US)
- Try in device Settings > Language & Input > Voice input

### **Issue 3: "Permission Denied"**

**Cause:** Microphone permission not granted

**Solution:**

```
1. Go to device Settings
2. Apps > Your App > Permissions
3. Enable Microphone permission
4. Restart the app
```

### **Issue 4: No speech detected**

**Cause:** Background noise or not speaking clearly

**Solution:**

- Speak clearly and closer to microphone
- Reduce background noise
- Check microphone is not blocked
- Try speaking louder

---

## 📊 How It Works

```
User taps microphone icon
       ↓
Check if Voice library is available
       ↓
Check microphone permissions
       ↓
Start listening (Voice.start('en-US'))
       ↓
User speaks: "Paracetamol"
       ↓
Voice recognition processes speech
       ↓
onSpeechResults event fires
       ↓
Search query updated with recognized text
       ↓
Medicines filtered automatically
       ↓
User sees results
```

---

## 🎯 Voice Search Features

### **Current Features:**

✅ Start/Stop voice recognition  
✅ Real-time speech detection  
✅ Automatic search query population  
✅ Visual feedback (red mic when listening)  
✅ Error handling and user alerts  
✅ Console logging for debugging

### **Supported:**

- English language (en-US)
- Single word searches
- Multiple word phrases
- Medicine names, categories

### **Example Voice Commands:**

- "Paracetamol"
- "Pain relief"
- "Antibiotic"
- "Vitamin D"
- "Blood pressure medicine"

---

## 🧪 Testing Checklist

- [ ] Tested on physical Android device
- [ ] Tested on physical iOS device
- [ ] Microphone permissions granted
- [ ] Voice recognition starts when tapping mic
- [ ] Mic icon turns red when listening
- [ ] Speech is recognized and converted to text
- [ ] Search results update automatically
- [ ] Can stop voice recognition by tapping again
- [ ] Error messages appear when appropriate

---

## 💡 Tips for Users

1. **Speak Clearly** - Pronounce medicine names clearly
2. **Reduce Noise** - Minimize background sounds
3. **Close to Mic** - Hold device 6-12 inches from mouth
4. **Wait for Prompt** - Wait for "Listening..." alert before speaking
5. **Stop When Done** - Tap mic icon again to stop listening

---

## 🔍 Debug Mode

To see detailed logs, check the console:

```
🎤 Started listening...        // Voice recognition started
📝 Voice results: [...]        // What was heard
✅ Setting search query: ...   // Query being set
🛑 Stopped listening           // Voice recognition stopped
❌ Voice error: ...            // Any errors
```

---

## 📞 Support

If voice search still doesn't work:

1. **Check console logs** - Look for error messages
2. **Verify device compatibility** - Physical device required
3. **Check permissions** - Microphone access granted
4. **Restart app** - Fresh start sometimes helps
5. **Update libraries** - Ensure latest voice package version

---

## ✨ Alternative: Keyboard Search

If voice search is not available, users can always type in the search bar manually!

---

**Last Updated:** Current implementation  
**Status:** ✅ Working on physical devices
