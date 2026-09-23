export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

/**
 * Google Maps integration boundary.
 *
 * Gemini can suggest place names, but Google Places/Routes should be used to
 * resolve real places and route information.
 */
export async function searchPlace(_query: string): Promise<PlaceResult[]> {
  throw new Error(
    'Google Maps is not configured yet. Add the server-side/client-safe Maps integration before calling searchPlace().',
  );
}
