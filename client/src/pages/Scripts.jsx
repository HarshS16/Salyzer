import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  BookOpen,
  CheckCircle2,
  X,
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Scripts() {
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      const res = await axios.get('/api/scripts')
      setScripts(res.data)
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) return
    setSubmitting(true)
    try {
      const res = await axios.post('/api/scripts', {
        title: newTitle,
        content: newContent,
      })
      setScripts([res.data, ...scripts])
      setNewTitle('')
      setNewContent('')
      setShowAdd(false)
      toast.success('Script added to vector database!')
    } catch (err) {
      toast.error('Failed to add script')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this script?')) return
    try {
      await axios.delete(`/api/scripts/${id}`)
      setScripts(scripts.filter((s) => s.id !== id))
      toast.success('Script removed')
    } catch {
      toast.error('Failed to remove script')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dashboard-text-main tracking-tight">Sales Scripts</h1>
          <p className="text-dashboard-text-sub font-medium mt-1">
            Top-performing scripts used for RAG comparisons
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-dashboard-primary hover:bg-[#0042cc] text-white font-bold rounded-xl shadow-lg shadow-dashboard-primary/20 transition-all duration-300"
        >
          {showAdd ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAdd ? 'Cancel' : 'Add Script'}
        </button>
      </div>

      {/* Add Script Form */}
      {showAdd && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="bg-white border border-dashboard-border rounded-[32px] p-8 space-y-6 shadow-sm"
        >
          <div>
            <label className="block text-sm font-bold text-dashboard-text-main mb-2 ml-1">Script Title</label>
            <input
              id="script-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-5 py-3.5 bg-dashboard-bg border border-dashboard-border rounded-2xl text-dashboard-text-main placeholder:text-dashboard-text-sub focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 focus:border-dashboard-primary/20 transition-all font-medium"
              placeholder="e.g., SaaS Cold Call Script"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-dashboard-text-main mb-2 ml-1">Script Content</label>
            <textarea
              id="script-content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={8}
              className="w-full px-5 py-4 bg-dashboard-bg border border-dashboard-border rounded-2xl text-dashboard-text-main placeholder:text-dashboard-text-sub focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 focus:border-dashboard-primary/20 transition-all resize-none font-medium"
              placeholder="Paste your top-performing sales script here..."
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-sm text-surface-400 hover:text-surface-200 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-script"
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-dashboard-primary hover:bg-[#0042cc] text-white font-bold rounded-xl shadow-lg shadow-dashboard-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Save Script
            </button>
          </div>
        </motion.form>
      )}

      {/* Scripts list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-7 h-7 text-primary-400 animate-spin" />
        </div>
      ) : scripts.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-surface-600" />
          </div>
          <h3 className="text-lg font-semibold text-surface-300 mb-2">No scripts added yet</h3>
          <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">
            Add top-performing sales scripts to enable AI-powered comparison and recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((script, i) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-dashboard-border rounded-[32px] p-6 hover:border-dashboard-primary/20 hover:bg-dashboard-primary-light/10 transition-all duration-300 group shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dashboard-primary-light flex items-center justify-center text-dashboard-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-dashboard-text-main leading-tight">{script.title}</h3>
                    <p className="text-xs font-bold text-dashboard-text-sub mt-1">
                      Added {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(script.id)}
                  className="p-2 rounded-lg hover:bg-danger-500/10 transition-colors text-surface-600 hover:text-danger-400 opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-dashboard-text-sub font-medium leading-relaxed line-clamp-3">
                {script.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
