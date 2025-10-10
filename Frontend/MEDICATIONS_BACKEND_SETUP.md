# 💊 Medications Backend Setup Guide

## Overview

The medications feature allows users to:

- ✅ Add medications with reminders
- ✅ Edit medication details
- ✅ Delete medications
- ✅ Get push notifications at scheduled times
- ✅ Track medication history

## 📋 Backend Requirements

### 1. Create Medication Model

Create `models/Medication.js` in your backend:

```javascript
import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medication name is required"],
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
    },
    frequency: {
      type: String,
      enum: [
        "Once daily",
        "Twice daily",
        "Three times daily",
        "Four times daily",
        "As needed",
      ],
      default: "Once daily",
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      // Format: "08:00 AM" or "08:00 AM, 08:00 PM" for multiple times
    },
    notes: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notificationId: {
      type: String,
      default: null,
    },
    takenHistory: [
      {
        date: Date,
        taken: Boolean,
        takenAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;
```

### 2. Create Medication Routes

Create `routes/medicationRoutes.js`:

```javascript
import express from "express";
import {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
  markMedicationAsTaken,
} from "../controllers/medicationController.js";
import { auth } from "../middleware/auth.js"; // Your auth middleware

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/medications - Get all medications for logged-in user
router.get("/", getAllMedications);

// GET /api/medications/:id - Get single medication
router.get("/:id", getMedicationById);

// POST /api/medications - Create new medication
router.post("/", createMedication);

// PUT /api/medications/:id - Update medication
router.put("/:id", updateMedication);

// DELETE /api/medications/:id - Delete medication
router.delete("/:id", deleteMedication);

// POST /api/medications/:id/taken - Mark as taken
router.post("/:id/taken", markMedicationAsTaken);

export default router;
```

### 3. Create Medication Controller

Create `controllers/medicationController.js`:

```javascript
import Medication from "../models/Medication.js";

// Get all medications for user
export async function getAllMedications(req, res) {
  try {
    const userId = req.user._id; // From auth middleware

    const medications = await Medication.find({
      userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.json({
      message: "Medications retrieved successfully",
      error: false,
      success: true,
      data: medications,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get single medication
export async function getMedicationById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const medication = await Medication.findOne({
      _id: id,
      userId,
    });

    if (!medication) {
      return res.status(404).json({
        message: "Medication not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Medication retrieved successfully",
      error: false,
      success: true,
      data: medication,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Create new medication
export async function createMedication(req, res) {
  try {
    const userId = req.user._id;
    const { name, dosage, frequency, time, notes, startDate, notificationId } =
      req.body;

    if (!name || !dosage || !time) {
      return res.status(400).json({
        message: "Name, dosage, and time are required",
        error: true,
        success: false,
      });
    }

    const medication = await Medication.create({
      userId,
      name,
      dosage,
      frequency,
      time,
      notes,
      startDate: startDate || new Date(),
      notificationId,
      isActive: true,
    });

    return res.status(201).json({
      message: "Medication created successfully",
      error: false,
      success: true,
      data: medication,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Update medication
export async function updateMedication(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const medication = await Medication.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({
        message: "Medication not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Medication updated successfully",
      error: false,
      success: true,
      data: medication,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Delete medication
export async function deleteMedication(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const medication = await Medication.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!medication) {
      return res.status(404).json({
        message: "Medication not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Medication deleted successfully",
      error: false,
      success: true,
      data: medication,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Mark medication as taken
export async function markMedicationAsTaken(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { takenAt } = req.body;

    const medication = await Medication.findOne({ _id: id, userId });

    if (!medication) {
      return res.status(404).json({
        message: "Medication not found",
        error: true,
        success: false,
      });
    }

    medication.takenHistory.push({
      date: new Date(),
      taken: true,
      takenAt: takenAt || new Date(),
    });

    await medication.save();

    return res.json({
      message: "Medication marked as taken",
      error: false,
      success: true,
      data: medication,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
```

### 4. Add Routes to Main App

In your `server.js` or `app.js`:

```javascript
import medicationRoutes from "./routes/medicationRoutes.js";

// Add this with your other routes
app.use("/api/medications", medicationRoutes);
```

### 5. Create Auth Middleware (if you don't have it)

Create `middleware/auth.js`:

```javascript
import jwt from "jsonwebtoken";
import CustomerModel from "../models/Customer.js";

export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token =
      req.headers.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
        error: true,
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    const user = await CustomerModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error: true,
      success: false,
    });
  }
};
```

## 🔔 Notification Setup (Frontend)

### Android Configuration

Add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#41A67E",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ],
    "android": {
      "permissions": ["RECEIVE_BOOT_COMPLETED", "VIBRATE", "WAKE_LOCK"]
    }
  }
}
```

### iOS Configuration

Add to `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["fetch", "remote-notification"]
      }
    }
  }
}
```

## 📡 API Endpoints

| Method | Endpoint                     | Description              | Auth |
| ------ | ---------------------------- | ------------------------ | ---- |
| GET    | `/api/medications`           | Get all user medications | Yes  |
| GET    | `/api/medications/:id`       | Get single medication    | Yes  |
| POST   | `/api/medications`           | Create new medication    | Yes  |
| PUT    | `/api/medications/:id`       | Update medication        | Yes  |
| DELETE | `/api/medications/:id`       | Delete medication        | Yes  |
| POST   | `/api/medications/:id/taken` | Mark as taken            | Yes  |

## 📦 Request/Response Examples

### Create Medication

**Request:**

```json
POST /api/medications
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "Twice daily",
  "time": "08:00 AM, 08:00 PM",
  "notes": "Take with food",
  "startDate": "2024-10-10",
  "notificationId": "notification_id_from_expo"
}
```

**Response:**

```json
{
  "message": "Medication created successfully",
  "error": false,
  "success": true,
  "data": {
    "_id": "65f3a...",
    "userId": "65e2b...",
    "name": "Metformin",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "time": "08:00 AM, 08:00 PM",
    "notes": "Take with food",
    "startDate": "2024-10-10",
    "isActive": true,
    "createdAt": "2024-10-10T...",
    "updatedAt": "2024-10-10T..."
  }
}
```

## 🎯 Frontend Integration

Once backend is ready, update the medications page:

```typescript
import { medicationService } from "../../services/medicationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// On component mount - fetch from backend
useEffect(() => {
  loadMedications();
}, []);

const loadMedications = async () => {
  try {
    const meds = await medicationService.getAll();
    setMedications(meds);
  } catch (error) {
    console.error("Failed to load medications:", error);
  }
};

// When adding medication
const handleAddMedication = async () => {
  // ... validation ...

  try {
    // Schedule notification
    const notificationId = await scheduleNotification(newMed);
    newMed.notificationId = notificationId;

    // Save to backend
    const savedMed = await medicationService.create(newMed);

    // Update local state
    setMedications([...medications, savedMed]);

    Alert.alert("Success", "Medication added!");
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};

// When editing
const handleEditMedication = async () => {
  try {
    const updatedMed = await medicationService.update(editingMed.id, {
      name: medName,
      dosage,
      frequency,
      time,
      notes,
    });

    setMedications(
      medications.map((m) => (m.id === editingMed.id ? updatedMed : m))
    );

    Alert.alert("Success", "Medication updated!");
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};

// When deleting
const handleDeleteMedication = async (medication) => {
  try {
    await medicationService.delete(medication.id);
    setMedications(medications.filter((m) => m.id !== medication.id));
    Alert.alert("Success", "Medication deleted!");
  } catch (error) {
    Alert.alert("Error", error.toString());
  }
};
```

## 🔔 How Notifications Work

### Scheduling Process:

1. **User adds medication** with time "08:00 AM"
2. **Frontend schedules notification** using `expo-notifications`
3. **Notification ID saved** to medication record
4. **Daily reminder set** to repeat every day at 8 AM
5. **User receives notification** even when app is closed

### Time Format:

```
Single time: "08:00 AM"
Multiple times: "08:00 AM, 02:00 PM, 08:00 PM"
```

### Notification Content:

```
Title: "💊 Medication Reminder"
Body: "Time to take Metformin (500mg)"
Sound: ✓
Badge: ✓
Vibration: ✓
```

## 🧪 Testing Notifications

### Test Button (Already Added):

Click the bell icon in the header to send a test notification immediately.

### Real Medication Test:

1. Add medication with time 2 minutes from now
2. Wait 2 minutes
3. Should receive notification!

### Debug Notifications:

```typescript
// Check scheduled notifications
const notifications = await Notifications.getAllScheduledNotificationsAsync();
console.log("Scheduled:", notifications);

// Cancel all
await Notifications.cancelAllScheduledNotificationsAsync();
```

## 📱 Platform-Specific Notes

### Android:

- ✅ Works perfectly
- ✅ Notifications show even when app is closed
- ✅ Badges supported
- Needs: WAKE_LOCK permission

### iOS:

- ✅ Works perfectly
- ✅ Notifications show in notification center
- ✅ Badges supported
- Needs: User must grant permission

### Web:

- ⚠️ Limited support
- Use Web Notifications API instead
- Won't work in development

## 🔐 Security Considerations

1. **Authentication**: All medication endpoints require valid token
2. **User Isolation**: Users can only access their own medications
3. **Validation**: Backend validates all fields
4. **Sanitization**: Clean input data before saving

## 📊 Additional Features (Future)

### 1. Medication Adherence Tracking

```javascript
// Add to model
adherenceRate: {
  type: Number,
  default: 100
},
missedDoses: {
  type: Number,
  default: 0
}
```

### 2. Refill Reminders

```javascript
refillDate: {
  type: Date,
  default: null
},
pillsRemaining: {
  type: Number,
  default: null
}
```

### 3. Drug Interaction Warnings

```javascript
interactions: [
  {
    drugName: String,
    severity: String,
    warning: String,
  },
];
```

### 4. Photo Prescription Upload

```javascript
prescriptionImage: {
  type: String,
  default: null
}
```

## 🚀 Quick Setup Checklist

### Backend:

- [ ] Create Medication model
- [ ] Create medication routes
- [ ] Create medication controller
- [ ] Add auth middleware
- [ ] Register routes in server.js
- [ ] Test with Postman

### Frontend:

- [ ] Install expo-notifications ✅ (Already done)
- [ ] Request permissions ✅ (Already implemented)
- [ ] Create medication service ✅ (Already created)
- [ ] Implement CRUD operations ✅ (Already done)
- [ ] Connect to backend API (Uncomment TODO lines)
- [ ] Test notifications ✅ (Test button available)

## 📞 Support

### Common Issues:

**Notifications not appearing:**

- Check permissions granted
- Verify time format is correct
- Test with test notification button

**Backend connection fails:**

- Verify token is being sent
- Check API base URL
- Test endpoints with Postman

**Medications not saving:**

- Check backend is running
- Verify authentication
- Check console for errors

---

**Status:** Frontend ✅ Complete | Backend ⏳ Needs Setup

**Created:** October 10, 2025
