# Voice Search - How It Works 🎤

## 📍 Location

The voice search button is located in the **search bar** on the Search page:

```
┌─────────────────────────────────────────┐
│ 🔍 [Search medicines...]  ❌  │  🎤    │
└─────────────────────────────────────────┘
         ↑                    ↑       ↑
    Search icon          Clear   Voice
```

## 🎯 Visual Indicators

### Normal State:

- **Icon**: Sound/microphone icon 🎤
- **Color**: Teal (#41A67E)
- **Background**: Light teal (teal-50)

### Listening State:

- **Icon**: Same microphone
- **Color**: Red (#DC2626)
- **Background**: Light red (red-100)
- **Animation**: Pulsing red background

## ⚙️ How It Currently Works

### Step 1: User Clicks Voice Button

```typescript
onPress = { handleVoiceSearch };
```

### Step 2: Shows Info Dialog

Currently, when you click the voice button, it shows an **Alert** with:

- Title: "Voice Search"
- Message: Setup instructions
- Explains which libraries to install
- Suggests typing for now

### Step 3: Visual Feedback

```typescript
setIsVoiceSearching(true); // Button turns red
setTimeout(() => setIsVoiceSearching(false), 1000); // Returns to normal
```

## 🔧 Current Implementation

```typescript
const handleVoiceSearch = () => {
  setIsVoiceSearching(true); // 1. Turn button red

  // 2. Show information alert
  Alert.alert(
    "Voice Search",
    "Voice search feature requires additional setup...",
    [{ text: "OK", onPress: () => setIsVoiceSearching(false) }]
  );

  // 3. Reset button after 1 second
  setTimeout(() => setIsVoiceSearching(false), 1000);
};
```

## 🚀 To Enable REAL Voice Recognition

### Option 1: React Native Voice (Recommended for Mobile)

**1. Install the package:**

```bash
npm install @react-native-voice/voice
```

**2. Add permissions:**

**iOS** - Add to `ios/YourApp/Info.plist`:

```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice search</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice search</string>
```

**Android** - Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**3. Update search.tsx:**

```typescript
import Voice from "@react-native-voice/voice";
import { useEffect } from "react";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);

  useEffect(() => {
    // Set up voice recognition listeners
    Voice.onSpeechStart = () => {
      console.log("🎤 Started listening...");
      setIsVoiceSearching(true);
    };

    Voice.onSpeechEnd = () => {
      console.log("🛑 Stopped listening");
      setIsVoiceSearching(false);
    };

    Voice.onSpeechResults = (e) => {
      console.log("📝 Voice results:", e.value);
      if (e.value && e.value[0]) {
        setSearchQuery(e.value[0]); // Set the recognized text
      }
    };

    Voice.onSpeechError = (e) => {
      console.error("❌ Voice error:", e.error);
      setIsVoiceSearching(false);
      Alert.alert("Error", "Could not recognize speech. Please try again.");
    };

    // Cleanup
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceSearch = async () => {
    try {
      if (isVoiceSearching) {
        // Stop listening
        await Voice.stop();
        setIsVoiceSearching(false);
      } else {
        // Start listening
        await Voice.start("en-US"); // Can change to 'ta-LK' or 'si-LK'
        setIsVoiceSearching(true);
      }
    } catch (error) {
      console.error("Voice search error:", error);
      Alert.alert("Error", "Voice search failed. Please try again.");
    }
  };

  // ... rest of your component
}
```

### Option 2: Expo Speech (Text-to-Speech only - Simpler)

**1. Install:**

```bash
expo install expo-speech
```

**2. Update search.tsx:**

```typescript
import * as Speech from "expo-speech";

const handleVoiceSearch = () => {
  // Speak to user
  Speech.speak("What medicine are you looking for?", {
    language: "en-US",
    pitch: 1.0,
    rate: 0.9,
  });

  // NOTE: This is TTS (Text-to-Speech), not STT (Speech-to-Text)
  // User still needs to type
};
```

## 🎬 User Experience Flow

### With Real Voice Recognition:

1. **User clicks microphone** 🎤
2. **App asks for mic permission** (first time only)
3. **Button turns red** (listening state)
4. **User speaks**: "Paracetamol"
5. **Speech is recognized** and converted to text
6. **Search bar updates** with "Paracetamol"
7. **Results appear** automatically
8. **Button returns to normal** (teal)

### Visual States:

```
Normal State:           Listening State:         Results Found:
┌─────────────┐        ┌─────────────┐         ┌─────────────┐
│  🎤  Teal   │   →    │  🎤  Red    │    →    │  Paracetamol│
└─────────────┘        └─────────────┘         └─────────────┘
                       (Pulsing)                (Search results)
```

## 🌍 Multi-Language Support

You can enable voice search in multiple languages:

```typescript
const handleVoiceSearch = async () => {
  // Determine language based on user's selection
  let language = "en-US"; // English

  if (selectedLanguage === "ta") {
    language = "ta-LK"; // Tamil (Sri Lanka)
  } else if (selectedLanguage === "si") {
    language = "si-LK"; // Sinhala (Sri Lanka)
  }

  await Voice.start(language);
};
```

## 🔊 Testing Voice Search

### On Physical Device:

1. Run app on your phone
2. Go to Search tab
3. Click microphone button
4. Allow microphone permission
5. Speak clearly: "Paracetamol"
6. See text appear in search bar

### On Emulator/Simulator:

- **iOS Simulator**: Has limited voice support
- **Android Emulator**: May not support voice
- **Web**: Use Web Speech API instead

### Test Commands:

- "Paracetamol"
- "Pain relief medicine"
- "Vitamin D"
- "Diabetes medication"
- "Show me antibiotics"

## ⚡ Quick Start (Choose One)

### For Mobile App (Full Voice Recognition):

```bash
npm install @react-native-voice/voice
cd ios && pod install && cd .. # iOS only
npx expo run:ios # or npx expo run:android
```

### For Simple Voice Feedback:

```bash
expo install expo-speech
npx expo start
```

## 🎤 Icon Options

If you want to try different microphone icons:

```typescript
// Option 1 (Current):
<AntDesign name="sound" size={24} color={color} />

// Option 2:
<AntDesign name="notification" size={24} color={color} />

// Option 3:
<AntDesign name="customerservice" size={24} color={color} />

// Option 4 (Using Ionicons instead):
import Ionicons from 'react-native-vector-icons/Ionicons';
<Ionicons name="mic" size={24} color={color} />

// Option 5 (Using MaterialCommunityIcons):
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
<MaterialCommunityIcons name="microphone" size={24} color={color} />
```

## 🐛 Troubleshooting

### Can't See Icon?

**Solution:** Try different icon names:

```typescript
name = "sound"; // Sound wave
name = "notification"; // Bell/notification
name = "API"; // Signal
```

### Icon Shows "?"

**Problem:** Icon name doesn't exist in AntDesign

**Solution:** Switch to Ionicons for better microphone icon:

```typescript
import Ionicons from "react-native-vector-icons/Ionicons";
<Ionicons name="mic" size={24} color={color} />;
```

### Voice Not Working?

1. **Check permissions** - Microphone access granted?
2. **Test on physical device** - Emulators have limited support
3. **Check internet** - Some voice APIs need connectivity
4. **Language support** - Try 'en-US' first

## 📊 Performance Tips

1. **Debounce speech results** - Avoid too many searches
2. **Cache results** - Store recent voice queries
3. **Offline fallback** - Show message if no internet
4. **Error handling** - Graceful failures

## 🎯 Summary

**Current State:**

- ✅ Voice button visible (sound icon)
- ✅ Visual feedback (red when active)
- ✅ Info dialog with setup guide
- ⏳ Actual voice recognition (pending setup)

**To Activate:**

1. Install `@react-native-voice/voice`
2. Add permissions
3. Replace `handleVoiceSearch` function
4. Test on physical device

**How It Will Work:**

1. User taps mic → Permission requested
2. Button turns red → Listening
3. User speaks → Speech recognized
4. Text appears → Search runs automatically
5. Results show → User finds medicine

---

**Updated:** October 10, 2025  
**Status:** 🎤 Ready for Voice Integration
