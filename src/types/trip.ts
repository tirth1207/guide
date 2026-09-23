export type TripInterest =
  | 'nature'
  | 'food'
  | 'adventure'
  | 'history'
  | 'shopping'
  | 'culture'
  | 'relaxation';

export type TripBudget = 'budget' | 'moderate' | 'premium';

export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: TripBudget;
  interests: TripInterest[];
}

export interface ItineraryActivity {
  id: string;
  name: string;
  description: string;
  location: string;
  startTime: string;
  durationMinutes: number;
  latitude?: number;
  longitude?: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface GeneratedTrip {
  title: string;
  destination: string;
  summary: string;
  days: ItineraryDay[];
}
