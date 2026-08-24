import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { TopBar } from '../../components/TopBar'
import type { Cliente, Societa } from '../../types/domain'

export function AdminClienteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [societa, setSocieta] = useState<Societa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkingUid, setLinkingUid] = useState('')
  const [linking, setLinking] = useState(false)

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    if (!id) return
    const [clienteRes, societaRes] = await Promise.all([
      supabase.from('clienti').select('id, nome, broker').eq('id', id).single(),
      supabase.from('societa').select('id, cliente_id, nome, ha_veicoli, ordine').eq('cliente_id', id).order('ordine'),
    ])
    setCliente(clienteRes.data ?? null)
    setSocieta(societaRes.data ?? [])
    setLoading(false)
  }

  async function handleNuovaSocieta() {
    if (!id) return
    const nome = window.prompt('Nome della nuova società:')
    if (!nome || !nome.trim()) return
    const { data, error } = await supabase
      .from('societa')
      .insert({ cliente_id: id, nome: nome.trim(), ordine: societa.length })
      .select('id, cliente_id, nome, ha_veicoli, ordine')
      .single()
    if (error) {
      setError(error.message)
      return
    }
    if (data) setSocieta((rows) => [...rows, data])
  }

  async function toggleVeicoli(s: Societa) {
    const { error } = await supabase
      .from('societa')
      .update({ ha_veicoli: !s.ha_veicoli })
      .eq('id', s.id)
    if (error) {
      setError(error.message)
      return
    }
    setSocieta((rows) => rows.map((r) => (r.id === s.id ? { ...r, ha_veicoli: !r.ha_veicoli } : r)))
  }

  async function handleCollegaLogin() {
    if (!id || !linkingUid.trim()) return
    setLinking(true)
    setError(null)
    const { error } = await supabase
      .from('profiles')
      .insert({ id: linkingUid.trim(), role: 'cliente', cliente_id: id })
    setLinking(false)
    if (error) {
      setError(error.message)
      return
    }
    setLinkingUid('')
  }

  if (loading) return <p className="p-8 text-sm text-gray-500">Caricamento...</p>
  if (!cliente) return <p className="p-8 text-sm text-gray-500">Cliente non trovato.</p>

  return (
    <div className="min-h-screen w-full bg-white">
      <TopBar title={cliente.nome} />
      <div className="p-4 sm:p-6 space-y-8 max-w-3xl">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Società</h2>
            <button onClick={handleNuovaSocieta} className="text-sm text-brand-700 hover:underline">
              + Nuova società
            </button>
          </div>
          <div className="space-y-2">
            {societa.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-200 p-3"
              >
                <button
                  onClick={() => navigate(`/admin/societa/${s.id}`)}
                  className="font-medium text-brand-700 hover:underline"
                >
                  {s.nome}
                </button>
                <label className="flex items-center gap-2 text-xs text-gray-500">
                  <input type="checkbox" checked={s.ha_veicoli} onChange={() => toggleVeicoli(s)} />
                  Ha veicoli
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Accesso cliente</h2>
          <p className="text-sm text-gray-500">
            Crea l'utente dalla Dashboard Supabase (Authentication → Add user), poi incolla qui il suo UID
            per collegarlo a questo cliente.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={linkingUid}
              onChange={(e) => setLinkingUid(e.target.value)}
              placeholder="UID utente Supabase"
              className="flex-1 min-w-0 rounded border border-gray-300 px-3 py-2 text-base"
            />
            <button
              onClick={handleCollegaLogin}
              disabled={linking || !linkingUid.trim()}
              className="shrink-0 rounded bg-brand-900 hover:bg-brand-700 text-white px-4 py-2 text-sm disabled:opacity-50"
            >
              {linking ? 'Collegamento...' : 'Collega'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
