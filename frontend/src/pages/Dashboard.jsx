import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { Flame, Trophy, Map, CheckCircle2, ArrowRight, PlusCircle, Loader2, BookOpen, Star } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-semibold text-ink-primary">{value}</p>
      <p className="text-sm text-ink-tertiary mt-0.5">{label}</p>
    </div>
  )
}

function StreakCalendar({ dates }) {
  const today = new Date()
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="flex gap-1 flex-wrap">
      {days.map(day => {
        const active = dates.includes(day)
        return (
          <div key={day} title={day}
            className={`w-6 h-6 rounded-md transition-colors ${active ? 'bg-brand-500' : 'bg-surface-3'}`} />
        )
      })}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/').then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="text-brand-500 animate-spin" />
    </div>
  )

  const stats = data?.stats || {}
  const activeRoadmap = data?.active_roadmap
  const dashUser = data?.user || user

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {dashUser?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-ink-tertiary mt-1 text-sm">Here's your learning summary</p>
        </div>
        <Link to="/onboarding" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New roadmap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Day streak" value={dashUser?.streak_days || 0}
          color="bg-orange-50 text-orange-500" />
        <StatCard icon={Star} label="XP points" value={dashUser?.xp_points || 0}
          color="bg-yellow-50 text-yellow-500" />
        <StatCard icon={Map} label="Roadmaps" value={stats.total_roadmaps || 0}
          color="bg-brand-50 text-brand-600" />
        <StatCard icon={CheckCircle2} label="Topics done" value={stats.total_topics_completed || 0}
          color="bg-green-50 text-green-600" />
      </div>

      {/* Active Roadmap */}
      {activeRoadmap ? (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="badge bg-brand-50 text-brand-700 mb-2">Currently learning</span>
              <h2 className="text-lg font-semibold text-ink-primary">{activeRoadmap.title}</h2>
              <p className="text-sm text-ink-tertiary mt-0.5">
                {activeRoadmap.completed_topics} of {activeRoadmap.total_topics} topics completed
              </p>
            </div>
            <Link to={`/roadmaps/${activeRoadmap.id}`}
              className="btn-primary flex items-center gap-2 text-sm">
              Continue <ArrowRight size={16} />
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-ink-ghost">Progress</span>
              <span className="text-xs font-medium text-ink-secondary">{activeRoadmap.progress_percent}%</span>
            </div>
            <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
                style={{ width: `${activeRoadmap.progress_percent}%` }} />
            </div>
          </div>

          {/* Current topic highlight */}
          {activeRoadmap.topics && activeRoadmap.topics[activeRoadmap.current_topic_index] && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 animate-pulse-soft shrink-0" />
              <div>
                <p className="text-xs text-brand-600 font-medium mb-0.5">You are here</p>
                <p className="text-sm font-medium text-ink-primary">
                  {activeRoadmap.topics[activeRoadmap.current_topic_index].name}
                </p>
                <p className="text-xs text-ink-tertiary mt-0.5">
                  {activeRoadmap.topics[activeRoadmap.current_topic_index].day_range} ·{' '}
                  {activeRoadmap.topics[activeRoadmap.current_topic_index].estimated_hours}h estimated
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <BookOpen size={36} className="text-ink-ghost mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-primary mb-2">No active roadmap</h2>
          <p className="text-sm text-ink-tertiary mb-6">Create your first AI-powered learning path to get started</p>
          <Link to="/onboarding" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={16} /> Create roadmap
          </Link>
        </div>
      )}

      {/* Streak calendar */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-orange-500" />
          <h2 className="font-semibold text-ink-primary">Activity — last 30 days</h2>
        </div>
        <StreakCalendar dates={data?.streak_dates || []} />
        <p className="text-xs text-ink-ghost mt-3">Each square = a day you logged in and made progress</p>
      </div>

      {/* All roadmaps mini list */}
      {data?.all_roadmaps?.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink-primary">All roadmaps</h2>
            <Link to="/roadmaps" className="text-sm text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {data.all_roadmaps.slice(0, 4).map(r => (
              <Link key={r.id} to={`/roadmaps/${r.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-1 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary truncate">{r.title}</p>
                  <p className="text-xs text-ink-ghost">{r.skill_level} · {r.timeline}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <div className="w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${r.progress_percent}%` }} />
                  </div>
                  <span className="text-xs text-ink-ghost w-8 text-right">{r.progress_percent}%</span>
                  <ArrowRight size={14} className="text-ink-ghost group-hover:text-brand-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
