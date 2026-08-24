import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { TopBar } from '../../components/TopBar'
import type { Societa } from '../../types/domain'

export function ClienteHome() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [societa, setSocieta] = useState<Societa[] | null>(null)

  useEffect(() => {
    supabase
      .from('societa')
      .select('id, cliente_id, nome, ha_veicoli, ordine')
      .order('ordine')
      .then(({ data }) => setSocieta(data ?? []))
  }, [profile?.cliente_id])

  if (societa === null) return <p className="p-8 text-sm text-gray-500">Caricamento...</p>

  if (societa.length === 1) {
    return <Navigate to={`/cliente/societa/${societa[0].id}`} replace />
  }

  return (
    <div>
      <TopBar title="Le tue società" />
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {societa.map((s) => (
          <div
            key={s.id}
            onClick={() => navigate(`/cliente/societa/${s.id}`)}
            className="rounded-lg border-2 border-brand-600 hover:bg-brand-50 transition-colors p-4 cursor-pointer font-semibold text-brand-700"
          >
            {s.nome}
          </div>
        ))}
      </div>
    </div>
  )
}
