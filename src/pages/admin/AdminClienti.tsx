import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { TopBar } from '../../components/TopBar'
import type { Cliente } from '../../types/domain'

export function AdminClienti() {
  const navigate = useNavigate()
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const [clientiRes, societaRes] = await Promise.all([
      supabase.from('clienti').select('id, nome, broker').order('nome'),
      supabase.from('societa').select('cliente_id'),
    ])
    setClienti(clientiRes.data ?? [])
    const c: Record<string, number> = {}
    for (const row of societaRes.data ?? []) {
      c[row.cliente_id] = (c[row.cliente_id] ?? 0) + 1
    }
    setCounts(c)
    setLoading(false)
  }

  async function handleNuovoCliente() {
    const nome = window.prompt('Nome del cliente (es. "Gruppo Energy"):')
    if (!nome || !nome.trim()) return
    const broker = window.prompt('Broker (opzionale):') || null
    setCreating(true)
    setError(null)
    const { data, error } = await supabase
      .from('clienti')
      .insert({ nome: nome.trim(), broker })
      .select('id, nome, broker')
      .single()
    setCreating(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data) setClienti((rows) => [...rows, data].sort((a, b) => a.nome.localeCompare(b.nome)))
  }

  return (
    <div>
      <TopBar title="Repository Assicurazioni — Admin" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Clienti</h2>
          <button
            onClick={handleNuovoCliente}
            disabled={creating}
            className="text-sm text-brand-700 hover:underline disabled:opacity-50"
          >
            {creating ? 'Creazione...' : '+ Nuovo cliente'}
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-gray-500">Caricamento...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {clienti.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/clienti/${c.id}`)}
                className="rounded-lg border-2 border-brand-600 hover:bg-brand-50 transition-colors p-4 cursor-pointer"
              >
                <div className="font-semibold text-brand-700">{c.nome}</div>
                {c.broker && <div className="text-xs text-gray-500">{c.broker}</div>}
                <div className="text-xs text-gray-500 mt-1">
                  {counts[c.id] ?? 0} società
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
