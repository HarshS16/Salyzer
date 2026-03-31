import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Phone,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  Clock,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import axios from 'axios'

const statCards = [
  {
    label: 'Total Calls',
    icon: Phone,
    color: 'from-primary-500 to-primary-700',
    shadow: 'shadow-primary-500/20',
    key: 'totalCalls',
  },
  {
    label: 'Avg Score',
    icon: Target,
    color: 'from-accent-500 to-accent-600',
    shadow: 'shadow-accent-500/20',
    key: 'avgScore',
    suffix: '/100',
  },
  {
    label: 'Top Score',
    icon: Award,
    color: 'from-warning-400 to-warning-500',
    shadow: 'shadow-warning-500/20',
    key: 'topScore',
    suffix: '/100',
  },
  {
    label: 'This Week',
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    shadow: 'shadow-pink-500/20',
    key: 'thisWeek',
  },
]

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    avgScore: 0,
    topScore: 0,
    thisWeek: 0,
  })
  const [recentCalls, setRecentCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/calls/dashboard')
      setStats(res.data.stats)
      setRecentCalls(res.data.recentCalls || [])
    } catch (err) {
      // Use defaults on error
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-accent-400'
    if (score >= 60) return 'text-warning-400'
    return 'text-danger-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-accent-500/10'
    if (score >= 60) return 'bg-warning-500/10'
    return 'bg-danger-500/10'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-surface-400 mt-1">Overview of your sales call performance</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Call
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-900/60 backdrop-blur border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-medium text-accent-400 bg-accent-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Live
                </span>
              </div>
              <p className="text-sm text-surface-400 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '—' : stats[card.key]}
                {card.suffix && <span className="text-sm text-surface-500 font-normal">{card.suffix}</span>}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Calls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-900/60 backdrop-blur border border-surface-800 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Recent Analyses</h2>
          </div>
          <Link to="/history" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
            View all →
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-surface-600" />
            </div>
            <h3 className="text-lg font-semibold text-surface-300 mb-2">No calls analyzed yet</h3>
            <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">
              Upload your first sales call recording to get AI-powered insights and performance scoring.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Upload Your First Call
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-800">
            {recentCalls.map((call) => (
              <Link
                key={call.id}
                to={`/analysis/${call.id}`}
                className="flex items-center gap-4 p-4 sm:p-5 hover:bg-surface-800/40 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl ${getScoreBg(call.overallScore)} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-lg font-bold ${getScoreColor(call.overallScore)}`}>
                    {call.overallScore}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-200 truncate group-hover:text-white transition-colors">
                    {call.filename}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(call.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Score: {call.overallScore}/100
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
