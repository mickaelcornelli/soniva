-- Monthly listening stats per track, for "Ton mois en musique". One row per
-- (user, month, track): volume stays bounded regardless of play count, unlike
-- `listening_history` (capped at 200).

create table public.listening_stats (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  month date not null check (month = date_trunc('month', month)::date),
  track_id text not null check (char_length(track_id) between 1 and 64),
  artist_id text not null check (char_length(artist_id) between 1 and 64),
  genre text check (char_length(genre) <= 64),
  plays integer not null default 0 check (plays >= 0),
  seconds integer not null default 0 check (seconds >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, month, track_id)
);

alter table public.listening_stats enable row level security;

create policy "Statistiques : lecture des siennes" on public.listening_stats
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Statistiques : ajout des siennes" on public.listening_stats
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Statistiques : mise à jour des siennes" on public.listening_stats
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Statistiques : suppression des siennes" on public.listening_stats
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Adds plays in a single call: counters are incremented in the database,
-- which stays correct when several devices send plays at the same time.
-- `security invoker`: runs with the caller's privileges (and RLS policies).
create function public.record_listening(entries jsonb) returns void
  language sql security invoker set search_path = '' as $$
  insert into public.listening_stats (user_id, month, track_id, artist_id, genre, plays, seconds)
  -- Group first: the same track twice in one payload would make `on conflict` fail.
  select (select auth.uid()), e.month, e.track_id, max(e.artist_id), max(e.genre),
         least(sum(greatest(e.plays, 0)), 1000), least(sum(greatest(e.seconds, 0)), 86400)
  from jsonb_to_recordset(entries)
    as e(month date, track_id text, artist_id text, genre text, plays integer, seconds integer)
  group by e.month, e.track_id
  on conflict (user_id, month, track_id) do update
    set plays = public.listening_stats.plays + excluded.plays,
        seconds = public.listening_stats.seconds + excluded.seconds,
        artist_id = excluded.artist_id,
        genre = excluded.genre,
        updated_at = now();
$$;

revoke execute on function public.record_listening(jsonb) from public, anon;
grant execute on function public.record_listening(jsonb) to authenticated;
