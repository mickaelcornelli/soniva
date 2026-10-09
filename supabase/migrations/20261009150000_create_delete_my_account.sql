-- Right to erasure (GDPR art. 17): a signed-in user deletes their own account.
-- Every table references auth.users with `on delete cascade`, so this also removes
-- favourites, playlists, history, follows and stats.
-- `security definer` is required to write to the auth schema; the function only ever
-- targets the caller (auth.uid()), never an ID passed as a parameter.

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
