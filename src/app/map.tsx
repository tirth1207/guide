import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui/app-button';
import { router } from 'expo-router';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.pin}>MAP</Text>
        <Text style={styles.title}>Live trip map</Text>
        <Text style={styles.text}>
          Google Maps, Places and Routes will be connected here. The map layer is intentionally
          isolated so it can support Android, iOS and web without leaking API secrets.
        </Text>
      </View>
      <AppButton label="Back to itinerary" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, gap: 16, justifyContent: 'center' },
  mapPlaceholder: { minHeight: 420, borderRadius: 28, backgroundColor: '#EDEDEB', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  pin: { fontSize: 12, letterSpacing: 2, fontWeight: '800', color: '#777' },
  title: { fontSize: 30, fontWeight: '800', color: '#111' },
  text: { maxWidth: 520, textAlign: 'center', color: '#666', lineHeight: 22 },
});
