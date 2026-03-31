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
import Team from './pages/Team' // Added Team import

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="analysis/:id" element={<Analysis />} />
        <Route path="history" element={<CallHistory />} />
        <Route path="scripts" element={<Scripts />} />
        <Route path="team" element={<Team />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
