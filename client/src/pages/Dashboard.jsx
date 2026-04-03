import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Phone,
  BarChart2,
  AlertTriangle,
  Download,
  Zap,
  MoreVertical,
  Filter,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const chartData = [
  { name: 'MON', performance: 40, sentiment: 30 },
  { name: 'TUE', performance: 35, sentiment: 45 },
  { name: 'WED', performance: 55, sentiment: 40 },
  { name: 'THU', performance: 45, sentiment: 60 },
  { name: 'FRI', performance: 70, sentiment: 50 },
  { name: 'SAT', performance: 40, sentiment: 35 },
  { name: 'SUN', performance: 75, sentiment: 55 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCalls: "1,482",
    avgScore: 84,
    unanswered: 18,
  })
  const [recentCalls, setRecentCalls] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('/api/calls/dashboard')
      if (res.data.stats) {
        setStats({
          totalCalls: res.data.stats.totalCalls?.toLocaleString() || "1,482",
          avgScore: res.data.stats.avgScore || 84,
          unanswered: 18, // Backend doesn't have this yet, keep image mock
        })
      }
      if (res.data.recentCalls) {
        setRecentCalls(res.data.recentCalls)
      }
    } catch (err) {
      // Use defaults on error
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  const handleExport = () => {
    const exportData = {
      user: user?.name,
      stats: stats,
      recentCalls: recentCalls,
      exportedAt: new Date().toISOString()
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `salyzer_report_${new Date().toLocaleDateString()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    toast.success('Report exported successfully!')
  }

  // Predefined rows for the UI mock if no real calls exist
  const displayCalls = recentCalls.length > 0 
    ? recentCalls.slice(0, 3).map(call => ({
        id: call.id,
        name: call.filename?.split('.')[0] || 'Sales Agent',
        role: call.filename?.charAt(0)?.toUpperCase() || 'SA',
        type: 'Sales Call',
        score: call.overallScore,
        sentiment: call.overallScore >= 80 ? '😊' : call.overallScore >= 60 ? '😐' : '😞',
        status: 'COMPLETED'
      }))
    : [
        { name: 'Sarah Jenkins', role: 'SJ', type: 'Discovery Call', score: 92, sentiment: '😊', status: 'COMPLETED' },
        { name: 'Marcus Wei', role: 'MW', type: 'Price Negotiation', score: 78, sentiment: '😐', status: 'COMPLETED' },
        { name: 'Daniel Lee', role: 'DL', type: 'Post-Demo Catchup', score: null, sentiment: '⌛', status: 'PROCESSING AI' },
      ]

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex items-center justify-between gap-8 mb-10">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-text-sub" />
          <input
            type="text"
            placeholder="Search insights..."
            className="w-full bg-white border border-transparent focus:border-dashboard-primary/20 focus:ring-4 focus:ring-dashboard-primary/5 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold text-dashboard-primary">Direct Insights</Link>
          <Link to="/history" className="text-sm font-bold text-dashboard-text-sub hover:text-dashboard-text-main transition-colors">Reports</Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link 
            to="/profile"
            className="flex items-center gap-3 pl-4 border-l border-dashboard-border group hover:bg-dashboard-primary-light/30 p-2 rounded-2xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-extrabold text-dashboard-text-main group-hover:text-dashboard-primary transition-colors">
                {user?.name || 'Alex Rivers'}
              </p>
              <p className="text-[10px] font-bold text-dashboard-text-sub uppercase tracking-widest">View Profile</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-dashboard-primary text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white overflow-hidden">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AR'}
            </div>
          </Link>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-dashboard-text-main tracking-tight">Good Morning, Sales Team</h1>
          <p className="text-dashboard-text-sub font-medium">
            AI analyzed 24 new calls since your last login. Here are the core insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#475569] font-bold rounded-xl transition-all duration-300 active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <Link 
            to="/upload"
            className="flex items-center gap-2 px-8 py-3 bg-dashboard-primary hover:bg-[#0042cc] text-white font-bold rounded-xl shadow-lg shadow-dashboard-primary/25 transition-all duration-300 active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Calls */}
        <div className="bg-white p-8 rounded-[32px] border border-dashboard-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-xl bg-dashboard-primary-light flex items-center justify-center text-dashboard-primary">
              <Phone className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-[#ecfdf5] text-[#10b981] rounded-full text-xs font-bold ring-1 ring-[#10b981]/10">
              <TrendingUp className="w-3 h-3" />
              12%
            </div>
          </div>
          <p className="text-sm font-bold text-dashboard-text-sub mb-2 uppercase tracking-wider">Total Calls Analyzed</p>
          <p className="text-4xl font-extrabold text-dashboard-text-main">{stats.totalCalls}</p>
        </div>

        {/* Avg Performance */}
        <div className="bg-white p-8 rounded-[32px] border border-dashboard-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-[#f1f5f9] text-[#64748b] rounded-full text-xs font-bold ring-1 ring-[#64748b]/10">
              Stable
            </div>
          </div>
          <p className="text-sm font-bold text-dashboard-text-sub mb-2 uppercase tracking-wider">Average Performance Score</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold text-dashboard-text-main">{stats.avgScore}%</p>
          </div>
          <div className="mt-6 h-2 w-full bg-dashboard-primary-light rounded-full overflow-hidden">
            <div className="h-full bg-dashboard-primary rounded-full transition-all duration-1000" style={{ width: `${stats.avgScore}%` }} />
          </div>
        </div>

        {/* Unanswered Objections */}
        <div className="bg-white p-8 rounded-[32px] border border-dashboard-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-bold ring-1 ring-red-500/10">
              -5% Improve
            </div>
          </div>
          <p className="text-sm font-bold text-dashboard-text-sub mb-2 uppercase tracking-wider">Unanswered Objections</p>
          <p className="text-4xl font-extrabold text-dashboard-text-main">{stats.unanswered}</p>
          <p className="mt-4 text-xs font-bold text-[#cbd5e1] uppercase tracking-widest">Critical threshold: 25</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-dashboard-border shadow-sm">
          <div className="flex items-start justify-between mb-10">
            <div>
              <h2 className="text-xl font-extrabold text-dashboard-text-main">Sales Performance & Emotional Sentiment</h2>
              <p className="text-sm text-dashboard-text-sub font-medium mt-1">Weekly correlation between closing rate and positive tone</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-dashboard-primary rounded-full" />
                <span className="text-xs font-bold text-dashboard-text-sub">Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#1e293b] rounded-full" />
                <span className="text-xs font-bold text-dashboard-text-sub">Sentiment</span>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0052ff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0052ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#0052ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPerf)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#1e293b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Panels Column */}
        <div className="space-y-8">
          {/* Agent Spotlight */}
          <div className="bg-white p-8 rounded-[40px] border border-dashboard-border shadow-sm">
            <h3 className="text-lg font-extrabold text-dashboard-text-main mb-6">Agent Spotlight</h3>
            <div className="space-y-6">
              {[
                { name: 'Sarah Jenkins', metric: '98% Retention Rate', rank: 'Top 1%', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
                { name: 'Marcus Wei', metric: '92% Closing Rate', rank: 'Top 5%', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
              ].map((agent, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <img src={agent.img} alt={agent.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-dashboard-primary/20 transition-all" />
                    <div>
                      <p className="text-sm font-bold text-dashboard-text-main">{agent.name}</p>
                      <p className="text-xs font-medium text-dashboard-text-sub">{agent.metric}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-dashboard-primary bg-dashboard-primary-light px-3 py-1 rounded-full">{agent.rank}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-dashboard-primary-light hover:bg-dashboard-primary/10 text-dashboard-primary font-bold rounded-xl transition-all text-sm">
              View All Performers
            </button>
          </div>

          {/* Missed Opportunities */}
          <div className="bg-white p-8 rounded-[40px] border border-dashboard-border shadow-sm">
            <h3 className="text-lg font-extrabold text-dashboard-text-main mb-6">Top Missed Opportunities</h3>
            <div className="space-y-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Pricing</span>
                  <span className="bg-dashboard-primary-light text-dashboard-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">AI-Detected</span>
                </div>
                <p className="text-sm font-bold text-dashboard-text-main leading-relaxed">
                  Competitor discount mention ignored in <span className="text-dashboard-primary px-1">12 calls</span>.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Follow-up</span>
                </div>
                <p className="text-sm font-bold text-dashboard-text-main leading-relaxed">
                  Lack of clear <span className="text-purple-600 px-1">next steps</span> on 'Demo Completed' calls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls Analysis Table */}
      <div className="bg-white rounded-[40px] border border-dashboard-border shadow-sm overflow-hidden mb-12">
        <div className="p-8 flex items-center justify-between border-b border-dashboard-border bg-white sticky top-0 z-10">
          <h2 className="text-xl font-extrabold text-dashboard-text-main">Recent Calls Analysis</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-dashboard-text-sub hover:text-dashboard-text-main transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <button className="p-2 text-dashboard-text-sub hover:text-dashboard-text-main transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dashboard-border">
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest">Agent</th>
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest">Call Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest text-center">Sentiment</th>
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest text-center">Analysis Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-dashboard-text-sub uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashboard-border">
              {displayCalls.map((row, i) => (
                <tr key={i} className="hover:bg-dashboard-primary-light/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${i === 0 ? 'bg-blue-50 text-blue-600' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-purple-50 text-purple-600'} flex items-center justify-center text-xs font-black ring-2 ring-white shadow-sm`}>
                        {row.role}
                      </div>
                      <span className="text-sm font-bold text-dashboard-text-main group-hover:text-dashboard-primary transition-colors">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-semibold text-dashboard-text-sub">{row.type}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-sm font-black ${row.score && row.score >= 90 ? 'text-dashboard-primary' : row.score ? 'text-dashboard-text-main' : 'text-[#cbd5e1]'}`}>
                      {row.score ? `${row.score}%` : '--'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xl text-center">{row.sentiment}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex justify-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg ${row.status === 'COMPLETED' ? 'bg-[#ecfdf5] text-[#10b981]' : 'bg-[#eef4ff] text-[#0052ff] flex items-center gap-1.5'}`}>
                        {row.status !== 'COMPLETED' && <div className="w-1.5 h-1.5 bg-dashboard-primary rounded-full animate-pulse" />}
                        {row.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {row.id ? (
                      <Link to={`/analysis/${row.id}`} className="text-xs font-bold text-dashboard-primary hover:underline transition-all">
                        View Transcript
                      </Link>
                    ) : i < 2 ? (
                      <button className="text-xs font-bold text-dashboard-primary hover:underline transition-all">
                        View Transcript
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#cbd5e1]">Waiting...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="w-full py-6 flex items-center justify-center gap-2 text-sm font-bold text-dashboard-text-sub hover:text-dashboard-primary transition-colors hover:bg-dashboard-primary-light/20">
            Show More Results
            <MoreVertical className="w-4 h-4 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  )
}
