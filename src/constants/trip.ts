import type { TripBudget, TripInterest } from '@/types/trip';

export const INTERESTS: { id: TripInterest; label: string; emoji: string }[] = [
  { id: 'nature', label: 'Nature', emoji: 'Nature' },
  { id: 'food', label: 'Food', emoji: 'Food' },
  { id: 'adventure', label: 'Adventure', emoji: 'Adventure' },
  { id: 'history', label: 'History', emoji: 'History' },
  { id: 'shopping', label: 'Shopping', emoji: 'Shopping' },
  { id: 'culture', label: 'Culture', emoji: 'Culture' },
  { id: 'relaxation', label: 'Relaxation', emoji: 'Relaxation' },
];

export const BUDGETS: { id: TripBudget; label: string; description: string }[] = [
  { id: 'budget', label: 'Budget', description: 'Value-focused travel' },
  { id: 'moderate', label: 'Moderate', description: 'Comfort with flexibility' },
  { id: 'premium', label: 'Premium', description: 'Higher-end experience' },
];

export const DEFAULT_TRIP: TripPreferences = {
  destination: '',
  startDate: '',
  endDate: '',
  travelers: 2,
  budget: 'moderate',
  interests: [],
};
