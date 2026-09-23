import { ScrollView, StyleSheet, Text, View } from 'react-native';

const items = [
  ['Discover', 'Browse destinations and experiences once the Places integration is connected.'],
  ['Saved trips', 'Keep generated itineraries in your account through Supabase.'],
  ['AI changes', 'Ask the planner to swap activities, adjust pace or work within a new budget.'],
];

export default function ExploreScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>EXPLORE</Text>
      <Text style={styles.title}>Travel ideas, without the spreadsheet.</Text>
      <Text style={styles.subtitle}>
        This area will become the discovery layer for destinations, places and saved experiences.
      </Text>
      <View style={styles.list}>
        {items.map(([title, description]) => (
          <View key={title} style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>{description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 800, alignSelf: 'center', padding: 24, gap: 16 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, color: '#666', marginTop: 24 },
  title: { fontSize: 36, lineHeight: 42, fontWeight: '800', color: '#111' },
  subtitle: { fontSize: 16, lineHeight: 24, color: '#666', maxWidth: 650 },
  list: { gap: 12, marginTop: 10 },
  card: { padding: 20, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E5E8', gap: 6 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  cardText: { fontSize: 14, lineHeight: 21, color: '#666' },
});
