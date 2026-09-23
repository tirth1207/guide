import type { GeneratedTrip, TripPreferences } from '@/types/trip';

/**
 * Gemini integration boundary.
 *
 * Keep the Gemini API key server-side. The mobile/web client should call a
 * backend endpoint or Supabase Edge Function instead of embedding a secret
 * in the Expo bundle.
 */
export async function generateTrip(_preferences: TripPreferences): Promise<GeneratedTrip> {
  throw new Error(
    'Gemini is not configured yet. Add the server-side trip generation endpoint before calling generateTrip().',
  );
}
