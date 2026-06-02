import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import {
  Flame, CheckCircle2, ArrowRight, PlusCircle,
  Loader2, Star, Target, Award, BookOpen, Code2,
  ChevronDown, ChevronUp, Send, Sparkles, CheckCircle, XCircle, Zap,
  Bot, Route,
  MessagesSquare
} from 'lucide-react'

/* ── GitHub-style Activity Graph ─────────────────────────────── */
function ActivityGraph({ dates }) {
  // Use local date to avoid UTC offset issues (e.g. IST = UTC+5:30)
  const toLocalDateStr = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toLocalDateStr(today)
  const todayDow = today.getDay() // 0=Sun … 6=Sat

  // Anchor to the Sunday of the current week, then go back 51 more weeks
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - todayDow - 51 * 7)

  // Build 52 weeks × 7 days grid (Sun→Sat, null for future days)
  const WEEKS = 52
  const cells = []
  for (let w = 0; w < WEEKS; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + w * 7 + d)
      if (date > today) {
        week.push(null) // future — render as empty
      } else {
        week.push(toLocalDateStr(date))
      }
    }
    cells.push(week)
  }

  // Month labels
  const months = []
  let lastMonth = -1
  cells.forEach((week, wi) => {
    const firstDate = week.find(d => d !== null)
    if (!firstDate) return
    const m = new Date(firstDate).getMonth()
    if (m !== lastMonth) {
      months.push({ index: wi, label: new Date(firstDate).toLocaleString('default', { month: 'short' }) })
      lastMonth = m
    }
  })

  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dateSet = new Set(dates)
  const totalActive = dates.filter(d => {
    const date = new Date(d)
    const cutoff = new Date(today)
    cutoff.setFullYear(today.getFullYear() - 1)
    return date >= cutoff
  }).length

  const getColor = (dateStr) => {
    if (!dateSet.has(dateStr)) return '#1e2130'
    return '#4f4fe8'
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-orange-400" />
          <h2 className="font-semibold text-slate-100">Activity</h2>
        </div>
        <span className="text-sm text-slate-400">{totalActive} active day{totalActive !== 1 ? 's' : ''} in the last year</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: '640px' }}>
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {cells.map((week, wi) => {
              const mo = months.find(m => m.index === wi)
              return (
                <div key={wi} style={{ width: '14px', marginRight: '3px', flexShrink: 0 }}>
                  {mo ? <span className="text-[10px] text-slate-500">{mo.label}</span> : null}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col mr-2" style={{ gap: '3px' }}>
              {DAY_LABELS.map((d, i) => (
                <div key={d} style={{ height: '14px', width: '28px' }} className="flex items-center">
                  {(i === 1 || i === 3 || i === 5) &&
                    <span className="text-[10px] text-slate-500 leading-none">{d}</span>}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: '3px' }}>
              {cells.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: '3px' }}>
                  {week.map((dateStr, di) => {
                    if (dateStr === null) {
                      // Future cell — render blank spacer
                      return (
                        <div
                          key={`future-${wi}-${di}`}
                          style={{ width: '14px', height: '14px', flexShrink: 0 }}
                        />
                      )
                    }
                    const active = dateSet.has(dateStr)
                    const isToday = dateStr === todayStr
                    return (
                      <div
                        key={dateStr}
                        title={`${dateStr}${active ? ' — active' : ''}`}
                        style={{
                          width: '14px', height: '14px',
                          borderRadius: '3px',
                          backgroundColor: getColor(dateStr),
                          border: isToday ? '1px solid #6366f1' : 'none',
                          transition: 'background-color 0.15s',
                          cursor: 'default',
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-8 justify-end">
            <span className="text-[11px] text-slate-400">Inactive</span>
            <div className="w-[14px] h-[14px] rounded-[2px] bg-[#1e2130]" />

            <div className="w-[14px] h-[14px] rounded-[2px] bg-indigo-500" />
            {/* {['#1e2130','#312d8a', '#4338ca', '#4f4fe8', '#818cf8'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c }} />
            ))} */}
            <span className="text-[11px] text-slate-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Daily Challenge ─────────────────────────────────────────── */
function DailyChallenge() {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoad] = useState(true)
  const [showHints, setHints] = useState(false)
  const [showObjective, setObjective] = useState(false)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [review, setReview] = useState(null)
  const [xpEarned, setXpEarned] = useState(false)

  useEffect(() => {
    api.get('/features/daily-challenge')
      .then(r => {
        const ch = r.data
        setChallenge(ch)
        setLoad(false)
        // Restore completed state from persisted DB fields
        if (ch?.answered || ch?.review_result) {
          if (ch.submitted_answer) setAnswer(ch.submitted_answer)
          if (ch.review_result) {
            setReview(ch.review_result)
            if ((ch.xp_awarded ?? 0) > 0) setXpEarned(true)
          }
        }
      })
      .catch(() => setLoad(false))
  }, [])

  const handleSubmit = async () => {
    if (!answer.trim() || submitting || !challenge) return
    setSubmitting(true)
    try {
      const res = await api.post('/features/daily-challenge/submit', {
        challenge_id: challenge.id,
        answer: answer.trim(),
        task: challenge.task,
        challenge_title: challenge.title,
        skill: challenge.skill || challenge.category || 'Programming',
        difficulty: challenge.difficulty || 'Easy',
      })
      setReview(res.data)
      if (res.data.xp_awarded > 0 && !res.data.already_answered) setXpEarned(true)
    } catch {
      setReview({ error: 'Could not evaluate your answer. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const DIFF = {
    Easy: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    Hard: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  // Locked if: Challenge already completely passed/answered (persisted in DB), or review passed
  const alreadyDone = (challenge?.answered === true) || (review?.passed === true) || (review?.score >= 60)

  return (
    <div className="card p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Target size={17} className="text-orange-400" />
        <h2 className="font-semibold text-slate-100">Daily Challenge</h2>
        <span className="text-xs text-slate-500 ml-auto">Resets daily</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={20} className="text-brand-400 animate-spin" /></div>
      ) : !challenge ? (
        <p className="text-sm text-slate-400">Generate a roadmap first to get daily challenges.</p>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col">

          {/* Badges + Title */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`badge ${DIFF[challenge.difficulty] || 'bg-white/5 text-slate-400'}`}>{challenge.difficulty}</span>
              <span className="badge bg-white/5 text-slate-400">{challenge.category}</span>
              {xpEarned && (
                <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                  <Zap size={10} /> +20 XP Earned
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-100 text-base">{challenge.title}</h3>
          </div>

          {/* Task — primary display (replaces description) */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-xs font-semibold text-brand-400 mb-1.5">📝 Your Task</p>
            <p className="text-sm text-slate-200 leading-relaxed">{challenge.task}</p>
          </div>

          {/* Example I/O */}
          {challenge.example_input && (
            <div className="rounded-xl p-3 font-mono text-xs" style={{ background: '#0d0f14' }}>
              <p className="text-slate-500 mb-1">Input: <span className="text-green-400">{challenge.example_input}</span></p>
              <p className="text-slate-500">Output: <span className="text-green-400">{challenge.example_output}</span></p>
            </div>
          )}

          {/* Collapsible Learning Objective */}
          {challenge.learning_objective && (
            <div>
              <button
                onClick={() => setObjective(!showObjective)}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Sparkles size={12} />
                Learning Objective
                {showObjective ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {showObjective && (
                <div className="mt-2 rounded-xl p-3" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}>
                  <p className="text-xs text-slate-300 leading-relaxed">{challenge.learning_objective}</p>
                </div>
              )}
            </div>
          )}

          {/* Collapsible Hints */}
          {challenge.hints?.length > 0 && (
            <div>
              <button onClick={() => setHints(!showHints)} className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1.5">
                💡 {showHints ? 'Hide' : 'Show'} hints ({challenge.hints.length})
              </button>
              {showHints && (
                <ul className="mt-2 space-y-1.5 rounded-xl p-3" style={{ background: '#1e2130' }}>
                  {challenge.hints.map((h, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="text-brand-400 shrink-0">•</span>{h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Answer Submission */}
          <div className="mt-auto pt-3 border-t border-white/5 space-y-3">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Send size={11} className="text-brand-400" /> Submit Your Answer
            </p>
            <textarea
              id="challenge-answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={alreadyDone}
              placeholder="Write your solution, explanation, or code here…"
              rows={4}
              className="w-full rounded-xl p-3 text-sm text-slate-200 placeholder-slate-600 resize-none outline-none transition-all"
              style={{
                background: '#0d0f14',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'inherit',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
            />

            <button
              id="submit-challenge-btn"
              onClick={handleSubmit}
              disabled={submitting || !answer.trim() || alreadyDone}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all"
              style={{
                background: (submitting || alreadyDone) ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.9)',
                color: (submitting || alreadyDone) ? 'rgba(148,163,184,0.6)' : '#fff',
                cursor: (submitting || alreadyDone) ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting
                ? <><Loader2 size={14} className="animate-spin" /> Reviewing…</>
                : alreadyDone
                  ? <><CheckCircle size={14} /> Submitted ✓</>
                  : review && (!review.passed || review.score < 60)
                    ? <><Send size={14} /> Try Again</>
                    : <><Send size={14} /> Submit for AI Review</>}
            </button>

            {/* AI Review Result */}
            {review && !review.error && (
              <div
                className="rounded-xl p-4 space-y-2.5"
                style={{
                  background: review.passed ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                  border: `1px solid ${review.passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {review.passed
                      ? <CheckCircle size={15} className="text-green-400" />
                      : <XCircle size={15} className="text-red-400" />}
                    <span className={`text-sm font-semibold ${review.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {review.passed ? 'Correct! Well done.' : 'Not quite right.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Score:</span>
                    <span className="text-xs font-bold text-slate-200">{review.score}/100</span>
                    {review.xp_awarded > 0 && (
                      <span className="text-xs font-bold text-yellow-400 flex items-center gap-0.5"><Zap size={10} />+{review.xp_awarded} XP</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{review.feedback}</p>
                {review.strengths?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wider mb-1">Strengths</p>
                    <ul className="space-y-0.5">
                      {review.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5"><span className="text-green-400 shrink-0">✓</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.improvements?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider mb-1">Improvements</p>
                    <ul className="space-y-0.5">
                      {review.improvements.map((imp, i) => (
                        <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5"><span className="text-orange-400 shrink-0">→</span>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {review?.error && <p className="text-xs text-red-400">{review.error}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            {challenge.roadmap_title && (
              <p className="text-[11px] text-slate-600 truncate">Based on: {challenge.roadmap_title}</p>
            )}
            <Link to="/practice" className="inline-flex items-center gap-1.5 text-xs text-brand-400 font-medium hover:underline ml-auto">
              <Code2 size={12} /> Open Practice IDE →
            </Link>
          </div>

        </div>
      )}
    </div>
  )
}

/* ── Stat Card ───────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="card p-4 sm:p-5 hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.4)] transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <Icon size={18} className={iconColor} />
      </div>
      <p className="text-2xl font-bold text-slate-100">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setL] = useState(true)

  useEffect(() => {
    api.get('/dashboard/').then(r => { setData(r.data); setL(false) }).catch(() => setL(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="text-brand-400 animate-spin" />
    </div>
  )

  const stats = data?.stats || {}
  const dashUser = data?.user || user
  const activeRM = data?.active_roadmap
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
            {greeting}, {dashUser?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Here's your learning summary</p>
        </div>
        <Link to="/onboarding" className="btn-primary text-sm">
          <PlusCircle size={16} className="mr-2" /> New roadmap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Flame} label="Day streak" value={dashUser?.streak_days || 0} iconColor="text-orange-400" />
        <StatCard icon={Star} label="XP points" value={dashUser?.xp_points || 0} iconColor="text-yellow-400" />
        <StatCard icon={Route} label="Roadmaps" value={stats.total_roadmaps || 0} iconColor="text-brand-400" />
        <StatCard icon={CheckCircle2} label="Topics done" value={stats.total_topics_completed || 0} iconColor="text-green-400" />
      </div>

      {/* Active Roadmap */}
      {activeRM ? (
        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <span className="badge bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-2">Currently learning</span>
              <h2 className="text-base sm:text-lg font-semibold text-slate-100">{activeRM.title}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{activeRM.completed_topics} of {activeRM.total_topics} topics completed</p>
            </div>
            <Link to={`/roadmaps/${activeRM.id}`} className="btn-primary text-sm">
              Continue <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600">Progress</span>
            <span className="text-xs font-medium text-slate-400">{activeRM.progress_percent}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: '#1e2130' }}>
            <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${activeRM.progress_percent}%` }} />
          </div>
          {activeRM.topics?.[activeRM.current_topic_index] && (
            <div className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 animate-pulse-soft shrink-0" />
              <div>
                <p className="text-xs text-brand-400 font-medium mb-0.5">You are here</p>
                <p className="text-sm font-medium text-slate-200">{activeRM.topics[activeRM.current_topic_index].name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeRM.topics[activeRM.current_topic_index].day_range} · {activeRM.topics[activeRM.current_topic_index].estimated_hours}h estimated
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <BookOpen size={36} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-200 mb-2">No active roadmap</h2>
          <p className="text-sm text-slate-500 mb-6">Create your first AI-powered learning path to get started</p>
          <Link to="/onboarding" className="btn-primary inline-flex"><PlusCircle size={16} className="mr-2" /> Create roadmap</Link>
        </div>
      )}

      {/* Daily Challenge + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DailyChallenge />
        <div className="card p-5">
          <h2 className="font-semibold text-slate-100 mb-4">Quick Access</h2>
          <div className="space-y-2">
            {[
              { to: '/interview', icon: MessagesSquare, label: 'Interview Prep', sub: 'Practice mock interviews', color: 'text-purple-400', bg: 'rgba(168,85,247,0.1)' },
              { to: '/badges', icon: Award, label: 'Badges & Achievements', sub: 'View your earned badges', color: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)' },
              { to: '/practice', icon: Code2, label: 'Practice IDE', sub: 'Write and run code', color: 'text-green-400', bg: 'rgba(34,197,94,0.1)' },
              { to: '/chat', icon: Bot, label: 'AI Assistant', sub: 'Ask learning questions', color: 'text-brand-400', bg: 'rgba(99,102,241,0.1)' },
            ].map(({ to, icon: Icon, label, sub, color, bg }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-3 rounded-xl transition-all group border border-white/10 hover:border-white/20 hover:bg-white/5 bg-surface-800/30 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                  <Icon size={17} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub-style Activity Graph */}
      <ActivityGraph dates={data?.streak_dates || []} />

      {/* Roadmaps list */}
      {data?.all_roadmaps?.length > 0 && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-100">Top roadmaps</h2>
            <Link to="/roadmaps" className="text-sm text-brand-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {data.all_roadmaps.slice(0, 3).map(r => (
              <Link key={r.id} to={`/roadmaps/${r.id}`}
                className="flex items-center justify-between p-3 rounded-xl transition-all group border border-white/10 hover:border-white/20 hover:bg-white/5 bg-surface-800/30 backdrop-blur-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.skill_level} · {r.timeline}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <div className="hidden sm:block w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2130' }}>
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${r.progress_percent}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{r.progress_percent}%</span>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
