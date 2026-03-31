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
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Sales Scripts</h1>
          <p className="text-surface-400 mt-1">
            Top-performing scripts used for RAG comparisons
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 text-sm"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAdd ? 'Cancel' : 'Add Script'}
        </button>
      </div>

      {/* Add Script Form */}
      {showAdd && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="bg-surface-900/60 backdrop-blur border border-surface-800 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Script Title</label>
            <input
              id="script-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-surface-100 placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
              placeholder="e.g., SaaS Cold Call Script"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-2">Script Content</label>
            <textarea
              id="script-content"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-surface-100 placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none"
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
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
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
              className="bg-surface-900/60 border border-surface-800 rounded-2xl p-5 hover:border-surface-700 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-200">{script.title}</h3>
                    <p className="text-xs text-surface-500">
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
              <p className="text-sm text-surface-400 leading-relaxed line-clamp-3">
                {script.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
