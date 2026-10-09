-- Droit à l'effacement (RGPD, art. 17) : un utilisateur connecté supprime son propre compte.
-- Toutes les tables de Soniva référencent auth.users avec « on delete cascade » : supprimer
-- l'utilisateur efface aussi ses favoris, playlists, historique, suivis et statistiques.
-- `security definer` est nécessaire pour écrire dans le schéma auth ; la fonction ne peut
-- viser que l'appelant (auth.uid()), jamais un identifiant passé en paramètre.
-- À exécuter dans l'éditeur SQL de Supabase (l'outil MCP bloque sur les `delete`).

create function public.delete_my_account() returns void
  language plpgsql security definer set search_path = '' as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Aucun utilisateur connecté.' using errcode = '42501';
  end if;
  delete from auth.users where id = current_user_id;
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
