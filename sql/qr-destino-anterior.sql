-- Migration: audire_qr_destino_anterior. One previous destination per QR.
alter table public.audire_qr_codes
  add column if not exists destino_anterior_url text,
  add column if not exists destino_anterior_salvo_em timestamptz;

create or replace function public.audire_guardar_destino_anterior()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.destino_url is distinct from old.destino_url
     and nullif(btrim(old.destino_url), '') is not null then
    new.destino_anterior_url := old.destino_url;
    new.destino_anterior_salvo_em := now();
  else
    new.destino_anterior_url := old.destino_anterior_url;
    new.destino_anterior_salvo_em := old.destino_anterior_salvo_em;
  end if;
  return new;
end;
$$;
revoke all on function public.audire_guardar_destino_anterior() from public, anon, authenticated;
create trigger audire_qr_guardar_destino_anterior
before update on public.audire_qr_codes
for each row execute function public.audire_guardar_destino_anterior();
