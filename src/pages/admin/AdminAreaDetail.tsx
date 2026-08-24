import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { TopBar } from '../../components/TopBar'
import { DocumentManager } from '../../components/DocumentManager'
import type { AreaRischio, StatoCopertura } from '../../types/domain'

const STATI: { value: StatoCopertura; label: string }[] = [
  { value: 'copertura_attiva', label: 'Copertura attiva' },
  { value: 'copertura_assente', label: 'Copertura assente' },
  { value: 'in_valutazione', label: 'In valutazione' },
]

export function AdminAreaDetail() {
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
  const [area, setArea] = useState<AreaRischio | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    if (!id) return
    const { data } = await supabase
      .from('aree_rischio')
      .select(
        'id, societa_id, categoria_id, nome_area, stato, garanzia, prodotto, compagnia, numero_polizza, scadenza, premio, massimali, franchigie, ordine',
      )
      .eq('id', id)
      .single()
    setArea(data ?? null)
    setLoading(false)
  }

  function updateField<K extends keyof AreaRischio>(field: K, value: AreaRischio[K]) {
    setArea((a) => (a ? { ...a, [field]: value } : a))
  }

  async function handleSave() {
    if (!area) return
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('aree_rischio')
      .update({
        stato: area.stato,
        garanzia: area.garanzia,
        prodotto: area.prodotto,
        compagnia: area.compagnia,
        numero_polizza: area.numero_polizza,
        scadenza: area.scadenza,
        premio: area.premio,
        massimali: area.massimali,
        franchigie: area.franchigie,
      })
      .eq('id', area.id)
    setSaving(false)
    if (error) setError(error.message)
  }

  if (loading) return <p className="p-8 text-sm text-gray-500">Caricamento...</p>
  if (!area || !session) return <p className="p-8 text-sm text-gray-500">Area non trovata.</p>

  return (
    <div>
      <TopBar title={area.nome_area} />
      <div className="p-6 space-y-6 max-w-2xl">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Stato</span>
            <select
              value={area.stato}
              onChange={(e) => updateField('stato', e.target.value as StatoCopertura)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            >
              {STATI.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Garanzia</span>
            <input
              value={area.garanzia ?? ''}
              onChange={(e) => updateField('garanzia', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Prodotto</span>
            <input
              value={area.prodotto ?? ''}
              onChange={(e) => updateField('prodotto', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Compagnia</span>
            <input
              value={area.compagnia ?? ''}
              onChange={(e) => updateField('compagnia', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">N. Polizza</span>
            <input
              value={area.numero_polizza ?? ''}
              onChange={(e) => updateField('numero_polizza', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Scadenza</span>
            <input
              type="date"
              value={area.scadenza ?? ''}
              onChange={(e) => updateField('scadenza', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Premio (€)</span>
            <input
              type="number"
              step="0.01"
              value={area.premio ?? ''}
              onChange={(e) => updateField('premio', e.target.value === '' ? null : Number(e.target.value))}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="text-gray-600">Massimali</span>
            <input
              value={area.massimali ?? ''}
              onChange={(e) => updateField('massimali', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="text-sm space-y-1 sm:col-span-2">
            <span className="text-gray-600">Franchigie</span>
            <input
              value={area.franchigie ?? ''}
              onChange={(e) => updateField('franchigie', e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-brand-900 hover:bg-brand-700 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {saving ? 'Salvataggio...' : 'Salva'}
        </button>

        <DocumentManager
          societaId={area.societa_id}
          areaId={area.id}
          userId={session.user.id}
          isAdmin
        />
      </div>
    </div>
  )
}
