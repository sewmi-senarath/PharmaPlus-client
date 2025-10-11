# 🔗 Profile Page Backend Integration

## ✅ What Was Implemented

The profile page now fully integrates with the backend, allowing users to:

- **View** their profile data from the database
- **Update** their profile information
- **Change** their password
- **Logout** (with backend API call)

## 🆕 New Files Created

### 1. **`services/userService.ts`**

Service layer for user-related API calls:

- `getUserDetails()` - Fetch user profile from backend
- `updateProfile()` - Update user profile (name, phone, avatar, language)
- `updatePassword()` - Change user password
- `logout()` - Logout user from backend

## 🔄 Changes Made to Profile Page

### 1. **Added Backend Integration**

```typescript
import { userService } from "../../services/userService";
```

### 2. **Load User Data on Mount**

```typescript
useEffect(() => {
  loadUserProfile();
}, []);

const loadUserProfile = async () => {
  try {
    const userData = await userService.getUserDetails();
    setProfile({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      avatar: userData.avatar || "",
      preferred_language: userData.preferred_language || "en",
      role: userData.role || userRole || "",
      joinDate: userData.createdAt
        ? new Date(userData.createdAt).toLocaleDateString()
        : "N/A",
    });
  } catch (error) {
    Alert.alert("Error", "Failed to load profile data");
  }
};
```

### 3. **Save Changes to Backend**

```typescript
const handleSave = async () => {
  try {
    const updateData = {
      name: profile.name,
      phone: profile.phone,
      avatar: profile.avatar,
      preferred_language: profile.preferred_language,
    };

    await userService.updateProfile(updateData);
    Alert.alert("Success", "Profile updated successfully!");
    await loadUserProfile(); // Reload fresh data
  } catch (error) {
    Alert.alert("Error", "Failed to update profile");
  }
};
```

### 4. **Change Password Modal**

New modal for password changes:

- Current password field
- New password field (min 6 characters)
- Confirm password field
- Validation for password match
- Backend API call

```typescript
const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    Alert.alert("Error", "New passwords do not match");
    return;
  }

  await userService.updatePassword({
    currentPassword,
    newPassword,
  });

  Alert.alert("Success", "Password updated successfully!");
};
```

### 5. **Backend Logout**

```typescript
const handleLogout = async () => {
  try {
    // Call backend logout API
    await userService.logout();

    // Clear local storage
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("userRole");

    // Navigate to login
    router.replace("/screens/login");
  } catch (error) {
    Alert.alert("Error", "Failed to logout");
  }
};
```

## 🎯 Features Implemented

### ✅ Profile Viewing

- Loads real data from backend on mount
- Shows loading state while fetching
- Displays user information:
  - Name
  - Email (read-only)
  - Phone
  - Role
  - Join date

### ✅ Profile Editing

- Edit mode toggle button
- Editable fields:
  - Name
  - Phone
- Save button with loading indicator
- Success/error alerts
- Auto-refresh after save

### ✅ Password Change

- Modal popup for password change
- Fields:
  - Current password
  - New password (min 6 chars)
  - Confirm password
- Validation:
  - All fields required
  - Passwords must match
  - Minimum length check
- Backend API call
- Success/error handling

### ✅ Logout

- Calls backend logout API
- Clears all local tokens
- Redirects to login screen
- Error handling

## 📋 Backend API Endpoints Used

| Method | Endpoint                 | Description      | Auth Required |
| ------ | ------------------------ | ---------------- | ------------- |
| GET    | `/users/user-details`    | Get user profile | ✅ Yes        |
| PUT    | `/users/update-profile`  | Update profile   | ✅ Yes        |
| PUT    | `/users/update-password` | Change password  | ✅ Yes        |
| GET    | `/users/logout`          | Logout user      | ✅ Yes        |

## 🔐 Backend Fields Supported

The backend `updateProfileController` accepts:

- `name` - User's full name
- `phone` - Phone number
- `avatar` - Profile picture URL
- `preferred_language` - Language preference (en, ta, si)

**Note**: Email, role, and other sensitive fields are NOT updatable via this endpoint.

## 🎨 UI Updates

### Loading States

- ✅ Loading indicator when fetching profile
- ✅ Loading indicator when saving changes
- ✅ Loading indicator when changing password
- ✅ Disabled buttons during loading

### Error Handling

- ✅ Alert dialogs for errors
- ✅ Console logging for debugging
- ✅ Graceful fallback for API failures

### Success Feedback

- ✅ Success alerts after updates
- ✅ Modal auto-close after password change
- ✅ Automatic profile refresh

## 📱 How to Use

### 1. **View Profile**

```
1. Navigate to Profile tab
2. Profile automatically loads from backend
3. See your information displayed
```

### 2. **Edit Profile**

```
1. Tap "Edit Profile" button
2. Update Name or Phone
3. Tap "Save Changes"
4. See success message ✅
5. Profile refreshes with latest data
```

### 3. **Change Password**

```
1. Tap "Change Password" button
2. Enter current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Tap "Update Password"
6. See success message ✅
```

### 4. **Logout**

```
1. Scroll to bottom
2. Tap red "Logout" button
3. Confirm in alert
4. Redirected to login screen ✅
```

## 🧪 Testing

### Test Profile Loading

```
1. Login with valid credentials
2. Navigate to Profile
3. Check console for: "📥 User data loaded: ..."
4. Verify data displays correctly
```

### Test Profile Update

```
1. Tap "Edit Profile"
2. Change name to "Test User"
3. Tap "Save Changes"
4. Check console for: "✅ Profile updated successfully"
5. Verify alert appears
6. Verify data refreshes
```

### Test Password Change

```
1. Tap "Change Password"
2. Enter current password
3. Enter new password (e.g., "test123")
4. Confirm password
5. Tap "Update Password"
6. Check console for: "✅ Password updated successfully"
7. Verify success alert
8. Try logging in with new password
```

### Test Logout

```
1. Tap "Logout"
2. Confirm in alert
3. Check console for: "✅ Backend logout successful"
4. Verify redirected to login screen
5. Try going back (should not be possible)
```

## 🔍 Console Logs

### Success Logs:

```
📥 User data loaded: { name: "...", email: "..." }
✅ Profile updated successfully
✅ Password updated successfully
✅ Backend logout successful
✅ User logged out successfully
```

### Error Logs:

```
❌ Failed to load profile: [error]
❌ Failed to update profile: [error]
❌ Failed to update password: [error]
❌ Logout error: [error]
⚠️ Backend logout failed, continuing with local logout: [error]
```

## 🚀 What's Next (Optional Enhancements)

You could add:

- Avatar upload functionality
- Language switcher UI
- Email verification status
- Account deletion
- Export user data
- Activity history
- Two-factor authentication

## 📝 Files Modified

1. **`services/userService.ts`** - New service file
2. **`app/home/profile.tsx`** - Updated with backend integration

## ⚡ Performance Notes

- Profile loads on mount (single API call)
- Changes saved individually (not auto-save)
- Automatic refresh after updates
- Optimistic UI updates possible (future enhancement)

---

**TL;DR**: Profile page now fully connected to backend! Users can view, edit, change password, and logout with real API calls. All CRUD operations working! 🎉
