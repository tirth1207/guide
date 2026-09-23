import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerTitle: 'Smart Trip',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#111',
          contentStyle: { backgroundColor: '#FAFAF8' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="create-trip" options={{ title: 'Create trip' }} />
        <Stack.Screen name="itinerary" options={{ title: 'Your itinerary' }} />
        <Stack.Screen name="map" options={{ title: 'Trip map' }} />
        <Stack.Screen name="explore" options={{ title: 'Explore' }} />
      </Stack>
    </>
  );
}
