// import React, { useState } from 'react';
// import { View, Button, Alert } from 'react-native';
// import { CardField, useStripe } from '@stripe/stripe-react-native';
// import axios from 'axios';
// import { CardFieldInput } from '@stripe/stripe-react-native';

// export default function PaymentScreen() {
//   const { confirmPayment } = useStripe();
//   const [cardDetails, setCardDetails] = useState<any>();

//   const handlePay = async () => {
//     try {
//       // 1️⃣ Create PaymentIntent on backend
//       const res = await axios.post('http://192.168.1.3:5000/api/payments/create-payment-intent', {
//         amount: 1000, // LKR 1000
//         currency: 'usd',
//       });

//       const clientSecret = res.data.clientSecret;

//       // 2️⃣ Confirm Payment
//       const { paymentIntent, error } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//       });

//       if (error) {
//         Alert.alert('Payment failed', error.message);
//       } else if (paymentIntent) {
//         Alert.alert('Success', `Payment successful! Status: ${paymentIntent.status}`);
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', 'Something went wrong');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <CardField
//         postalCodeEnabled={false}
//         placeholders={{ number: '4242 4242 4242 4242' }}
//         cardStyle={{
//           backgroundColor: '#FFFFFF',
//           textColor: '#000000',
//         }}
//         style={{ height: 50, marginVertical: 30 }}
//         onCardChange={(details) => setCardDetails(details)}
//       />
//       <Button title="Pay Now" onPress={handlePay} />
//     </View>
//   );
// }
