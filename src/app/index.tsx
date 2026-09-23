import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { SectionTitle } from '@/components/ui/section-title';

const features = [
  ['AI itinerary', 'Generate a practical day-by-day plan around your destination, budget and interests.'],
  ['Real places', 'Resolve suggested places through Google Places before showing them on the map.'],
  ['Smart routes', 'Use Google Routes to understand distance and travel time between activities.'],
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>SMART TRIP</Text>
        <Text style={styles.title}>Travel less like a checklist. Travel more like a story.</Text>
        <Text style={styles.subtitle}>
          One universal app for discovering destinations, generating personalized itineraries and
          navigating the trip.
        </Text>
        <AppButton label="Plan a new trip" onPress={() => router.push('/create-trip')} />
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewLabel}>AI TRAVEL PLANNER</Text>
        <Text style={styles.previewTitle}>Your next trip starts with one idea.</Text>
        <Text style={styles.previewText}>
          Tell Smart Trip where you want to go and what you love. The planner will turn those
          preferences into a structured itinerary.
        </Text>
      </View>

      <SectionTitle title="What Smart Trip will do" subtitle="The foundation is now in place for the AI and maps integrations." />

      <View style={styles.featureList}>
        {features.map(([title, description]) => (
          <View key={title} style={styles.feature}>
            <View style={styles.number}>
              <Text style={styles.numberText}>{features.indexOf([title, description]) + 1}</Text>
            </View>
            <View style={styles.featureCopy}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureText}>{description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>SIH 2026 · Travel & Tourism · Team Nexora</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 800, alignSelf: 'center', padding: 24, gap: 24 },
  hero: { paddingTop: 40, gap: 12 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.6, color: '#666' },
  title: { fontSize: 42, lineHeight: 48, fontWeight: '800', color: '#111', maxWidth: 700 },
  subtitle: { fontSize: 17, lineHeight: 26, color: '#666', maxWidth: 680, marginBottom: 8 },
  preview: { backgroundColor: '#111', borderRadius: 28, padding: 24, gap: 10 },
  previewLabel: { color: '#AFAFAF', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  previewTitle: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 34 },
  previewText: { color: '#D1D1D1', fontSize: 15, lineHeight: 23 },
  featureList: { gap: 12 },
  feature: { flexDirection: 'row', gap: 14, padding: 18, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5E8' },
  number: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  numberText: { color: '#fff', fontWeight: '800' },
  featureCopy: { flex: 1, gap: 4 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  featureText: { fontSize: 14, lineHeight: 20, color: '#666' },
  footer: { textAlign: 'center', color: '#999', fontSize: 12, paddingBottom: 20 },
});
