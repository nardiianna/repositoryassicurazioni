import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo-nardi-federico.png'

export function TopBar({ title }: { title: string }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between bg-brand-900 px-6 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Torna indietro"
          className="text-brand-200 hover:text-white text-lg leading-none"
        >
          ←
        </button>
        <img src={logo} alt="" className="w-7 h-7 rounded" />
        <h1 className="text-base font-semibold text-white">{title}</h1>
      </div>
      <button onClick={handleLogout} className="text-sm text-brand-200 hover:text-white">
        Esci
      </button>
    </header>
  )
}
