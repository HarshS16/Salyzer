import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Shield, 
  Briefcase,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attributes, setAttributes] = useState([]) // Array of { key: '', value: '' }

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/users/profile')
      setName(res.data.name)
      setEmail(res.data.email)
      
      const profileData = res.data.profile || {}
      const attrArray = Object.entries(profileData).map(([key, value]) => ({ key, value }))
      setAttributes(attrArray)
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const handleRemoveField = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  const handleUpdateField = (index, field, value) => {
    const newAttrs = [...attributes]
    newAttrs[index][field] = value
    setAttributes(newAttrs)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Convert attributes back to object
    const profile = {}
    attributes.forEach(attr => {
      if (attr.key.trim()) {
        profile[attr.key.trim()] = attr.value
      }
    })

    try {
      await axios.put('/api/users/profile', { name, profile })
      toast.success('Profile updated!')
      // Refresh local auth state if name changed
      if (user) {
        // We might need a small hack to update the name in AuthContext if it's not refreshing
        // but let's assume the user will refresh or the context tracks it.
      }
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-dashboard-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-dashboard-text-main tracking-tight">Your Profile</h1>
          <p className="text-dashboard-text-sub font-medium mt-1">Manage your identity and professional attributes</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-dashboard-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-white">
          {name ? name[0].toUpperCase() : 'U'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Identity */}
        <section className="bg-white border border-dashboard-border rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-dashboard-primary-light flex items-center justify-center text-dashboard-primary">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-dashboard-text-main">Account Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-dashboard-text-main ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-text-sub" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dashboard-bg border border-dashboard-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-dashboard-text-main ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-text-sub" />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-50 border border-dashboard-border rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Attributes */}
        <section className="bg-white border border-dashboard-border rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-dashboard-text-main">Professional Attributes</h2>
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="flex items-center gap-2 px-4 py-2 bg-dashboard-primary-light text-dashboard-primary font-bold rounded-xl hover:bg-dashboard-primary/10 transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Attribute
            </button>
          </div>

          <p className="text-sm font-medium text-dashboard-text-sub mb-8">
            Add custom fields like Designation, Department, Sales Target, or Location to enrich your AI profile.
          </p>

          <div className="space-y-4">
            {attributes.length === 0 ? (
              <div className="text-center py-12 bg-dashboard-bg border-2 border-dashed border-dashboard-border rounded-2xl">
                <p className="text-sm font-medium text-dashboard-text-sub">No custom attributes added yet.</p>
              </div>
            ) : (
              attributes.map((attr, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col sm:flex-row gap-3 items-start sm:items-center group"
                >
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => handleUpdateField(index, 'key', e.target.value)}
                    className="flex-1 w-full bg-dashboard-bg border border-dashboard-border rounded-xl py-3 px-4 text-sm font-bold text-dashboard-text-main placeholder:text-dashboard-text-sub/50 focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 transition-all"
                    placeholder="Attribute (e.g. Role)"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleUpdateField(index, 'value', e.target.value)}
                    className="flex-[2] w-full bg-white border border-dashboard-border rounded-xl py-3 px-4 text-sm font-medium text-dashboard-text-main focus:outline-none focus:ring-4 focus:ring-dashboard-primary/5 transition-all shadow-sm"
                    placeholder="Value (e.g. Senior Account Executive)"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-8 py-3.5 text-sm font-bold text-dashboard-text-sub hover:text-dashboard-text-main transition-all"
          >
            Reset
          </button>
          <button
            id="save-profile"
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-10 py-3.5 bg-dashboard-primary hover:bg-[#0042cc] text-white font-bold rounded-2xl shadow-lg shadow-dashboard-primary/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
