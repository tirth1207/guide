create extension if not exists pgcrypto;

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  destination text not null,
  start_date date,
  end_date date,
  travelers integer not null default 1 check (travelers between 1 and 20),
  budget text not null default 'moderate' check (budget in ('budget','moderate','premium')),
  interests text[] not null default '{}',
  summary text,
  status text not null default 'draft' check (status in ('draft','generating','ready','failed')),
  raw_itinerary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number integer not null,
  trip_date date,
  created_at timestamptz not null default now(),
  unique (trip_id, day_number)
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  google_place_id text unique,
  name text not null,
  formatted_address text,
  latitude double precision,
  longitude double precision,
  rating numeric(2,1),
  user_ratings_total integer,
  place_types text[] not null default '{}',
  website_uri text,
  maps_uri text,
  photo_resource_name text,
  raw_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_activities (
  id uuid primary key default gen_random_uuid(),
  trip_day_id uuid not null references public.trip_days(id) on delete cascade,
  place_id uuid references public.places(id) on delete set null,
  name text not null,
  description text,
  location_text text,
  start_time time,
  duration_minutes integer,
  sequence_order integer not null default 0,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  unique (trip_day_id, sequence_order)
);

create table if not exists public.trip_routes (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  from_activity_id uuid references public.trip_activities(id) on delete set null,
  to_activity_id uuid references public.trip_activities(id) on delete set null,
  mode text not null default 'DRIVE',
  distance_meters integer,
  duration_seconds integer,
  encoded_polyline text,
  raw_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trips_user_id_idx on public.trips(user_id);
create index if not exists trip_days_trip_id_idx on public.trip_days(trip_id);
create index if not exists trip_activities_day_idx on public.trip_activities(trip_day_id);
create index if not exists trip_routes_trip_id_idx on public.trip_routes(trip_id);
create index if not exists places_google_place_id_idx on public.places(google_place_id);

alter table public.trips enable row level security;
alter table public.trip_days enable row level security;
alter table public.places enable row level security;
alter table public.trip_activities enable row level security;
alter table public.trip_routes enable row level security;

drop policy if exists "users can read own trips" on public.trips;
create policy "users can read own trips" on public.trips
  for select using (auth.uid() = user_id);

drop policy if exists "users can create own trips" on public.trips;
create policy "users can create own trips" on public.trips
  for insert with check (auth.uid() = user_id);

drop policy if exists "users can update own trips" on public.trips;
create policy "users can update own trips" on public.trips
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can delete own trips" on public.trips;
create policy "users can delete own trips" on public.trips
  for delete using (auth.uid() = user_id);

drop policy if exists "users can read their trip days" on public.trip_days;
create policy "users can read their trip days" on public.trip_days
  for select using (
    exists (select 1 from public.trips t where t.id = trip_days.trip_id and t.user_id = auth.uid())
  );

drop policy if exists "users can manage their trip days" on public.trip_days;
create policy "users can manage their trip days" on public.trip_days
  for all using (
    exists (select 1 from public.trips t where t.id = trip_days.trip_id and t.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.trips t where t.id = trip_days.trip_id and t.user_id = auth.uid())
  );

drop policy if exists "users can read their activities" on public.trip_activities;
create policy "users can read their activities" on public.trip_activities
  for select using (
    exists (
      select 1 from public.trip_days d
      join public.trips t on t.id = d.trip_id
      where d.id = trip_activities.trip_day_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "users can manage their activities" on public.trip_activities;
create policy "users can manage their activities" on public.trip_activities
  for all using (
    exists (
      select 1 from public.trip_days d
      join public.trips t on t.id = d.trip_id
      where d.id = trip_activities.trip_day_id and t.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.trip_days d
      join public.trips t on t.id = d.trip_id
      where d.id = trip_activities.trip_day_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "users can read their routes" on public.trip_routes;
create policy "users can read their routes" on public.trip_routes
  for select using (
    exists (select 1 from public.trips t where t.id = trip_routes.trip_id and t.user_id = auth.uid())
  );

drop policy if exists "users can manage their routes" on public.trip_routes;
create policy "users can manage their routes" on public.trip_routes
  for all using (
    exists (select 1 from public.trips t where t.id = trip_routes.trip_id and t.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.trips t where t.id = trip_routes.trip_id and t.user_id = auth.uid())
  );

drop policy if exists "authenticated users can read places" on public.places;
create policy "authenticated users can read places" on public.places
  for select to authenticated using (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trips_updated_at on public.trips;
create trigger trips_updated_at before update on public.trips
for each row execute function public.set_updated_at();

drop trigger if exists places_updated_at on public.places;
create trigger places_updated_at before update on public.places
for each row execute function public.set_updated_at();