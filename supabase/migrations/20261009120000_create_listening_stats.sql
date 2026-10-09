-- Statistiques d'écoute agrégées par mois et par morceau, pour « Ton mois en musique ».
-- Une ligne par (utilisateur, mois, morceau) : le volume reste borné quel que soit le
-- nombre d'écoutes, contrairement au journal `listening_history` (plafonné à 200).
-- Appliquée sur le projet zxflwkejcnggyovkcura le 09/10/2026 (en trois migrations :
-- table, fonction, droits).

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

-- Ajoute des écoutes en un seul appel : les compteurs sont incrémentés côté base, ce qui
-- reste juste même si plusieurs appareils envoient leurs écoutes en même temps.
-- `security invoker` : la fonction s'exécute avec les droits (et les règles RLS) de l'appelant.
create function public.record_listening(entries jsonb) returns void
  language sql security invoker set search_path = '' as $$
  insert into public.listening_stats (user_id, month, track_id, artist_id, genre, plays, seconds)
  -- Regroupement préalable : un même morceau présent deux fois dans l'envoi ferait
  -- échouer le « on conflict ».
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
