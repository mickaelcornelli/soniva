-- Soniva : données propres à l'application. Les métadonnées musicales restent chez le
-- provider (Audius) : on ne stocke que des identifiants de morceaux.
-- Appliquée sur le projet zxflwkejcnggyovkcura le 08/10/2026.

-- Favoris ---------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  track_id text not null check (char_length(track_id) between 1 and 64),
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create index favorites_user_created_idx on public.favorites (user_id, created_at desc);

alter table public.favorites enable row level security;

create policy "Favoris : lecture des siens" on public.favorites
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Favoris : ajout des siens" on public.favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Favoris : suppression des siens" on public.favorites
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Playlists personnelles -------------------------------------------------------
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  description text check (char_length(description) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index playlists_user_updated_idx on public.playlists (user_id, updated_at desc);

alter table public.playlists enable row level security;

create policy "Playlists : lecture des siennes" on public.playlists
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Playlists : création des siennes" on public.playlists
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Playlists : modification des siennes" on public.playlists
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Playlists : suppression des siennes" on public.playlists
  for delete to authenticated using ((select auth.uid()) = user_id);

create function public.set_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger playlists_set_updated_at before update on public.playlists
  for each row execute function public.set_updated_at();

-- Morceaux des playlists -------------------------------------------------------
create table public.playlist_tracks (
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  track_id text not null check (char_length(track_id) between 1 and 64),
  position integer not null check (position >= 0),
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id)
);

create index playlist_tracks_order_idx on public.playlist_tracks (playlist_id, position);

alter table public.playlist_tracks enable row level security;

-- L'accès suit la propriété de la playlist parente.
create policy "Titres de playlist : lecture des siens" on public.playlist_tracks
  for select to authenticated using (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = (select auth.uid())
  ));
create policy "Titres de playlist : ajout aux siennes" on public.playlist_tracks
  for insert to authenticated with check (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = (select auth.uid())
  ));
create policy "Titres de playlist : réordonner les siens" on public.playlist_tracks
  for update to authenticated
  using (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = (select auth.uid())
  ));
create policy "Titres de playlist : retrait des siens" on public.playlist_tracks
  for delete to authenticated using (exists (
    select 1 from public.playlists p
    where p.id = playlist_id and p.user_id = (select auth.uid())
  ));

-- Historique d'écoute ----------------------------------------------------------
create table public.listening_history (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  track_id text not null check (char_length(track_id) between 1 and 64),
  played_at timestamptz not null default now()
);

create index listening_history_user_played_idx
  on public.listening_history (user_id, played_at desc);

alter table public.listening_history enable row level security;

create policy "Historique : lecture du sien" on public.listening_history
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Historique : ajout au sien" on public.listening_history
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Historique : effacement du sien" on public.listening_history
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Plan gratuit : l'historique est plafonné aux 200 dernières écoutes par utilisateur.
create function public.trim_listening_history() returns trigger
  language plpgsql set search_path = '' as $$
begin
  delete from public.listening_history
  where user_id = new.user_id
    and id in (
      select id from public.listening_history
      where user_id = new.user_id
      order by played_at desc
      offset 200
    );
  return null;
end;
$$;

create trigger listening_history_trim after insert on public.listening_history
  for each row execute function public.trim_listening_history();
