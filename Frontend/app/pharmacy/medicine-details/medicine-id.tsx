import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

const MedicineDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  // Here you would typically fetch the medicine details from your API using the ID
  // For now, we'll just display the ID.

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Medicine Details' }} />
      <Text style={styles.title}>Medicine Details</Text>
      {id ? (
        <Text style={styles.text}>
          Displaying details for Medicine ID: {Array.isArray(id) ? id[0] : id}
        </Text>
      ) : (
        <ActivityIndicator />
      )}
      <Text style={styles.placeholder}>
        (This is a placeholder screen. You can build the full UI for displaying
        medicine details here.)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MedicineDetailsScreen;
