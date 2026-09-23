import type { GeneratedTrip, TripPreferences } from '@/types/trip';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

function createDemoTrip(preferences: TripPreferences): GeneratedTrip {
  const interests = preferences.interests.join(', ');
  const days = [
    {
      day: 1,
      date: preferences.startDate || 'Day 1',
      activities: [
        {
          id: 'arrival',
          name: 'Arrival & local orientation',
          description: 'Check in, get settled, and explore the immediate area at an easy pace.',
          location: preferences.destination,
          startTime: '09:00',
          durationMinutes: 180,
        },
        {
          id: 'local-food',
          name: 'Local food experience',
          description: `Try a well-reviewed local meal aligned with your interests: ${interests}.`,
          location: preferences.destination,
          startTime: '13:00',
          durationMinutes: 120,
        },
        {
          id: 'sunset',
          name: 'Sunset exploration',
          description: 'Finish the day with a relaxed viewpoint, promenade, or cultural area.',
          location: preferences.destination,
          startTime: '18:00',
          durationMinutes: 120,
        },
      ],
    },
    {
      day: 2,
      date: 'Day 2',
      activities: [
        {
          id: 'signature',
          name: 'Signature attraction',
          description: 'Spend the morning at one of the destination\'s defining experiences.',
          location: preferences.destination,
          startTime: '09:00',
          durationMinutes: 180,
        },
        {
          id: 'experience',
          name: 'Interest-led experience',
          description: `A focused activity selected around ${interests}.`,
          location: preferences.destination,
          startTime: '13:30',
          durationMinutes: 150,
        },
        {
          id: 'evening',
          name: 'Free evening',
          description: 'Keep the evening flexible for shopping, food, or spontaneous exploration.',
          location: preferences.destination,
          startTime: '18:30',
          durationMinutes: 120,
        },
      ],
    },
    {
      day: 3,
      date: 'Day 3',
      activities: [
        {
          id: 'slow-morning',
          name: 'Slow morning',
          description: 'Breakfast and a low-pressure start before your final experiences.',
          location: preferences.destination,
          startTime: '09:00',
          durationMinutes: 120,
        },
        {
          id: 'final-stop',
          name: 'Final stop',
          description: 'Use the remaining time for one memorable nearby place.',
          location: preferences.destination,
          startTime: '11:30',
          durationMinutes: 150,
        },
        {
          id: 'departure',
          name: 'Departure',
          description: 'Check out and begin your return journey.',
          location: preferences.destination,
          startTime: '15:00',
          durationMinutes: 90,
        },
      ],
    },
  ];

  return {
    title: `${preferences.destination} smart itinerary`,
    destination: preferences.destination,
    summary: `A ${preferences.budget} trip for ${preferences.travelers} traveler(s), shaped around ${interests}.`,
    days,
  };
}

/**
 * Calls the project's server-side AI endpoint when configured.
 * The Gemini secret must never be embedded in the Expo client.
 */
export async function generateTrip(preferences: TripPreferences): Promise<GeneratedTrip> {
  if (!API_URL) {
    return createDemoTrip(preferences);
  }

  const response = await fetch(`${API_URL.replace(/\\/$/, '')}/api/trips/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Trip generation failed.');
  }

  const data = (await response.json()) as GeneratedTrip;

  if (!data?.days?.length || !data.destination) {
    throw new Error('The trip service returned an invalid itinerary.');
  }

  return data;
}
