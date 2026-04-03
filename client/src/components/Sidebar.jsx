import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Upload,
  History,
  FileText,
  Users,
  Plus,
  Zap,
  LogOut,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Call' },
  { to: '/history', icon: History, label: 'Call History' },
  { to: '/scripts', icon: FileText, label: 'Sales Scripts' },
  { to: '/team', icon: Users, label: 'Team Performance', managerOnly: true },
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
    <div className="h-full flex flex-col bg-white border-r border-dashboard-border relative">
      {/* Logo */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-dashboard-primary flex items-center justify-center shadow-lg shadow-dashboard-primary/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-dashboard-primary tracking-tight leading-none">
              Salyzer AI
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] font-bold mt-1">
              The Intelligence Layer
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-0 space-y-1">
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-8 py-4 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'text-dashboard-primary'
                  : 'text-[#94a3b8] hover:text-[#475569]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-dashboard-primary rounded-r-full shadow-[2px_0_10px_rgba(0,82,255,0.3)]" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-dashboard-primary' : 'text-[#cbd5e1] group-hover:text-[#94a3b8]'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-3">
        {/* New Analysis Button */}
        <button
          onClick={() => navigate('/upload')}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-dashboard-primary hover:bg-[#0042cc] text-white font-bold rounded-2xl shadow-xl shadow-dashboard-primary/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 group mb-2"
        >
          <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm">New Analysis</span>
        </button>

        {/* User Card */}
        <div className="p-3 bg-dashboard-bg border border-dashboard-border rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-dashboard-primary-light flex items-center justify-center text-sm font-black text-dashboard-primary">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-dashboard-text-main truncate">{user?.name}</p>
            <p className="text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-dashboard-text-sub hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
