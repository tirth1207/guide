import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton } from '@/components/ui/app-button';
import { Chip } from '@/components/ui/chip';
import { SectionTitle } from '@/components/ui/section-title';
import { BUDGETS, DEFAULT_TRIP, INTERESTS } from '@/constants/trip';
import { generateTrip } from '@/services/gemini';
import type { TripPreferences } from '@/types/trip';

export default function CreateTripScreen() {
  const [trip, setTrip] = useState<TripPreferences>(DEFAULT_TRIP);

  const canContinue = useMemo(
    () => trip.destination.trim().length > 1 && trip.interests.length > 0,
    [trip.destination, trip.interests],
  );

  function toggleInterest(id: TripPreferences['interests'][number]) {
    setTrip((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((interest) => interest !== id)
        : [...current.interests, id],
    }));
  }

  function continueToItinerary() {
    router.push({
      pathname: '/itinerary',
      params: {
        destination: trip.destination.trim(),
        travelers: String(trip.travelers),
        budget: trip.budget,
        interests: trip.interests.join(','),
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SMART TRIP</Text>
        <Text style={styles.title}>Plan a trip that feels made for you.</Text>
        <Text style={styles.subtitle}>
          Tell us a little about your trip. The AI planner will turn it into a day-by-day itinerary.
        </Text>
      </View>

      <SectionTitle title="Where are you going?" />
      <TextInput
        value={trip.destination}
        onChangeText={(destination) => setTrip((current) => ({ ...current, destination }))}
        placeholder="e.g. Goa, Rajasthan, Kyoto"
        placeholderTextColor="#999"
        style={styles.input}
      />

      <SectionTitle title="How many travelers?" />
      <View style={styles.counter}>
        <Pressable
          style={styles.counterButton}
          onPress={() =>
            setTrip((current) => ({ ...current, travelers: Math.max(1, current.travelers - 1) }))
          }>
          <Text style={styles.counterText}>−</Text>
        </Pressable>
        <Text style={styles.count}>{trip.travelers}</Text>
        <Pressable
          style={styles.counterButton}
          onPress={() =>
            setTrip((current) => ({ ...current, travelers: Math.min(20, current.travelers + 1) }))
          }>
          <Text style={styles.counterText}>+</Text>
        </Pressable>
      </View>

      <SectionTitle title="What's your travel style?" />
      <View style={styles.chips}>
        {BUDGETS.map((budget) => (
          <Chip
            key={budget.id}
            label={budget.label}
            selected={trip.budget === budget.id}
            onPress={() => setTrip((current) => ({ ...current, budget: budget.id }))}
          />
        ))}
      </View>

      <SectionTitle title="What do you want to experience?" subtitle="Pick at least one." />
      <View style={styles.chips}>
        {INTERESTS.map((interest) => (
          <Chip
            key={interest.id}
            label={interest.label}
            selected={trip.interests.includes(interest.id)}
            onPress={() => toggleInterest(interest.id)}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton label="Generate my trip" disabled={!canContinue} onPress={continueToItinerary} />
        <Text style={styles.note}>AI generation and live place verification will be connected next.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 24, gap: 18 },
  header: { gap: 8, marginBottom: 12 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#666' },
  title: { fontSize: 38, lineHeight: 44, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#666', maxWidth: 620 },
  input: { height: 56, borderWidth: 1, borderColor: '#D9D9DE', borderRadius: 16, paddingHorizontal: 16, fontSize: 16, color: '#111', backgroundColor: '#fff' },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  counterButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0F3', alignItems: 'center', justifyContent: 'center' },
  counterText: { fontSize: 26, color: '#111' },
  count: { fontSize: 22, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actions: { marginTop: 10, gap: 10 },
  note: { textAlign: 'center', color: '#777', fontSize: 12 },\n  error: { textAlign: 'center', color: '#B42318', fontSize: 13, lineHeight: 19 },
});
