import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function LoginForm({ title, redirectTo }: { title: string; redirectTo: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email o password non corretti.')
      return
    }
    navigate(redirectTo)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow-xl sm:p-8"
      >
        <Link to="/" className="inline-block text-sm text-gray-400 hover:text-gray-600">
          ← Indietro
        </Link>
        <h1 className="text-lg font-semibold text-center text-brand-900">{title}</h1>
        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          className="w-full rounded border border-gray-300 px-3 py-2 text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          className="w-full rounded border border-gray-300 px-3 py-2 text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-brand-900 hover:bg-brand-700 text-white py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
