import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  LogOut,
  X,
  Zap,
  Users, // Added Users icon
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Call' },
  { to: '/history', icon: History, label: 'Call History' },
  { to: '/scripts', icon: FileText, label: 'Sales Scripts' },
  { to: '/team', icon: Users, label: 'Team Performance', managerOnly: true }, // Added Team link
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.managerOnly || user?.role === 'manager'
  )

  return (
    <div className="h-full flex flex-col bg-surface-900/80 backdrop-blur-xl border-r border-surface-800">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Salyzer
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-surface-500 font-medium">
              AI Sales Analyzer
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <X className="w-4 h-4 text-surface-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 shadow-lg shadow-primary-500/5'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px] transition-transform group-hover:scale-110" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-surface-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-800/40">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-200 truncate">{user?.name}</p>
            <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-surface-700 transition-colors text-surface-400 hover:text-danger-400"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
