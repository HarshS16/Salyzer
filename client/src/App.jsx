import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analysis from './pages/Analysis'
import CallHistory from './pages/CallHistory'
import Scripts from './pages/Scripts'
import Team from './pages/Team'
import Landing from './pages/Landing' // Added Landing import

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analysis/:id" element={<Analysis />} />
        <Route path="/history" element={<CallHistory />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/team" element={<Team />} />
      </Route>

      {/* Redirect all other to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
