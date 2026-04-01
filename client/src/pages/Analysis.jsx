import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Target,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Smile,
  Frown,
  Meh,
  Volume2,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import axios from 'axios'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 shadow-xl text-sm">
        <p className="text-surface-400 text-xs">{label}</p>
        <p className="text-white font-medium">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function Analysis() {
  const { id } = useParams()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    transcript: false,
    stages: true,
    tone: true,
    missed: true,
    comparison: true,
    feedback: true,
    scores: true,
  })

  useEffect(() => {
    fetchAnalysis()
  }, [id])

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get(`/api/calls/${id}`)
      setAnalysis(res.data)
    } catch (err) {
      console.error('Failed to fetch analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-surface-300">Analysis not found</h2>
        <Link to="/dashboard" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const { call, result } = analysis
  const scores = result?.scores || {}
  const toneData = result?.toneTimeline || []
  const stages = result?.stages || []
  const missedOpportunities = result?.missedOpportunities || []
  const feedback = result?.feedback || []
  const scriptComparison = result?.scriptComparison || []

  const scoreData = [
    { subject: 'Clarity', value: scores.clarity || 0 },
    { subject: 'Persuasion', value: scores.persuasion || 0 },
    { subject: 'Objection\nHandling', value: scores.objectionHandling || 0 },
    { subject: 'Closing', value: scores.closing || 0 },
    { subject: 'Rapport', value: scores.rapport || 0 },
  ]

  const scoreBarData = scoreData.map((d) => ({
    ...d,
    fill:
      d.value >= 80
        ? '#34d399'
        : d.value >= 60
        ? '#fbbf24'
        : '#f87171',
  }))

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-accent-400'
    if (score >= 60) return 'text-warning-400'
    return 'text-danger-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Great'
    if (score >= 70) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 50) return 'Needs Work'
    return 'Poor'
  }

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return <Smile className="w-4 h-4 text-accent-400" />
    if (sentiment === 'negative') return <Frown className="w-4 h-4 text-danger-400" />
    return <Meh className="w-4 h-4 text-warning-400" />
  }

  const Section = ({ id, icon: Icon, title, badge, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-900/60 backdrop-blur border border-surface-800 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {badge && (
            <span className="text-xs font-medium bg-primary-500/15 text-primary-400 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {expandedSections[id] ? (
          <ChevronUp className="w-4 h-4 text-surface-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-surface-400" />
        )}
      </button>
      {expandedSections[id] && <div className="px-5 pb-5">{children}</div>}
    </motion.div>
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          to="/history"
          className="flex items-center gap-2 text-surface-400 hover:text-surface-200 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>
      </div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-surface-900 via-surface-900 to-primary-900/20 border border-surface-800 rounded-2xl p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(scores.overall || 0) * 2.64} 264`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(scores.overall || 0)}`}>
                  {scores.overall || 0}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">{call?.filename}</h1>
              <p className={`text-lg font-semibold ${getScoreColor(scores.overall || 0)}`}>
                {getScoreLabel(scores.overall || 0)}
              </p>
              <p className="text-sm text-surface-500 flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(call?.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 lg:ml-auto">
            {scoreData.slice(0, 4).map((s) => (
              <div key={s.subject} className="bg-surface-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-surface-400 mb-1">{s.subject.replace('\n', ' ')}</p>
                <p className={`text-xl font-bold ${getScoreColor(s.value)}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <Section id="scores" icon={BarChart3} title="Score Breakdown">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={scoreData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {scoreBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Conversation Stages */}
      <Section id="stages" icon={MessageSquare} title="Conversation Stages" badge={`${stages.length} detected`}>
        <div className="space-y-3">
          {stages.map((stage, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-surface-800/30 rounded-xl p-4"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                stage.quality === 'strong' ? 'bg-accent-500/15 text-accent-400' :
                stage.quality === 'weak' ? 'bg-danger-500/15 text-danger-400' :
                'bg-warning-500/15 text-warning-400'
              }`}>
                {stage.quality === 'strong' ? <CheckCircle className="w-4 h-4" /> :
                 stage.quality === 'weak' ? <XCircle className="w-4 h-4" /> :
                 <Meh className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-surface-200">{stage.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                    stage.quality === 'strong' ? 'bg-accent-500/10 text-accent-400' :
                    stage.quality === 'weak' ? 'bg-danger-500/10 text-danger-400' :
                    'bg-warning-500/10 text-warning-400'
                  }`}>
                    {stage.quality}
                  </span>
                </div>
                <p className="text-sm text-surface-400">{stage.analysis}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Emotional Tone Timeline */}
      <Section id="tone" icon={Volume2} title="Emotional Tone Timeline">
        {toneData.length > 0 && (
          <>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={toneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 3 }}
                    name="Confidence"
                  />
                  <Line
                    type="monotone"
                    dataKey="customerSentiment"
                    stroke="#34d399"
                    strokeWidth={2}
                    dot={{ fill: '#34d399', r: 3 }}
                    name="Customer Sentiment"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 text-xs text-surface-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary-500 rounded" />
                Agent Confidence
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-accent-400 rounded" />
                Customer Sentiment
              </div>
            </div>
          </>
        )}
        {result?.toneInsights && (
          <div className="mt-4 p-4 bg-surface-800/30 rounded-xl">
            <p className="text-sm text-surface-300">{result.toneInsights}</p>
          </div>
        )}
      </Section>

      {/* Missed Opportunities */}
      <Section
        id="missed"
        icon={AlertTriangle}
        title="Missed Opportunities"
        badge={missedOpportunities.length > 0 ? `${missedOpportunities.length} found` : null}
      >
        {missedOpportunities.length > 0 ? (
          <div className="space-y-3">
            {missedOpportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 bg-danger-500/5 border border-danger-500/10 rounded-xl p-4">
                <ShieldAlert className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-surface-200 mb-1">{opp.type}</h4>
                  <p className="text-sm text-surface-400">{opp.description}</p>
                  {opp.suggestion && (
                    <p className="text-sm text-primary-400 mt-2 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {opp.suggestion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-surface-500 py-6">No missed opportunities detected — great job!</p>
        )}
      </Section>

      {/* RAG Script Comparison */}
      <Section id="comparison" icon={Target} title="Script Comparison (RAG)">
        {scriptComparison.length > 0 ? (
          <div className="space-y-4">
            {scriptComparison.map((comp, i) => (
              <div key={i} className="bg-surface-800/30 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-medium text-surface-300">{comp.context}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-danger-500/5 border border-danger-500/10 rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-danger-400 font-medium mb-1.5">Your Response</p>
                    <p className="text-sm text-surface-300">{comp.userResponse}</p>
                  </div>
                  <div className="p-3 bg-accent-500/5 border border-accent-500/10 rounded-lg">
                    <p className="text-[10px] uppercase tracking-wider text-accent-400 font-medium mb-1.5">Ideal Response</p>
                    <p className="text-sm text-surface-300">{comp.idealResponse}</p>
                  </div>
                </div>
                {comp.gap && (
                  <p className="text-xs text-surface-500">{comp.gap}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-surface-500 py-6">No script comparisons available.</p>
        )}
      </Section>

      {/* AI Feedback */}
      <Section id="feedback" icon={Sparkles} title="AI Improvement Suggestions" badge={`${feedback.length} tips`}>
        <div className="space-y-3">
          {feedback.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-primary-500/5 border border-primary-500/10 rounded-xl p-4">
              <Lightbulb className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-surface-200 mb-1">{item.title}</h4>
                <p className="text-sm text-surface-400">{item.suggestion}</p>
                {item.example && (
                  <div className="mt-2 p-2.5 bg-surface-800/60 rounded-lg">
                    <p className="text-xs text-surface-500 mb-1">Better phrasing:</p>
                    <p className="text-sm text-accent-400 italic">"{item.example}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Transcript */}
      <Section 
        id="transcript" 
        icon={MessageSquare} 
        title="Full Transcript" 
        badge={
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              const btn = e.currentTarget;
              btn.disabled = true;
              btn.innerHTML = '<span class="animate-spin inline-block mr-1">⌛</span> Formatting...';
              try {
                const res = await axios.post(`/api/calls/${id}/reformat`);
                setAnalysis({ ...analysis, call: { ...analysis.call, transcript: res.data.transcript } });
              } catch (err) {
                alert('Format failed. Please check your API keys.');
              } finally {
                btn.disabled = false;
                btn.innerHTML = '✨ Auto-Format';
              }
            }}
            className="ml-3 px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-all font-bold text-[10px] flex items-center border border-primary-500/30"
          >
            ✨ Auto-Format
          </button>
        }
      >
        <div className="max-h-[650px] overflow-y-auto pr-2 space-y-4">
          {(() => {
            const rawText = call?.transcript || '';
            
            // Smart Split Logic:
            // 1. First try splitting by actual line breaks
            // 2. If it's one block, try splitting by "Name:" or "Name :" patterns
            const lines = rawText.includes('\n') 
              ? rawText.split('\n').filter(l => l.trim())
              : rawText.split(/(?=[A-Z][a-z]+:)/).filter(l => l.trim());

            return lines.map((line, i) => {
              const lowerLine = line.toLowerCase();
              // Check for generic or specific labels
              const isAgent = lowerLine.startsWith('agent:') || lowerLine.startsWith('agent :') || lowerLine.includes('lauren:');
              const isCustomer = lowerLine.startsWith('customer:') || lowerLine.startsWith('customer :') || lowerLine.includes('john smith:');
              
              // Clean up labels for display
              let cleanLine = line.replace(/^(agent|customer|lauren|john smith)\s*:/i, '').trim();
              
              return (
                <div key={i} className={`flex flex-col ${isAgent ? 'items-start' : isCustomer ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm relative ${
                    isAgent ? 'bg-primary-500/10 border border-primary-500/20 text-surface-100 rounded-bl-sm' :
                    isCustomer ? 'bg-surface-800 border-t border-surface-700 text-surface-200 rounded-br-sm' :
                    'bg-surface-900/50 border border-surface-800 text-surface-400 italic border-dashed'
                  }`}>
                    {(isAgent || isCustomer) && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isAgent ? 'bg-primary-400' : 'bg-surface-500 animate-pulse'}`} />
                        <p className={`text-[10px] uppercase tracking-widest font-black ${
                          isAgent ? 'text-primary-400' : 'text-surface-500'
                        }`}>
                          {isAgent ? 'Sales Agent' : 'Prospect'}
                        </p>
                      </div>
                    )}
                    <p className="leading-relaxed text-sm md:text-base font-medium whitespace-pre-wrap">
                      {cleanLine || line}
                    </p>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </Section>
    </div>
  )
}
