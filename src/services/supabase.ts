/**
 * Supabase integration boundary.
 *
 * The client will be added once the Supabase project URL and publishable
 * client key are available. Never commit service-role keys to this app.
 */
export const supabaseConfigured =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
