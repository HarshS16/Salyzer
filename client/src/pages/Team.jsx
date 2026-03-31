import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Search, 
  User as UserIcon, 
  BarChart2, 
  ChevronRight,
  Loader2,
  ShieldCheck,
  Phone
} from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function Team() {
  const { user } = useAuth()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user?.role === 'manager') {
      fetchTeam()
    }
  }, [user])

  const fetchTeam = async () => {
    try {
      const res = await axios.get('/api/team')
      setAgents(res.data)
    } catch (err) {
      toast.error('Failed to load team data')
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== 'manager') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-danger-500/10 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-danger-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-surface-400 max-w-sm">
          The team management page is only available for accounts with the <b>Manager</b> role.
        </p>
      </div>
    )
  }

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Team Performance</h1>
          <p className="text-surface-400 mt-1">Monitor and coach your sales agents</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents..."
            className="pl-10 pr-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-surface-200 placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="bg-surface-900/60 border border-surface-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7 text-surface-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-300">No agents found</h3>
          <p className="text-surface-500 text-sm mt-1">Your team doesn't have any agents registered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-900/60 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 hover:bg-surface-800/40 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-lg font-bold text-white">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-surface-100">{agent.name}</h3>
                    <p className="text-xs text-surface-500">{agent.email}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  agent.avgScore >= 80 ? 'bg-accent-500/10 text-accent-400' : 
                  agent.avgScore >= 60 ? 'bg-warning-500/10 text-warning-400' : 'bg-danger-500/10 text-danger-400'
                }`}>
                  Avg: {agent.avgScore || 0}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-xs text-surface-500 uppercase tracking-tighter font-medium">Total Calls</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-primary-400" />
                    <span className="text-lg font-bold text-white">{agent.callCount || 0}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-surface-500 uppercase tracking-tighter font-medium">Last Call</p>
                  <p className="text-sm font-medium text-surface-300">
                    {agent.lastCall ? new Date(agent.lastCall).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              <Link
                to={`/history?agentId=${agent.id}`}
                className="w-full py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-200 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                View Call History
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
