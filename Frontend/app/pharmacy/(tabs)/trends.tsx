import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PharmacyHeader from '../components/ui/PharmacyHeader';
import { Card, CardContent } from '../components/ui/Card';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryBar, VictoryTheme } from 'victory-native';

export default function TrendsScreen() {
  const monthly = [
    { x: 'Jan', y: 120 }, { x: 'Feb', y: 140 }, { x: 'Mar', y: 180 }, { x: 'Apr', y: 220 },
    { x: 'May', y: 160 }, { x: 'Jun', y: 190 }, { x: 'Jul', y: 250 }, { x: 'Aug', y: 230 }, { x: 'Sep', y: 280 },
  ];
  const weekly = [
    { x: 'Mon', y: 45 }, { x: 'Tue', y: 52 }, { x: 'Wed', y: 38 }, { x: 'Thu', y: 65 },
    { x: 'Fri', y: 72 }, { x: 'Sat', y: 85 }, { x: 'Sun', y: 48 },
  ];

  // Guard: some setups don’t provide VictoryTheme; render without it if missing.
  const theme = (VictoryTheme as any)?.material ?? undefined;

  return (
    <View className="flex-1 bg-white">
      <PharmacyHeader title="Health Trends" />
      <ScrollView contentContainerClassName="p-4 gap-4 pb-24">
        <Card>
          <CardContent>
            <Text className="font-medium mb-2">Medicine Category Trends</Text>
            <VictoryChart theme={theme}>
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryLine data={monthly} />
            </VictoryChart>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text className="font-medium mb-2">Weekly Demand Pattern</Text>
            <VictoryChart theme={theme}>
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryBar data={weekly} />
            </VictoryChart>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}