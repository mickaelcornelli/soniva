-- Artistes suivis. Comme pour les favoris, seul l'identifiant de l'artiste chez le
-- provider est stocké : nom et avatar restent chez Audius.

create table public.followed_artists (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  artist_id text not null check (char_length(artist_id) between 1 and 64),
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

create index followed_artists_user_created_idx
  on public.followed_artists (user_id, created_at desc);

alter table public.followed_artists enable row level security;

create policy "Artistes suivis : lecture des siens" on public.followed_artists
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Artistes suivis : ajout des siens" on public.followed_artists
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Artistes suivis : retrait des siens" on public.followed_artists
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Plan gratuit : un plafond par utilisateur borne la taille de la table.
create function public.limit_followed_artists() returns trigger
  language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.followed_artists where user_id = new.user_id) >= 500 then
    raise exception 'Limite de 500 artistes suivis atteinte.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger followed_artists_limit before insert on public.followed_artists
  for each row execute function public.limit_followed_artists();
