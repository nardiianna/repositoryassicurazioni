-- Seed del primo cliente reale: Gruppo Energy (broker: Assi Piacenza Broker),
-- 3 societa' con le categorie/aree mostrate nello schema fornito dal cliente.
-- Stato iniziale 'in_valutazione' per tutte le aree: i dati reali (garanzia,
-- compagnia, premio, ecc.) li inserisce Federico dal pannello admin.

do $$
declare
  v_cliente_id uuid;
  v_energy_id uuid;
  v_onsite_id uuid;
  v_incloud_id uuid;
  v_cat_id uuid;
begin
  insert into clienti (nome, broker) values ('Gruppo Energy', 'Assi Piacenza Broker')
  returning id into v_cliente_id;

  insert into societa (cliente_id, nome, ha_veicoli, ordine) values
    (v_cliente_id, 'Energy Spa', false, 0)
  returning id into v_energy_id;

  insert into societa (cliente_id, nome, ha_veicoli, ordine) values
    (v_cliente_id, 'Energyonsite Srl', true, 1)
  returning id into v_onsite_id;

  insert into societa (cliente_id, nome, ha_veicoli, ordine) values
    (v_cliente_id, 'Energyincloud Srl', false, 2)
  returning id into v_incloud_id;

  -- Energy Spa
  insert into categorie (societa_id, nome, ordine) values (v_energy_id, 'Persone e Amministratori', 0) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_energy_id, v_cat_id, 'Persone', 0),
    (v_energy_id, v_cat_id, 'Amministratori', 1);

  insert into categorie (societa_id, nome, ordine) values (v_energy_id, 'Immobili Macchinari Merce', 1) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_energy_id, v_cat_id, 'Immobili', 0),
    (v_energy_id, v_cat_id, 'Macchinari', 1),
    (v_energy_id, v_cat_id, 'Merce', 2);

  insert into categorie (societa_id, nome, ordine) values (v_energy_id, 'Attività e Prodotti', 2) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_energy_id, v_cat_id, 'Attività e Prodotti', 0);

  insert into categorie (societa_id, nome, ordine) values (v_energy_id, 'Altro', 3) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_energy_id, v_cat_id, 'Tutela Legale', 0),
    (v_energy_id, v_cat_id, 'Trasporti', 1),
    (v_energy_id, v_cat_id, 'Cyber', 2),
    (v_energy_id, v_cat_id, 'Insolvenza', 3);

  -- Energyonsite Srl (ha anche Veicoli, ha parco auto)
  insert into categorie (societa_id, nome, ordine) values (v_onsite_id, 'Persone e Amministratori', 0) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_onsite_id, v_cat_id, 'Persone', 0),
    (v_onsite_id, v_cat_id, 'Amministratori', 1);

  insert into categorie (societa_id, nome, ordine) values (v_onsite_id, 'Immobili Macchinari Merce', 1) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_onsite_id, v_cat_id, 'Immobili', 0),
    (v_onsite_id, v_cat_id, 'Macchinari', 1),
    (v_onsite_id, v_cat_id, 'Merce', 2);

  insert into categorie (societa_id, nome, ordine) values (v_onsite_id, 'Attività e Prodotti', 2) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_onsite_id, v_cat_id, 'Attività e Prodotti', 0);

  insert into categorie (societa_id, nome, ordine) values (v_onsite_id, 'Altro', 3) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_onsite_id, v_cat_id, 'Tutela Legale', 0),
    (v_onsite_id, v_cat_id, 'Trasporti', 1),
    (v_onsite_id, v_cat_id, 'Cyber', 2),
    (v_onsite_id, v_cat_id, 'Insolvenza', 3);

  insert into categorie (societa_id, nome, ordine) values (v_onsite_id, 'Veicoli', 4) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_onsite_id, v_cat_id, 'Veicoli', 0);

  -- Energyincloud Srl
  insert into categorie (societa_id, nome, ordine) values (v_incloud_id, 'Persone e Amministratori', 0) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_incloud_id, v_cat_id, 'Persone', 0),
    (v_incloud_id, v_cat_id, 'Amministratori', 1);

  insert into categorie (societa_id, nome, ordine) values (v_incloud_id, 'Immobili Macchinari Merce', 1) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_incloud_id, v_cat_id, 'Immobili', 0),
    (v_incloud_id, v_cat_id, 'Macchinari', 1),
    (v_incloud_id, v_cat_id, 'Merce', 2);

  insert into categorie (societa_id, nome, ordine) values (v_incloud_id, 'Attività e Prodotti', 2) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_incloud_id, v_cat_id, 'Attività e Prodotti', 0);

  insert into categorie (societa_id, nome, ordine) values (v_incloud_id, 'Altro', 3) returning id into v_cat_id;
  insert into aree_rischio (societa_id, categoria_id, nome_area, ordine) values
    (v_incloud_id, v_cat_id, 'Tutela Legale', 0),
    (v_incloud_id, v_cat_id, 'Trasporti', 1),
    (v_incloud_id, v_cat_id, 'Cyber', 2),
    (v_incloud_id, v_cat_id, 'Insolvenza', 3);
end $$;
