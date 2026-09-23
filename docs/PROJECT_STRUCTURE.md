# Smart Trip — Project Structure

## Product

Smart Trip is an AI-assisted travel planning application. The Expo client collects trip preferences, requests an itinerary from a server-side AI endpoint, verifies suggested places through Google Places, and can calculate routes through Google Routes.

## Repository layout

```
guide/
├── src/
│   ├── app/
│   │   ├── _layout.tsx          # Expo Router stack configuration
│   │   ├── index.tsx            # Home / product entry
│   │   ├── create-trip.tsx      # Trip preference form
│   │   ├── itinerary.tsx        # Generated itinerary
│   │   ├── map.tsx              # Map / route presentation
│   │   └── explore.tsx          # Explore entry point
│   ├── components/
│   │   └── ui/                  # Reusable UI primitives
│   ├── constants/
│   │   └── trip.ts              # Interest, budget and defaults
│   ├── hooks/                   # Shared React hooks
│   ├── services/
│   │   ├── gemini.ts            # AI trip generation client
│   │   ├── maps.ts              # Client-side maps service boundary
│   │   └── supabase.ts          # Supabase configuration boundary
│   └── types/
│       └── trip.ts              # Shared trip domain types
│
├── supabase/
│   ├── migrations/
│   │   └── 20260923000100_create_smart_trip.sql
│   └── functions/
│       ├── generate-trip/
│       │   └── index.ts         # Gemini itinerary generation
│       ├── verify-place/
│       │   └── index.ts         # Google Places Text Search
│       └── route-trip/
│           └── index.ts         # Google Routes API
│
├── docs/
│   └── PROJECT_STRUCTURE.md     # This document
│
├── .env.example                 # Client environment template
├── app.json                     # Expo configuration
├── package.json                 # Scripts and dependencies
└── README.md                    # Setup and development guide
```

## Runtime boundaries

### Expo client
The client owns UI, local state, navigation and presentation. It may contain public configuration such as the Supabase URL and publishable key.

### Supabase
Supabase stores authenticated user trips, itinerary days, activities, verified places and route results. Row Level Security limits trip data to the owning user.

### Edge Functions
Edge Functions are the secure integration layer for Gemini and Google Maps Platform. API secrets stay in Supabase function secrets rather than in the Expo bundle.

## Data flow

1. User enters destination, traveler count, budget and interests.
2. Client calls `generate-trip`.
3. Gemini returns structured itinerary JSON.
4. Suggested place names can be sent to `verify-place`.
5. Google Places returns Place IDs and coordinates.
6. Verified places are persisted in `places`.
7. Activities reference verified places.
8. `route-trip` calculates distance, duration and encoded route polylines.
9. The map screen renders the resulting itinerary and route.

## Database model

- `trips`: top-level trip and generation state.
- `trip_days`: normalized day records.
- `trip_activities`: ordered activities for each day.
- `places`: Google Place ID and verified place metadata.
- `trip_routes`: route legs between activities.

## Security

- Never commit Gemini or Google API secrets.
- Keep `supabase/functions/.env` local only.
- Put production secrets in Supabase Edge Function secrets.
- Use Supabase publishable/anon keys only in the client.
- Keep service-role/secret keys server-side.
- RLS is enabled on user-owned trip data.

## API keys to add later

Client `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_TRIP_API_URL=
```

Supabase function secrets:
```
GEMINI_API_KEY=
GOOGLE_MAPS_API_KEY=
```

## Planned next implementation

- Wire `verify-place` into itinerary generation.
- Persist generated trips and verified places.
- Add authenticated Supabase client.
- Replace map placeholder with native/web map presentation.
- Add saved trips and trip history.
- Add place photos and richer destination discovery.
