import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { TopBar } from '../../components/TopBar'
import { StatoBadge } from '../../components/StatoBadge'
import { DocumentManager } from '../../components/DocumentManager'
import type { AreaRischio } from '../../types/domain'

function Campo({ label, valore }: { label: string; valore: string | number | null }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{valore ?? '—'}</div>
    </div>
  )
}

export function ClienteAreaDetail() {
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()
  const [area, setArea] = useState<AreaRischio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('aree_rischio')
      .select(
        'id, societa_id, categoria_id, nome_area, stato, garanzia, prodotto, compagnia, numero_polizza, scadenza, premio, massimali, franchigie, ordine',
      )
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setArea(data ?? null)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="p-8 text-sm text-gray-500">Caricamento...</p>
  if (!area || !session) return <p className="p-8 text-sm text-gray-500">Area non trovata.</p>

  return (
    <div>
      <TopBar title={area.nome_area} />
      <div className="p-6 space-y-6 max-w-2xl">
        <StatoBadge stato={area.stato} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Garanzia" valore={area.garanzia} />
          <Campo label="Prodotto" valore={area.prodotto} />
          <Campo label="Compagnia" valore={area.compagnia} />
          <Campo label="N. Polizza" valore={area.numero_polizza} />
          <Campo label="Scadenza" valore={area.scadenza} />
          <Campo label="Premio" valore={area.premio !== null ? `€ ${area.premio}` : null} />
          <Campo label="Massimali" valore={area.massimali} />
          <Campo label="Franchigie" valore={area.franchigie} />
        </div>

        <DocumentManager
          societaId={area.societa_id}
          areaId={area.id}
          userId={session.user.id}
          isAdmin={false}
        />
      </div>
    </div>
  )
}
