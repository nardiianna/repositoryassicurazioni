import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminClienti } from './pages/admin/AdminClienti'
import { AdminClienteDetail } from './pages/admin/AdminClienteDetail'
import { AdminSocietaDetail } from './pages/admin/AdminSocietaDetail'
import { AdminAreaDetail } from './pages/admin/AdminAreaDetail'
import { ClienteLogin } from './pages/cliente/ClienteLogin'
import { ClienteHome } from './pages/cliente/ClienteHome'
import { ClienteDashboard } from './pages/cliente/ClienteDashboard'
import { ClienteAreaDetail } from './pages/cliente/ClienteAreaDetail'
import logo from './assets/logo-nardi-federico.png'

function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-10 px-6 bg-brand-900">
      <h1 className="text-white text-3xl sm:text-4xl font-bold text-center tracking-tight">
        Repository Assicurazioni
      </h1>
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link
          to="/admin"
          className="w-full text-center rounded-lg border-2 border-white text-white py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Area Federico
        </Link>
        <Link
          to="/cliente"
          className="w-full text-center rounded-lg border-2 border-white text-white py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Area Clienti
        </Link>
      </div>
      <img src={logo} alt="Nardi Federico" className="w-16 rounded opacity-80" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminClienti />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clienti/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminClienteDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/societa/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminSocietaDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/aree/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminAreaDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/cliente/login" element={<ClienteLogin />} />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute role="cliente">
              <ClienteHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente/societa/:id"
          element={
            <ProtectedRoute role="cliente">
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente/aree/:id"
          element={
            <ProtectedRoute role="cliente">
              <ClienteAreaDetail />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
