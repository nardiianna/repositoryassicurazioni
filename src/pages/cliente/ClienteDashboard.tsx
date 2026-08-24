import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { TopBar } from '../../components/TopBar'
import { StatoBadge } from '../../components/StatoBadge'
import type { AreaRischio, Categoria, Societa } from '../../types/domain'

export function ClienteDashboard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [societa, setSocieta] = useState<Societa | null>(null)
  const [categorie, setCategorie] = useState<Categoria[]>([])
  const [aree, setAree] = useState<AreaRischio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    if (!id) return
    const [societaRes, categorieRes, areeRes] = await Promise.all([
      supabase.from('societa').select('id, cliente_id, nome, ha_veicoli, ordine').eq('id', id).single(),
      supabase.from('categorie').select('id, societa_id, nome, ordine').eq('societa_id', id).order('ordine'),
      supabase
        .from('aree_rischio')
        .select(
          'id, societa_id, categoria_id, nome_area, stato, garanzia, prodotto, compagnia, numero_polizza, scadenza, premio, massimali, franchigie, ordine',
        )
        .eq('societa_id', id)
        .order('ordine'),
    ])
    setSocieta(societaRes.data ?? null)
    setCategorie(categorieRes.data ?? [])
    setAree(areeRes.data ?? [])
    setLoading(false)
  }

  if (loading) return <p className="p-8 text-sm text-gray-500">Caricamento...</p>
  if (!societa) return <p className="p-8 text-sm text-gray-500">Società non trovata.</p>

  return (
    <div>
      <TopBar title={societa.nome} />
      <div className="p-4 sm:p-6 space-y-8 max-w-4xl">
        {categorie.map((cat) => (
          <section key={cat.id} className="space-y-2">
            <h3 className="font-semibold text-brand-800">{cat.nome}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aree
                .filter((a) => a.categoria_id === cat.id)
                .map((a) => (
                  <div
                    key={a.id}
                    onClick={() => navigate(`/cliente/aree/${a.id}`)}
                    className="rounded border border-gray-200 p-3 cursor-pointer hover:bg-brand-50 flex items-center justify-between"
                  >
                    <span className="font-medium">{a.nome_area}</span>
                    <StatoBadge stato={a.stato} />
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
