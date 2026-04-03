import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  History,
  Target,
  Clock,
  ArrowUpRight,
  Search,
  Loader2,
  FileAudio,
  Trash2,
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function CallHistory() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async () => {
    try {
      const res = await axios.get('/api/calls')
      setCalls(res.data)
    } catch (err) {
      toast.error('Failed to load call history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this call analysis?')) return
    try {
      await axios.delete(`/api/calls/${id}`)
      setCalls(calls.filter((c) => c.id !== id))
      toast.success('Call deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filteredCalls = calls.filter((c) =>
    c.filename.toLowerCase().includes(search.toLowerCase())
  )

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-accent-400'
    if (score >= 60) return 'text-warning-400'
    return 'text-danger-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-accent-500/10 border-accent-500/20'
    if (score >= 60) return 'bg-warning-500/10 border-warning-500/20'
    return 'bg-danger-500/10 border-danger-500/20'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dashboard-text-main tracking-tight">Call History</h1>
          <p className="text-dashboard-text-sub font-medium mt-1">All your analyzed sales calls</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            id="search-calls"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search calls..."
            className="pl-10 pr-4 py-3 bg-white border border-dashboard-border rounded-2xl text-sm text-dashboard-text-main placeholder:text-dashboard-text-sub focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 focus:border-dashboard-primary/20 shadow-sm transition-all w-full sm:w-80 font-medium"
          />
        </div>
      </div>

      {/* Calls list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
        </div>
      ) : filteredCalls.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7 text-surface-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-300 mb-2">
            {search ? 'No matching calls' : 'No calls yet'}
          </h3>
          <p className="text-surface-500 text-sm mb-6">
            {search ? 'Try a different search term' : 'Upload your first call to get started'}
          </p>
          {!search && (
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors text-sm"
            >
              Upload Call
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredCalls.map((call, i) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/analysis/${call.id}`}
                className="flex items-center gap-4 p-5 bg-white border border-dashboard-border rounded-[24px] hover:border-dashboard-primary/20 hover:bg-dashboard-primary-light/30 shadow-sm transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-xl border ${getScoreBg(call.overallScore)} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xl font-bold ${getScoreColor(call.overallScore)}`}>
                    {call.overallScore}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileAudio className="w-3.5 h-3.5 text-surface-500" />
                    <p className="text-base font-bold text-dashboard-text-main group-hover:text-dashboard-primary transition-colors">
                      {call.filename}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-surface-500">
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(call.id, e)}
                    className="p-2 rounded-lg hover:bg-danger-500/10 transition-colors text-surface-600 hover:text-danger-400 opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowUpRight className="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
