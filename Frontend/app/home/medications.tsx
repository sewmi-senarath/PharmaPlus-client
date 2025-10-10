import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Notifications from 'expo-notifications';
import { medicationService } from '../../services/medicationService';
import DateTimePicker from '@react-native-community/datetimepicker';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface Medication {
  id?: string;
  _id?: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  notes?: string;
  startDate: string;
  endDate?: string;
  notificationId?: string;
}

export default function MedicationsScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  
  // Form fields
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');

  // Date/Time picker states
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timesList, setTimesList] = useState<string[]>([]);

  const frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed'];

  // Load medications and request permissions on mount
  useEffect(() => {
    registerForPushNotificationsAsync();
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const meds = await medicationService.getAll();
      setMedications(meds);
      console.log('✅ Medications loaded:', meds.length);
    } catch (error) {
      console.error('Failed to load medications:', error);
      // Show sample data if backend fails
      setMedications([
        {
          id: '1',
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          time: '08:00 AM, 08:00 PM',
          startDate: '2024-10-01',
          notes: 'Take with food',
        },
        {
          id: '2',
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          time: '09:00 PM',
          startDate: '2024-10-01',
          notes: 'Before bedtime',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medications', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#41A67E',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications to receive medication reminders!');
      return;
    }
  };

  const scheduleNotification = async (medication: Medication) => {
    try {
      // Parse time (e.g., "08:00 AM")
      const times = medication.time.split(',').map(t => t.trim());
      
      for (const timeStr of times) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        
        if (period === 'PM' && hours !== 12) hour += 12;
        if (period === 'AM' && hours === 12) hour = 0;

        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '💊 Medication Reminder',
            body: `Time to take ${medication.name} (${medication.dosage})`,
            sound: true,
            data: { medicationId: medication.id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute: minutes,
          },
        });
        
        console.log('📅 Notification scheduled:', notificationId);
        return notificationId;
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Could not schedule notification');
    }
  };

  const cancelNotification = async (notificationId: string) => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  };

  const handleAddMedication = async () => {
    if (!medName || !dosage || timesList.length === 0) {
      Alert.alert('Missing Fields', 'Please fill in medication name, dosage, and at least one reminder time');
      return;
    }

    try {
      const newMed: any = {
        name: medName,
        dosage,
        frequency,
        time,
        notes,
        startDate: startDate || new Date().toISOString().split('T')[0],
      };

      // Schedule notification
      const notificationId = await scheduleNotification(newMed);
      if (notificationId) {
        newMed.notificationId = notificationId;
      }

      // Save to backend
      const savedMed = await medicationService.create(newMed);
      console.log('✅ Medication saved to backend:', savedMed);
      
      // Update local state with backend response
      setMedications([...medications, savedMed]);
      resetForm();
      setShowAddModal(false);
      
      Alert.alert('Success', 'Medication added with reminder set!');
    } catch (error: any) {
      console.error('❌ Failed to add medication:', error);
      Alert.alert('Error', error.toString() || 'Failed to add medication. Please try again.');
    }
  };

  const handleEditMedication = async () => {
    if (!editingMed || !medName || !dosage || timesList.length === 0) {
      Alert.alert('Missing Fields', 'Please fill in medication name, dosage, and at least one reminder time');
      return;
    }

    try {
      // Cancel old notification
      if (editingMed.notificationId) {
        await cancelNotification(editingMed.notificationId);
      }

      const updateData: any = {
        name: medName,
        dosage,
        frequency,
        time,
        notes,
      };

      // Schedule new notification
      const notificationId = await scheduleNotification({ ...editingMed, ...updateData });
      if (notificationId) {
        updateData.notificationId = notificationId;
      }

      // Update in backend
      const medId = editingMed._id || editingMed.id;
      if (!medId) {
        throw new Error('Medication ID not found');
      }
      const updatedMed = await medicationService.update(medId, updateData);
      console.log('✅ Medication updated in backend:', updatedMed);
      
      // Update local state
      setMedications(medications.map(m => 
        (m.id === editingMed.id || m._id === editingMed._id) ? updatedMed : m
      ));
      resetForm();
      setEditingMed(null);
      setShowAddModal(false);
      
      Alert.alert('Success', 'Medication updated!');
    } catch (error: any) {
      console.error('❌ Failed to update medication:', error);
      Alert.alert('Error', error.toString() || 'Failed to update medication. Please try again.');
    }
  };

  const handleDeleteMedication = (medication: Medication) => {
    console.log('🗑️ Delete requested for:', medication);
    console.log('Medication ID:', medication._id || medication.id);
    
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete ${medication.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const medId = medication._id || medication.id;
              console.log('Deleting medication with ID:', medId);
              
              if (!medId) {
                throw new Error('Medication ID not found');
              }

              // Cancel notification first
              if (medication.notificationId) {
                console.log('Canceling notification:', medication.notificationId);
                await cancelNotification(medication.notificationId);
              }
              
              // Delete from backend
              console.log('Calling backend delete...');
              await medicationService.delete(medId);
              console.log('✅ Medication deleted from backend');
              
              // Update local state
              const beforeCount = medications.length;
              const newMedications = medications.filter(m => {
                const mId = m._id || m.id;
                const shouldKeep = mId !== medId;
                console.log(`Medication ${m.name}: ID=${mId}, shouldKeep=${shouldKeep}`);
                return shouldKeep;
              });
              
              console.log(`Filtered: ${beforeCount} → ${newMedications.length} medications`);
              setMedications(newMedications);
              
              Alert.alert('Success', 'Medication removed successfully!');
            } catch (error: any) {
              console.error('❌ Delete failed:', error);
              console.error('Error details:', error.response?.data);
              Alert.alert('Error', error.message || 'Failed to delete medication');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (medication: Medication) => {
    setEditingMed(medication);
    setMedName(medication.name);
    setDosage(medication.dosage);
    setFrequency(medication.frequency);
    setTime(medication.time);
    setNotes(medication.notes || '');
    setStartDate(medication.startDate);
    
    // Parse existing times into timesList
    if (medication.time) {
      const times = medication.time.split(',').map(t => t.trim());
      setTimesList(times);
    }
    
    setShowAddModal(true);
  };

  const resetForm = () => {
    setMedName('');
    setDosage('');
    setFrequency('Once daily');
    setTime('');
    setNotes('');
    setStartDate('');
    setEditingMed(null);
    setTimesList([]);
    setSelectedTime(new Date());
    setSelectedDate(new Date());
  };

  // Handle time picker
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    console.log('Time picker event:', event.type, selectedDate);
    
    // On Android, picker closes automatically
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return;
    }
    
    if (selectedDate && event.type === 'set') {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      
      console.log('Formatted time:', formattedTime);
      
      // Add to times list
      if (!timesList.includes(formattedTime)) {
        const newTimesList = [...timesList, formattedTime];
        setTimesList(newTimesList);
        setTime(newTimesList.join(', '));
        console.log('Times updated:', newTimesList);
      } else {
        Alert.alert('Duplicate', 'This time is already added');
      }
      
      setShowTimePicker(false);
      setSelectedTime(new Date()); // Reset for next pick
    }
  };

  // Handle date picker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log('Date picker event:', event.type, selectedDate);
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    
    if (selectedDate && event.type === 'set') {
      const formatted = selectedDate.toISOString().split('T')[0];
      setStartDate(formatted);
      setSelectedDate(selectedDate);
      console.log('Date set to:', formatted);
      setShowDatePicker(false);
    }
  };

  // Remove a time from the list
  const removeTime = (timeToRemove: string) => {
    console.log('Removing time:', timeToRemove);
    console.log('Current times:', timesList);
    const newTimesList = timesList.filter(t => t !== timeToRemove);
    console.log('New times:', newTimesList);
    setTimesList(newTimesList);
    setTime(newTimesList.join(', '));
  };

  // Manual time add (for web or backup)
  const addTimeManually = () => {
    Alert.prompt(
      'Add Reminder Time',
      'Enter time in format: HH:MM AM/PM\nExample: 08:00 AM',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (inputTime?: string) => {
            if (inputTime && !timesList.includes(inputTime)) {
              const newTimesList = [...timesList, inputTime];
              setTimesList(newTimesList);
              setTime(newTimesList.join(', '));
              console.log('Time added manually:', inputTime);
            }
          },
        },
      ],
      'plain-text',
      ''
    );
  };

  // Verify notifications are scheduled
  const verifyNotifications = async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('📅 All scheduled notifications:', scheduled);
    console.log('📋 Current medications:', medications);
    console.log('📊 Total medications:', medications.length);
    
    Alert.alert(
      'Debug Info',
      `Medications: ${medications.length}\nNotifications: ${scheduled.length}\n\nCheck console for full details.`,
      [{ text: 'OK' }]
    );
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Test Notification',
        body: 'Medication reminders are working!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    Alert.alert('Test', 'Notification will appear in 2 seconds');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-teal-600 px-4 py-6">
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">My Medications</Text>
            <Text className="text-teal-100 text-sm">Manage your daily medications</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={verifyNotifications}
              className="bg-white/20 p-2 rounded-lg"
            >
              <Ionicons name="list" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={testNotification}
              className="bg-white/20 p-2 rounded-lg"
            >
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {loading ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">💊</Text>
            <Text className="text-gray-600">Loading medications...</Text>
          </View>
        ) : medications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">💊</Text>
            <Text className="text-gray-800 font-semibold text-lg">No medications yet</Text>
            <Text className="text-gray-600 text-sm mt-1">Add your first medication to get started</Text>
          </View>
        ) : (
          medications.map((med) => (
            <View key={med._id || med.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-800 font-bold text-lg">{med.name}</Text>
                  <Text className="text-teal-600 font-semibold">{med.dosage}</Text>
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => openEditModal(med)}>
                    <Ionicons name="create-outline" size={24} color="#41A67E" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteMedication(med)}>
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="border-t border-gray-100 pt-3 mt-3">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 text-sm">{med.frequency}</Text>
                </View>
                
                <View className="flex-row items-center mb-2">
                  <Ionicons name="alarm-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 text-sm">{med.time}</Text>
                </View>

                {med.notes && (
                  <View className="flex-row items-start mb-2">
                    <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-2 text-sm flex-1">{med.notes}</Text>
                  </View>
                )}

                <View className="bg-teal-50 px-3 py-2 rounded-lg mt-2 flex-row items-center">
                  <Ionicons name="notifications" size={16} color="#41A67E" />
                  <Text className="text-teal-700 text-xs ml-2 font-semibold">
                    Reminders Active
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Medication Button */}
      <View className="px-4 pb-4">
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-teal-600 py-4 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white font-semibold ml-2 text-lg">Add Medication</Text>
        </TouchableOpacity>
      </View>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          resetForm();
          setShowAddModal(false);
        }}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-gray-800">
                {editingMed ? 'Edit Medication' : 'Add Medication'}
              </Text>
              <TouchableOpacity onPress={() => {
                resetForm();
                setShowAddModal(false);
              }}>
                <AntDesign name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Medication Name */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Medication Name *</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                  placeholder="e.g., Paracetamol"
                  value={medName}
                  onChangeText={setMedName}
                />
              </View>

              {/* Dosage */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Dosage *</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                  placeholder="e.g., 500mg"
                  value={dosage}
                  onChangeText={setDosage}
                />
              </View>

              {/* Frequency */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Frequency *</Text>
                <View className="flex-row flex-wrap gap-2">
                  {frequencies.map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      onPress={() => setFrequency(freq)}
                      className={`px-4 py-2 rounded-lg ${
                        frequency === freq
                          ? 'bg-teal-600'
                          : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <Text className={`text-sm font-semibold ${
                        frequency === freq ? 'text-white' : 'text-gray-700'
                      }`}>
                        {freq}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Picker */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Reminder Times *</Text>
                
                {Platform.OS !== 'web' ? (
                  /* Native Time Picker Buttons */
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Opening time picker...');
                        setShowTimePicker(true);
                      }}
                      className="flex-1 border-2 border-teal-600 bg-teal-50 p-3 rounded-lg flex-row items-center justify-center"
                    >
                      <Ionicons name="alarm-outline" size={20} color="#41A67E" />
                      <Text className="text-teal-600 font-semibold ml-2">Pick Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={addTimeManually}
                      className="px-4 border border-teal-600 bg-white p-3 rounded-lg flex-row items-center justify-center"
                    >
                      <Ionicons name="create-outline" size={20} color="#41A67E" />
                      <Text className="text-teal-600 font-semibold ml-1">Type</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Web Fallback - Manual Input */
                  <View>
                    <TextInput
                      className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 mb-2"
                      placeholder="Enter time (e.g., 08:00 AM)"
                      value={time}
                      onChangeText={(text) => {
                        setTime(text);
                        if (text) {
                          const times = text.split(',').map(t => t.trim());
                          setTimesList(times);
                        }
                      }}
                    />
                    <Text className="text-xs text-gray-500">
                      Format: HH:MM AM/PM (e.g., 08:00 AM, 02:00 PM)
                    </Text>
                  </View>
                )}

                {/* Display Selected Times */}
                {timesList.length > 0 && Platform.OS !== 'web' && (
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {timesList.map((t, index) => (
                      <View key={index} className="bg-teal-100 px-3 py-2 rounded-lg flex-row items-center">
                        <Ionicons name="time" size={16} color="#41A67E" />
                        <Text className="text-teal-700 font-semibold ml-1">{t}</Text>
                        <TouchableOpacity onPress={() => {
                          console.log('Removing time:', t);
                          removeTime(t);
                        }} className="ml-2">
                          <AntDesign name="close" size={14} color="#41A67E" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                
                {Platform.OS !== 'web' && (
                  <Text className="text-xs text-gray-500 mt-1">
                    Tap &quot;Add Reminder Time&quot; to add multiple times per day
                  </Text>
                )}
              </View>

              {/* Time Picker Modal - Only on Native */}
              {showTimePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
              )}

              {/* Start Date Picker */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Start Date</Text>
                {Platform.OS !== 'web' ? (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Opening date picker...');
                      setShowDatePicker(true);
                    }}
                    className="w-full border border-gray-300 p-3 rounded-lg flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                      <Text className="text-gray-800 ml-2">
                        {startDate || 'Select start date (optional)'}
                      </Text>
                    </View>
                    <AntDesign name="down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                ) : (
                  /* Web Fallback - Date Input */
                  <TextInput
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                    placeholder="YYYY-MM-DD (e.g., 2024-10-10)"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                )}
              </View>

              {/* Date Picker Modal - Only on Native */}
              {showDatePicker && Platform.OS !== 'web' && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}

              {/* Notes */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</Text>
                <TextInput
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800"
                  placeholder="e.g., Take with food, Before bedtime"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={2}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={editingMed ? handleEditMedication : handleAddMedication}
                className="bg-teal-600 py-4 rounded-xl"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {editingMed ? 'Update Medication' : 'Add Medication'}
                </Text>
              </TouchableOpacity>

              {editingMed && (
                <TouchableOpacity
                  onPress={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="bg-gray-100 py-3 rounded-xl mt-2"
                >
                  <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}