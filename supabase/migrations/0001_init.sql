-- Repository Assicurazioni: core schema
-- Roles: admin (Anna e Federico, accesso completo), cliente (vede solo i propri dati)
-- Un cliente puo' avere piu' societa'. Ogni societa' ha categorie (raggruppamento
-- visivo configurabile) e aree di rischio (= la polizza corrente per quell'area).

create table if not exists clienti (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  broker text,
  created_at timestamptz not null default now()
);

create table if not exists societa (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clienti (id) on delete cascade,
  nome text not null,
  ha_veicoli boolean not null default false,
  ordine int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists societa_cliente_id_idx on societa (cliente_id);

-- One row per authenticated user (admin o cliente), linked to auth.users
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'cliente')),
  cliente_id uuid references clienti (id),
  created_at timestamptz not null default now(),
  constraint cliente_must_have_cliente check (
    (role = 'cliente' and cliente_id is not null) or
    (role = 'admin' and cliente_id is null)
  )
);

create table if not exists categorie (
  id uuid primary key default gen_random_uuid(),
  societa_id uuid not null references societa (id) on delete cascade,
  nome text not null,
  ordine int not null default 0
);

create index if not exists categorie_societa_id_idx on categorie (societa_id);

create table if not exists aree_rischio (
  id uuid primary key default gen_random_uuid(),
  societa_id uuid not null references societa (id) on delete cascade,
  categoria_id uuid references categorie (id) on delete set null,
  nome_area text not null,

  stato text not null default 'in_valutazione'
    check (stato in ('copertura_attiva', 'copertura_assente', 'in_valutazione')),

  garanzia text,
  prodotto text,
  compagnia text,
  numero_polizza text,
  scadenza date,
  premio numeric,
  massimali text,
  franchigie text,

  ordine int not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists aree_rischio_societa_id_idx on aree_rischio (societa_id);
create index if not exists aree_rischio_categoria_id_idx on aree_rischio (categoria_id);

create table if not exists documenti (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references aree_rischio (id) on delete cascade,
  tipo text not null check (tipo in ('polizza', 'dip', 'dip_aggiuntivo', 'condizioni', 'glossario', 'altro')),
  nome_file text not null,
  storage_path text not null,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists documenti_area_id_idx on documenti (area_id);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists aree_rischio_set_updated_at on aree_rischio;
create trigger aree_rischio_set_updated_at
  before update on aree_rischio
  for each row execute function set_updated_at();

alter table clienti enable row level security;
alter table societa enable row level security;
alter table profiles enable row level security;
alter table categorie enable row level security;
alter table aree_rischio enable row level security;
alter table documenti enable row level security;

-- SECURITY DEFINER: interrogare profiles dentro una policy su profiles stesso
-- causa ricorsione infinita se non passa da una funzione SECURITY DEFINER
-- (vedi il progetto gemello Enea, che ha dovuto correggere questo esatto bug).
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function my_cliente_id()
returns uuid language sql stable security definer set search_path = public as $$
  select cliente_id from profiles where id = auth.uid() and role = 'cliente';
$$;

create policy clienti_admin_all on clienti
  for all using (is_admin()) with check (is_admin());
create policy clienti_self_select on clienti
  for select using (id = my_cliente_id());

create policy societa_admin_all on societa
  for all using (is_admin()) with check (is_admin());
create policy societa_self_select on societa
  for select using (cliente_id = my_cliente_id());

create policy profiles_self_select on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_admin_write on profiles
  for all using (is_admin()) with check (is_admin());

create policy categorie_admin_all on categorie
  for all using (is_admin()) with check (is_admin());
create policy categorie_self_select on categorie
  for select using (
    exists (select 1 from societa s where s.id = categorie.societa_id and s.cliente_id = my_cliente_id())
  );

create policy aree_admin_all on aree_rischio
  for all using (is_admin()) with check (is_admin());
create policy aree_self_select on aree_rischio
  for select using (
    exists (select 1 from societa s where s.id = aree_rischio.societa_id and s.cliente_id = my_cliente_id())
  );

create policy documenti_admin_all on documenti
  for all using (is_admin()) with check (is_admin());
create policy documenti_self_select on documenti
  for select using (
    exists (
      select 1 from aree_rischio a join societa s on s.id = a.societa_id
      where a.id = documenti.area_id and s.cliente_id = my_cliente_id()
    )
  );
create policy documenti_self_insert on documenti
  for insert with check (
    exists (
      select 1 from aree_rischio a join societa s on s.id = a.societa_id
      where a.id = documenti.area_id and s.cliente_id = my_cliente_id()
    )
  );
create policy documenti_self_delete_own on documenti
  for delete using (uploaded_by = auth.uid());
