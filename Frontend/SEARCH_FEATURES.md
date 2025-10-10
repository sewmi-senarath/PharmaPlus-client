# Search Page Features Documentation

## 🔍 Overview

The Search page is a comprehensive medicine search and browsing interface with the following features:

## ✨ Key Features

### 1. **Text Search**

- Real-time search as you type
- Searches across:
  - Medicine names
  - Descriptions
  - Categories
  - Manufacturers
- Clear button to reset search

### 2. **Voice Search Button**

- Voice icon in search bar
- Visual feedback (red pulse when listening)
- Currently shows setup instructions
- Ready for voice recognition integration

### 3. **Category Filters**

11 categories to browse:

- All (default)
- Pain Relief
- Antibiotics
- Allergy
- Digestive
- Diabetes
- Vitamins
- Heart Health
- Blood Pressure
- Respiratory
- Cholesterol

### 4. **Sample Medicine Database**

12 medicines with details:

- **Name & Dosage** (e.g., Paracetamol 500mg)
- **Category** (e.g., Pain Relief)
- **Price** (in Rs.)
- **Stock Status** (In Stock indicator)
- **Description** (Usage information)
- **Manufacturer** (Brand name)
- **Prescription Requirement** (Rx badge)
- **Icon/Emoji** (Visual identifier)

### 5. **Medicine Cards**

Each card shows:

- Large emoji icon
- Medicine name
- Manufacturer
- Category badge
- Prescription badge (if required)
- Stock status
- Description
- Price
- "Add to Cart" button

### 6. **Shopping Cart**

- Add medicines to cart
- Cart badge with item count
- Floating cart button (bottom-right)
- "Already added" prevention

### 7. **Results Counter**

- Shows number of results found
- Updates in real-time

### 8. **Empty State**

- Shows 🔍 icon when no results
- Helpful message

## 📊 Sample Medicines

| Medicine           | Category       | Price   | Prescription | Stock |
| ------------------ | -------------- | ------- | ------------ | ----- |
| Paracetamol 500mg  | Pain Relief    | Rs. 150 | No           | ✓     |
| Amoxicillin 250mg  | Antibiotics    | Rs. 450 | Yes          | ✓     |
| Ibuprofen 400mg    | Pain Relief    | Rs. 200 | No           | ✓     |
| Cetirizine 10mg    | Allergy        | Rs. 180 | No           | ✓     |
| Omeprazole 20mg    | Digestive      | Rs. 320 | No           | ✓     |
| Metformin 500mg    | Diabetes       | Rs. 280 | Yes          | ✓     |
| Atorvastatin 10mg  | Cholesterol    | Rs. 380 | Yes          | ✓     |
| Vitamin D3 1000 IU | Vitamins       | Rs. 250 | No           | ✓     |
| Aspirin 75mg       | Heart Health   | Rs. 120 | No           | ✓     |
| Losartan 50mg      | Blood Pressure | Rs. 420 | Yes          | ✓     |
| Salbutamol Inhaler | Respiratory    | Rs. 650 | Yes          | ✓     |
| Multivitamin       | Vitamins       | Rs. 350 | No           | ✓     |

## 🎤 Implementing Real Voice Search

### Option 1: Using Expo Speech (Text-to-Speech only)

```bash
expo install expo-speech
```

```typescript
import * as Speech from "expo-speech";

const handleVoiceSearch = () => {
  Speech.speak("What medicine are you looking for?");
};
```

### Option 2: Using React Native Voice (Speech Recognition)

**Install:**

```bash
npm install @react-native-voice/voice
```

**iOS Setup:**
Add to `Info.plist`:

```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition</string>
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to microphone for voice search</string>
```

**Android Setup:**
Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**Implementation:**

```typescript
import Voice from "@react-native-voice/voice";
import { useEffect } from "react";

export default function SearchScreen() {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsVoiceSearching(true);
    Voice.onSpeechEnd = () => setIsVoiceSearching(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value[0]) {
        setSearchQuery(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceSearch = async () => {
    try {
      if (isVoiceSearching) {
        await Voice.stop();
      } else {
        await Voice.start("en-US");
      }
    } catch (error) {
      console.error("Voice search error:", error);
    }
  };

  // Rest of your component...
}
```

### Option 3: Using Web Speech API (Web only)

```typescript
const handleVoiceSearch = () => {
  if ("webkitSpeechRecognition" in window) {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
    };
    recognition.start();
  }
};
```

## 🔄 Future Enhancements

### Recommended Features:

1. **Backend Integration**

   - Fetch medicines from API
   - Real-time stock updates
   - Price comparisons

2. **Advanced Search**

   - Filter by price range
   - Sort by price/name/popularity
   - Search by symptoms

3. **Medicine Details Page**

   - Full product information
   - Side effects
   - Dosage instructions
   - Reviews and ratings

4. **Cart Management**

   - View cart items
   - Update quantities
   - Remove items
   - Checkout integration

5. **Search History**

   - Recent searches
   - Popular searches
   - Quick access to previous searches

6. **Barcode Scanner**

   - Scan medicine barcode
   - Quick product lookup

7. **AI-Powered Search**

   - Search by symptoms
   - Medicine recommendations
   - Drug interaction checks

8. **Favorites/Wishlist**
   - Save favorite medicines
   - Quick reorder

## 🎨 UI Components

### Colors Used:

- **Primary**: Teal (#41A67E / teal-600)
- **Background**: Gray-50
- **Cards**: White
- **Text**: Gray-800
- **Prescription Badge**: Orange
- **In Stock**: Green
- **Cart Badge**: Red

### Icons:

- 🔍 Search
- 🎤 Voice Search
- 💊 Pills
- 💉 Injections
- ❤️ Heart
- 🌼 Allergy
- ☀️ Vitamins
- 💨 Respiratory
- 🌟 Multivitamin
- 🛒 Shopping Cart

## 🧪 Testing

### Test Cases:

1. ✓ Search for "paracetamol"
2. ✓ Search for "pain" (should show pain relief medicines)
3. ✓ Filter by "Antibiotics" category
4. ✓ Clear search
5. ✓ Add item to cart
6. ✓ Try to add same item twice
7. ✓ Click voice search button
8. ✓ Search with no results

### How to Test:

1. Navigate to Search tab
2. Type "paracetamol" - should find 1 result
3. Type "vitamin" - should find 2 results
4. Select "Pain Relief" category - should show 2 items
5. Click "Add to Cart" on any item
6. Check cart badge appears with count
7. Try voice search (will show info dialog)

## 📝 Notes

- Medicines are currently hardcoded (12 sample items)
- Prices are in Sri Lankan Rupees (Rs.)
- Voice search button shows setup instructions
- Cart is stored in local state (resets on unmount)
- All medicines marked as "In Stock"
- Prescription requirement (Rx) badge shown for regulated medicines

## 🚀 Next Steps

1. **Connect to Backend API**

   - Create medicine service
   - Fetch real medicine data
   - Implement pagination

2. **Enable Voice Search**

   - Choose voice library
   - Add permissions
   - Implement speech recognition

3. **Integrate Cart**

   - Connect to cart API
   - Persist cart data
   - Link to checkout

4. **Add Medicine Details**
   - Create detail page
   - Add reviews
   - Show related products

---

**Created:** October 10, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Testing
