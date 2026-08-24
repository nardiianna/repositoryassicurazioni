import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function TopBar({ title }: { title: string }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="flex w-full items-center justify-between gap-3 bg-brand-900 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Torna indietro"
          className="shrink-0 p-1 -m-1 text-brand-200 hover:text-white text-lg leading-none"
        >
          ←
        </button>
        <h1 className="truncate text-base font-semibold text-white">{title}</h1>
      </div>
      <button onClick={handleLogout} className="shrink-0 p-1 -m-1 text-sm text-brand-200 hover:text-white">
        Esci
      </button>
    </header>
  )
}
