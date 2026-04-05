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
import Landing from './pages/Landing'
import PrivacyPolicy from './pages/PrivacyPolicy' // Added PrivacyPolicy
import TermsOfService from './pages/TermsOfService' // Added TermsOfService
import Support from './pages/Support' 
import Profile from './pages/Profile' 

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" /> : children
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/support" element={<Support />} />
      
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
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Redirect all other to Home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
