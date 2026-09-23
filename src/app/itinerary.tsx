import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';

const SAMPLE_DAYS = [
  {
    day: 1,
    title: 'Arrival & first impressions',
    activities: ['Check in and settle down', 'Explore the local area', 'Dinner at a highly rated local spot'],
  },
  {
    day: 2,
    title: 'Signature experiences',
    activities: ['Morning landmark visit', 'Local food experience', 'Sunset viewpoint'],
  },
  {
    day: 3,
    title: 'Slow travel & return',
    activities: ['Breakfast', 'Flexible exploration', 'Departure'],
  },
];

export default function ItineraryScreen() {
  const params = useLocalSearchParams<{
    destination?: string;
    travelers?: string;
    budget?: string;
    interests?: string;
  }>();

  const destination = params.destination || 'your destination';
  const interests = params.interests?.split(',').filter(Boolean).join(', ') || 'your interests';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>YOUR TRIP</Text>
        <Text style={styles.title}>{destination}</Text>
        <Text style={styles.subtitle}>
          A starter itinerary for {params.travelers || 2} travelers, focused on {interests}.
        </Text>
      </View>

      <View style={styles.aiCard}>
        <Text style={styles.aiLabel}>AI PLANNER</Text>
        <Text style={styles.aiTitle}>Your itinerary engine is ready.</Text>
        <Text style={styles.aiText}>
          This screen currently uses demo data. The next integration will replace these activities
          with structured Gemini output and verify each place through Google Places.
        </Text>
      </View>

      {SAMPLE_DAYS.map((day) => (
        <View key={day.day} style={styles.dayCard}>
          <View>
            <Text style={styles.dayLabel}>DAY {day.day}</Text>
            <Text style={styles.dayTitle}>{day.title}</Text>
          </View>
          {day.activities.map((activity, index) => (
            <View key={activity} style={styles.activity}>
              <View style={styles.dot} />
              <View style={styles.activityCopy}>
                <Text style={styles.time}>{index === 0 ? '09:00' : index === 1 ? '13:00' : '18:00'}</Text>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      <AppButton label="Open trip map" variant="secondary" onPress={() => router.push('/map')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, gap: 16 },
  hero: { gap: 8, marginBottom: 8 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#666' },
  title: { fontSize: 42, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#666' },
  aiCard: { backgroundColor: '#111', borderRadius: 24, padding: 22, gap: 8 },
  aiLabel: { color: '#AFAFAF', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  aiTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  aiText: { color: '#D1D1D1', lineHeight: 21 },
  dayCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5E8', borderRadius: 22, padding: 20, gap: 16 },
  dayLabel: { color: '#777', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  dayTitle: { color: '#111', fontSize: 20, fontWeight: '700', marginTop: 4 },
  activity: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#111', marginTop: 6 },
  activityCopy: { flex: 1, gap: 2 },
  time: { fontSize: 12, fontWeight: '700', color: '#777' },
  activityText: { fontSize: 15, lineHeight: 21, color: '#222' },
});
