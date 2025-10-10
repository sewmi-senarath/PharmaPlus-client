import { Tabs } from 'expo-router';
import AntDesign from 'react-native-vector-icons/AntDesign';
//import { StripeProvider } from '@stripe/stripe-react-native';
//import { loadStripe } from '@stripe/stripe-js';


export default function HomeLayout() {
  return (
   // <StripeProvider publishableKey="pk_test_51PZwFL2MW7Q4GR3Y4iPIqKXR1t8Hx0qiAYqUdqvtpyHQZcLQXhJo14WnBmcPw1WubLIMcMtYNbJVUfYzf49xMWnB00A6K9x9fY">
    
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#41A67E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="shoppingcart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Medications',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="medicinebox" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="creditcard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
   // </StripeProvider>
  );
}