# 🐛 Medication Issues - Debugging Guide

## 🚨 Current Issues

1. **Time/Date pickers not working**
2. **Delete not working**

## 🔍 Step-by-Step Debugging

### Issue 1: Time/Date Pickers Not Working

#### Check 1: Are you on Web or Mobile?

**DateTimePicker ONLY works on:**

- ✅ Real iOS device
- ✅ Real Android device
- ⚠️ iOS/Android emulators (limited)
- ❌ Web browser (NOT supported)

**Check your platform:**

```
Look at the console - should show:
Platform.OS = "ios" or "android" or "web"
```

**If you're on WEB:**

- ✅ Use the **manual text input** (fallback is provided)
- ✅ Or click **"Type" button** to enter time manually
- Format: `08:00 AM, 08:00 PM`

**If you're on MOBILE and picker not showing:**

**Solution:** Check console when you click "Pick Time":

```
Should see: "Opening time picker..."
```

If you don't see this, the button click isn't working.

#### Check 2: Test the Pickers

**Time Picker Test:**

1. Click "Add Medication"
2. Scroll down to "Reminder Times \*"
3. Click **"Pick Time"** button
4. **Watch console** → Should print: `Opening time picker...`
5. **Picker should appear** (spinner on iOS, dialog on Android)
6. If nothing happens → You're likely on web or emulator

**Alternative - Use "Type" Button:**

1. Click **"Type"** button (next to "Pick Time")
2. Popup appears: "Add Reminder Time"
3. Type: `08:00 AM`
4. Click "Add"
5. Time chip appears below ✅

**Date Picker Test:**

1. Scroll to "Start Date" field
2. Click on the date field
3. **Watch console** → Should print: `Opening date picker...`
4. Picker should appear
5. If nothing → Use manual input (web fallback)

### Issue 2: Delete Not Working

#### Debug Steps:

**Step 1: Add extensive logging**
I've added detailed console logs. When you click delete, you should see:

```
🗑️ Delete requested for: {name: "Aspirin", ...}
Medication ID: 67abc123...
Deleting medication with ID: 67abc123...
Calling backend delete...
✅ Medication deleted from backend
Medication Metformin: ID=..., shouldKeep=true
Medication Aspirin: ID=..., shouldKeep=false
Filtered: 2 → 1 medications
```

**Step 2: Click Delete and Check Console**

1. **Click 🗑️ trash icon**
2. **Confirm deletion**
3. **Open browser console** (F12)
4. **Look for the logs** above

**What to look for:**

**Case A: No logs at all**
→ Delete button not clicking
→ Check if icon is visible and clickable

**Case B: Sees "Delete requested" but error after**
→ Backend issue
→ Check error message in console

**Case C: Sees "deleted from backend" but medication still in list**
→ Filter not working
→ Check the "shouldKeep" logs

**Case D: "Medication ID not found"**
→ Medication doesn't have `_id` or `id` field
→ Check medication object in console

#### Step 3: Check Medication Data Structure

Click the **📋 list icon** in header (I updated it to show medications too)

Console should show:

```
📋 Current medications: [
  {
    _id: "67abc...",  ← Should have this
    name: "Aspirin",
    ...
  }
]
```

**If `_id` is missing:**

- Backend isn't returning it
- Or medications loaded from sample data

#### Step 4: Test Backend Directly

Test delete in Postman:

```
DELETE http://192.168.1.3:5000/api/medications/YOUR_MEDICATION_ID
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

Should return:

```json
{
  "message": "Medication deleted successfully",
  "success": true
}
```

If Postman works but app doesn't → Frontend issue  
If Postman fails → Backend issue

## 🛠️ Quick Fixes

### Fix 1: Pickers Not Showing (Web Issue)

**If you're testing on web:**

Use the **manual input method**:

**For Time:**

- On web: Type directly in the input field
- On mobile: Click "Type" button instead of "Pick Time"

**For Date:**

- On web: Type `YYYY-MM-DD` format
- On mobile: Click the date field

### Fix 2: Delete Not Removing from UI

**Try this:**

1. **Click delete**
2. **Check console** for all the logs I added
3. **Take screenshot** of console
4. **Look for:**
   - Is `medId` defined?
   - Does backend call succeed?
   - What's the filter output?

**Manual workaround:**

1. Delete medication
2. **Refresh the page**
3. Medication should be gone (if backend delete worked)

## 🧪 Complete Test Procedure

### Test on MOBILE Device (Recommended):

**1. Time Picker:**

```bash
# Make sure you're running on physical device
npx expo run:ios
# or
npx expo run:android
```

Then:

1. Click "Add Medication"
2. Click "Pick Time" → Picker appears ✅
3. Scroll to 8:00 → Click Done
4. See chip: [🕐 08:00 AM X] ✅

**2. Delete:**

1. Have at least 1 medication
2. Click 🗑️
3. Confirm
4. Check console logs
5. Medication disappears ✅

### Test on WEB (Current Setup):

**1. Time Entry:**

- **Don't use picker** (won't work)
- **Type manually:** `08:00 AM, 02:00 PM`
- **Or click "Type" button** (if on mobile)

**2. Date Entry:**

- **Type manually:** `2024-10-10`

**3. Delete:**

- Should work same as mobile
- Check console for errors

## 📊 Expected Console Output

### When Adding Medication:

```
Opening time picker...
Time picker event: set, [Date object]
Formatted time: 08:00 AM
Times updated: ['08:00 AM']
Opening date picker...
Date picker event: set, [Date object]
Date set to: 2024-10-10
📅 Notification scheduled: abc-123
🌐 Sending to backend: POST /api/medications
✅ Medication saved to backend: {...}
```

### When Deleting:

```
🗑️ Delete requested for: {_id: "67...", name: "Aspirin", ...}
Medication ID: 67abc123...
Deleting medication with ID: 67abc123...
Calling backend delete...
✅ Medication deleted from backend
Medication Aspirin: ID=67abc123, shouldKeep=false
Filtered: 1 → 0 medications
```

## 🎯 Solutions

### Solution 1: Use Mobile App

The DateTimePicker is **designed for mobile**, not web.

**Best experience:**

```bash
cd PharmaPlus-client/Frontend
npx expo run:android
# or
npx expo run:ios
```

Then test - pickers will work perfectly!

### Solution 2: Use Alternative Methods (Web)

**For Web Testing:**

- Time: Type `08:00 AM` directly
- Date: Type `2024-10-10` directly
- Or use "Type" button on mobile

### Solution 3: Debug Delete

**Add this temporary debug button** (I can add it if needed):

In the header, add:

```typescript
<TouchableOpacity
  onPress={() => {
    console.log("All medications:", medications);
    medications.forEach((m, i) => {
      console.log(`Med ${i}:`, {
        id: m.id,
        _id: m._id,
        name: m.name,
      });
    });
  }}
>
  <Text>Debug</Text>
</TouchableOpacity>
```

This will show you exactly what IDs exist.

## 📱 Platform-Specific Notes

| Feature       | iOS         | Android     | Web            |
| ------------- | ----------- | ----------- | -------------- |
| Time Picker   | ✅ Spinner  | ✅ Clock    | ❌ Manual only |
| Date Picker   | ✅ Calendar | ✅ Calendar | ❌ Manual only |
| Delete        | ✅ Works    | ✅ Works    | ✅ Works       |
| Notifications | ✅ Works    | ✅ Works    | ❌ Limited     |

## 🚀 Quick Action Items

**To fix pickers:**

1. Test on mobile device (not web)
2. Or use "Type" button for manual entry
3. Or use web text input fallback

**To fix delete:**

1. Click delete and check console
2. Share the console output
3. Check if `_id` exists in medication object
4. Verify backend delete succeeds

## 📞 Next Steps

**Please do this:**

1. **Click "Pick Time" button**

   - Does picker appear? → Good!
   - Nothing happens? → Check console for "Opening time picker..."
   - Are you on web? → Use text input instead

2. **Click delete on a medication**

   - Check console for ALL the logs I added
   - Tell me what you see
   - Specifically: Does it say "Medication deleted from backend"?

3. **Click 📋 list icon** in header
   - Shows count of medications and notifications
   - Check console for full details

---

**The code is ready - just needs proper platform (mobile) for pickers!**

**Status:** ✅ Code Fixed | ⏳ Needs Testing on Mobile

**Created:** October 10, 2025
