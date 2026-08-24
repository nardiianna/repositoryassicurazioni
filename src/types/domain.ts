export interface Cliente {
  id: string
  nome: string
  broker: string | null
}

export interface Societa {
  id: string
  cliente_id: string
  nome: string
  ha_veicoli: boolean
  ordine: number
}

export interface Categoria {
  id: string
  societa_id: string
  nome: string
  ordine: number
}

export type StatoCopertura = 'copertura_attiva' | 'copertura_assente' | 'in_valutazione'

export interface AreaRischio {
  id: string
  societa_id: string
  categoria_id: string | null
  nome_area: string
  stato: StatoCopertura
  garanzia: string | null
  prodotto: string | null
  compagnia: string | null
  numero_polizza: string | null
  scadenza: string | null
  premio: number | null
  massimali: string | null
  franchigie: string | null
  ordine: number
}

export type TipoDocumento = 'polizza' | 'dip' | 'dip_aggiuntivo' | 'condizioni' | 'glossario' | 'altro'

export interface Documento {
  id: string
  area_id: string
  tipo: TipoDocumento
  nome_file: string
  storage_path: string
  uploaded_by: string | null
  created_at: string
}
