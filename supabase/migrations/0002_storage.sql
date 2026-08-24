-- Bucket privato per i documenti delle polizze.
-- Percorso file: {societa_id}/{area_id}/{tipo}-{uuid}-{nomefile}

insert into storage.buckets (id, name, public)
values ('documenti-polizze', 'documenti-polizze', false)
on conflict (id) do nothing;

create policy "Admins manage documenti-polizze" on storage.objects
  for all using (bucket_id = 'documenti-polizze' and is_admin())
  with check (bucket_id = 'documenti-polizze' and is_admin());

create policy "Clienti read own documenti-polizze" on storage.objects
  for select using (
    bucket_id = 'documenti-polizze' and
    (storage.foldername(name))[1] in (select id::text from societa where cliente_id = my_cliente_id())
  );

create policy "Clienti upload own documenti-polizze" on storage.objects
  for insert with check (
    bucket_id = 'documenti-polizze' and
    (storage.foldername(name))[1] in (select id::text from societa where cliente_id = my_cliente_id())
  );

create policy "Clienti delete own uploads documenti-polizze" on storage.objects
  for delete using (
    bucket_id = 'documenti-polizze' and owner = auth.uid()
  );
