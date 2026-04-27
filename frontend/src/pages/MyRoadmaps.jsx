import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { Loader2, PlusCircle, Map, ArrowRight, CheckCircle2, Clock } from 'lucide-react'

const SKILL_COLORS = {
  Python: 'bg-blue-50 text-blue-700',
  JavaScript: 'bg-yellow-50 text-yellow-700',
  React: 'bg-cyan-50 text-cyan-700',
  'Machine Learning': 'bg-purple-50 text-purple-700',
  DevOps: 'bg-orange-50 text-orange-700',
  'Data Science': 'bg-green-50 text-green-700',
}

export default function MyRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/roadmaps/').then(r => { setRoadmaps(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="text-brand-500 animate-spin" />
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary">My roadmaps</h1>
          <p className="text-ink-tertiary mt-1 text-sm">{roadmaps.length} learning path{roadmaps.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/onboarding" className="btn-primary flex items-center gap-2 text-sm">
          <PlusCircle size={16} /> New roadmap
        </Link>
      </div>

      {roadmaps.length === 0 ? (
        <div className="card p-16 text-center">
          <Map size={40} className="text-ink-ghost mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-primary mb-2">No roadmaps yet</h2>
          <p className="text-sm text-ink-tertiary mb-6">Generate your first AI-powered learning path</p>
          <Link to="/onboarding" className="btn-primary inline-flex items-center gap-2">
            <PlusCircle size={16} /> Create roadmap
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {roadmaps.map(r => (
            <Link key={r.id} to={`/roadmaps/${r.id}`}
              className="card p-5 hover:border-brand-200 hover:shadow-md hover:shadow-brand-50 transition-all group">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  r.progress_percent >= 100 ? 'bg-green-50' : 'bg-brand-50'
                }`}>
                  {r.progress_percent >= 100
                    ? <CheckCircle2 size={22} className="text-green-500" />
                    : <Map size={22} className="text-brand-500" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2 className="font-semibold text-ink-primary group-hover:text-brand-700 transition-colors truncate">
                      {r.title}
                    </h2>
                    <ArrowRight size={16} className="text-ink-ghost group-hover:text-brand-500 transition-colors mt-0.5 shrink-0" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {r.skills?.slice(0, 3).map(s => (
                      <span key={s} className={`badge text-[11px] ${SKILL_COLORS[s] || 'bg-surface-2 text-ink-tertiary'}`}>{s}</span>
                    ))}
                    <span className="badge bg-surface-2 text-ink-ghost text-[11px]">{r.skill_level}</span>
                    <span className="flex items-center gap-1 text-xs text-ink-ghost">
                      <Clock size={11} />{r.timeline}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${
                        r.progress_percent >= 100 ? 'bg-green-500' : 'bg-brand-500'
                      }`} style={{ width: `${r.progress_percent}%` }} />
                    </div>
                    <span className="text-xs font-medium text-ink-tertiary shrink-0">
                      {r.completed_topics}/{r.total_topics} topics
                    </span>
                    <span className={`text-xs font-semibold shrink-0 ${
                      r.progress_percent >= 100 ? 'text-green-600' : 'text-brand-600'
                    }`}>
                      {r.progress_percent}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
