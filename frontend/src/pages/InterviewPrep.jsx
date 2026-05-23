import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import {
  Brain, Loader2, RefreshCw, CheckCircle2, XCircle, Star,
  Code2, Users, Sparkles, ChevronDown, MessagesSquare,
  History, ChevronRight, ChevronUp, BookOpen, Trophy,
  CalendarDays, Layers, PenLine, X
} from 'lucide-react'

const SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'Java', 'DevOps', 'Machine Learning', 'SQL', 'Data Science', 'TypeScript', 'DSA', 'Web Development']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const Q_TYPES = [
  { id: 'conceptual', icon: Brain, label: 'Conceptual', desc: 'Theory & concepts' },
  { id: 'coding', icon: Code2, label: 'Coding', desc: 'Code & problem solving' },
  { id: 'behavioral', icon: Users, label: 'Behavioral', desc: 'Soft skills & experience' },
]

const VERDICT_COLORS = {
  Excellent: 'bg-green-500/10 border-green-500/20 text-green-400',
  Good: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'Needs Improvement': 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  Poor: 'bg-red-500/10 border-red-500/20 text-red-400',
}

const SCORE_COLOR = (score) => {
  if (score >= 9) return 'text-green-400'
  if (score >= 7) return 'text-blue-400'
  if (score >= 4) return 'text-yellow-400'
  return 'text-red-400'
}

const TYPE_COLORS = {
  conceptual: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  coding: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  behavioral: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

// ── History Entry Card ────────────────────────────────────────────
function HistoryCard({ entry }) {
  const [expanded, setExpanded] = useState(false)
  const ev = entry.evaluation || {}

  return (
    <div className="card border-white/5 overflow-hidden transition-all duration-300">
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full p-4 sm:p-5 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
      >
        {/* Score circle */}
        <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 bg-surface-800 border border-white/5`}>
          <span className={`text-lg font-black leading-none ${SCORE_COLOR(ev.score)}`}>{ev.score ?? '–'}</span>
          <span className="text-[9px] text-slate-500 font-medium">/10</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{entry.question}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[entry.question_type] || 'bg-white/5 text-slate-400 border-white/10'}`}>
              {entry.question_type}
            </span>
            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{entry.skill}</span>
            <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{entry.level}</span>
            {ev.verdict && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${VERDICT_COLORS[ev.verdict] || ''}`}>
                {ev.verdict}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CalendarDays size={10} /> {formatDate(entry.practiced_at)}
          </p>
        </div>

        <div className="shrink-0 text-slate-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronRight size={16} />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-white/5 p-4 sm:p-5 space-y-4 animate-slide-up">

          {/* Question */}
          <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-4">
            <p className="text-xs font-semibold text-brand-400 mb-2 flex items-center gap-1.5"><BookOpen size={12} /> Question</p>
            <p className="text-sm text-slate-200 leading-relaxed">{entry.question}</p>
            {entry.what_interviewer_looks_for && (
              <div className="mt-3 pt-3 border-t border-brand-500/10">
                <p className="text-[11px] font-medium text-amber-400 flex items-center gap-1 mb-1"><Sparkles size={10} /> What the interviewer looks for</p>
                <p className="text-xs text-amber-200/70">{entry.what_interviewer_looks_for}</p>
              </div>
            )}
          </div>

          {/* Your answer */}
          <div className="bg-surface-800/60 border border-white/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 mb-2">Your Answer</p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{entry.answer}</p>
          </div>

          {/* Score + Verdict */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-800/60 border border-white/5 rounded-xl p-4 text-center">
              <p className={`text-3xl font-black ${SCORE_COLOR(ev.score)}`}>{ev.score}<span className="text-sm text-slate-500 font-normal">/10</span></p>
              <p className="text-xs text-slate-500 mt-0.5">Score</p>
            </div>
            {ev.verdict && (
              <div className={`flex-1 border rounded-xl p-4 text-center ${VERDICT_COLORS[ev.verdict] || ''}`}>
                <p className="text-lg font-bold">{ev.verdict}</p>
                <p className="text-xs mt-0.5 opacity-70">Verdict</p>
              </div>
            )}
          </div>

          {/* Strengths & Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ev.strengths?.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1"><CheckCircle2 size={12} /> Strengths</p>
                <ul className="space-y-1.5">
                  {ev.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-green-200/80 flex items-start gap-1.5"><span className="text-green-400 shrink-0 mt-0.5">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {ev.gaps?.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle size={12} /> Gaps</p>
                <ul className="space-y-1.5">
                  {ev.gaps.map((g, i) => (
                    <li key={i} className="text-xs text-red-200/80 flex items-start gap-1.5"><span className="text-red-400 shrink-0 mt-0.5">•</span>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ideal answer points */}
          {ev.ideal_answer_points?.length > 0 && (
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-400 mb-2 flex items-center gap-1.5"><Star size={12} /> Ideal Answer Should Include</p>
              <ul className="space-y-1.5">
                {ev.ideal_answer_points.map((p, i) => (
                  <li key={i} className="text-xs text-brand-200/80 flex items-start gap-1.5"><span className="text-brand-400 shrink-0 mt-0.5">•</span>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Overall Feedback */}
          {ev.feedback && (
            <div className="bg-[#0d0f14] border border-white/5 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-300 mb-1">AI Feedback</p>
              <p className="text-sm text-slate-400 leading-relaxed">{ev.feedback}</p>
            </div>
          )}

          {/* Tip */}
          {ev.tip && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-xs font-medium text-yellow-400 flex items-center gap-1.5"><Sparkles size={12} /> Pro tip: {ev.tip}</p>
            </div>
          )}

          {/* Follow-up */}
          {entry.follow_up && (
            <div className="bg-[#0f1117] border border-white/5 rounded-xl p-3">
              <p className="text-xs text-slate-500">Likely follow-up: <span className="text-slate-300 italic">"{entry.follow_up}"</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────
export default function InterviewPrep() {
  const [activeTab, setActiveTab] = useState('practice') // 'practice' | 'history'

  // Practice state
  const [skill, setSkill] = useState('Python')
  const [useCustomSkill, setUseCustomSkill] = useState(false)
  const [customSkill, setCustomSkill] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [qType, setQType] = useState('conceptual')
  const [question, setQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEval] = useState(null)
  const [loading, setLoading] = useState(false)
  const [evalLoading, setEvalL] = useState(false)
  const [sessionCount, setCount] = useState(0)

  // History state
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  const fetchHistory = async () => {
    if (historyLoading) return
    setHistoryLoading(true)
    try {
      const { data } = await api.get('/features/interview/history')
      setHistory(data.history || [])
      setHistoryLoaded(true)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setHistoryLoading(false)
    }
  }

  // Load history when tab is switched to history
  useEffect(() => {
    if (activeTab === 'history' && !historyLoaded) {
      fetchHistory()
    }
  }, [activeTab])

  const effectiveSkill = useCustomSkill ? customSkill.trim() : skill

  const getQuestion = async () => {
    if (useCustomSkill && !customSkill.trim()) {
      toast.error('Please enter a skill name'); return
    }
    setLoading(true); setQuestion(null); setAnswer(''); setEval(null)
    try {
      const { data } = await api.post('/features/interview/question', { skill: effectiveSkill, level, question_type: qType })
      setQuestion(data); setCount(c => c + 1)
    } catch { toast.error('Failed to generate question') }
    finally { setLoading(false) }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please write an answer'); return }
    setEvalL(true)
    try {
      const { data } = await api.post('/features/interview/evaluate', {
        question: question.question,
        question_type: question.type || qType,
        what_interviewer_looks_for: question.what_interviewer_looks_for || null,
        follow_up: question.follow_up || null,
        answer,
        skill: effectiveSkill,
        level,
      })
      setEval(data)
      // Refresh history cache so new entry appears immediately
      setHistoryLoaded(false)
    } catch { toast.error('Evaluation failed') }
    finally { setEvalL(false) }
  }

  // Summary stats from history
  const avgScore = history.length
    ? (history.reduce((sum, h) => sum + (h.evaluation?.score || 0), 0) / history.length).toFixed(1)
    : null

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <MessagesSquare size={22} className="text-brand-400" /> Interview Prep
        </h1>
        <p className="text-slate-400 mt-1 text-sm">AI-powered mock interviews tailored to your skill and level</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-800/50 border border-white/5 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'practice'
              ? 'bg-brand-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <MessagesSquare size={14} /> Practice
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'history'
              ? 'bg-brand-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <History size={14} /> History
          {history.length > 0 && (
            <span className="ml-1 bg-white/10 text-xs px-1.5 py-0.5 rounded-full font-mono">{history.length}</span>
          )}
        </button>
      </div>

      {/* ── PRACTICE TAB ── */}
      {activeTab === 'practice' && (
        <>
          {/* Config */}
          <div className="card p-5 sm:p-6 mb-6">
            <h2 className="text-sm font-semibold text-slate-100 mb-4">Configure your mock interview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Skill</label>
                {!useCustomSkill ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select className="input text-sm appearance-none cursor-pointer pr-10 w-full" value={skill} onChange={e => setSkill(e.target.value)}>
                        {SKILLS.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => { setUseCustomSkill(true); setCustomSkill('') }}
                      title="Enter a custom skill"
                      className="h-[46px] w-[46px] shrink-0 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-400 transition-all flex items-center justify-center"
                    >
                      <PenLine size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={customSkill}
                      onChange={e => setCustomSkill(e.target.value)}
                      placeholder="e.g. Kubernetes, Flutter, GraphQL…"
                      className="input text-sm flex-1"
                      maxLength={60}
                    />
                    <button
                      onClick={() => { setUseCustomSkill(false); setCustomSkill('') }}
                      title="Back to skill list"
                      className="h-[46px] w-[46px] shrink-0 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                {useCustomSkill && customSkill.trim() && (
                  <p className="text-[11px] text-brand-400 mt-1.5 flex items-center gap-1">
                    <Sparkles size={10} /> Practicing: <span className="font-semibold">{customSkill.trim()}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Level</label>
                <div className="relative">
                  <select className="input text-sm appearance-none cursor-pointer pr-10" value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Question Type</label>
                <div className="flex gap-2">
                  {Q_TYPES.map(t => (
                    <button key={t.id} onClick={() => setQType(t.id)}
                      className={`flex-1 h-[46px] rounded-xl border text-xs font-medium transition-all flex items-center justify-center ${qType === t.id ? 'bg-brand-600 text-white border-brand-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={getQuestion} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><RefreshCw size={16} /> {question ? 'Next Question' : 'Start Interview'}</>}
            </button>
            {sessionCount > 0 && <p className="text-xs text-slate-500 mt-2">{sessionCount} question{sessionCount > 1 ? 's' : ''} practiced this session</p>}
          </div>

          {/* Question */}
          {question && (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`badge border ${TYPE_COLORS[question.type] || 'bg-white/5 text-slate-400 border-white/10'}`}>{question.type}</span>
                  <span className="badge bg-[#1e2130] text-slate-400">{question.difficulty}</span>
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-100 mb-4 leading-relaxed">{question.question}</h2>
                {question.what_interviewer_looks_for && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-xs font-medium text-amber-400 mb-1 flex items-center gap-1.5"><Sparkles size={12} /> What the interviewer looks for:</p>
                    <p className="text-xs text-amber-200/80 leading-relaxed">{question.what_interviewer_looks_for}</p>
                  </div>
                )}
              </div>

              {!evaluation && (
                <div className="card p-5 sm:p-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Answer</label>
                  <textarea rows={6} value={answer} onChange={e => setAnswer(e.target.value)}
                    className="input text-sm resize-none mb-4"
                    placeholder="Type your answer here. Be thorough — the AI will evaluate your response…" />
                  <button onClick={submitAnswer} disabled={evalLoading || !answer.trim()} className="btn-primary flex items-center gap-2">
                    {evalLoading ? <><Loader2 size={16} className="animate-spin" /> Evaluating…</> : <><Star size={16} /> Get AI Feedback</>}
                  </button>
                </div>
              )}

              {evaluation && (
                <div className="card p-5 sm:p-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-slate-100">AI Feedback</h3>
                    <div className="flex items-center gap-3">
                      <p className={`text-2xl font-bold ${SCORE_COLOR(evaluation.score)}`}>{evaluation.score}<span className="text-sm text-slate-500">/10</span></p>
                      <span className={`badge border ${VERDICT_COLORS[evaluation.verdict] || 'bg-[#1e2130] text-slate-400'}`}>{evaluation.verdict}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {evaluation.strengths?.length > 0 && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1"><CheckCircle2 size={13} /> Strengths</p>
                        <ul className="space-y-1.5">{evaluation.strengths.map((s, i) => <li key={i} className="text-xs text-green-200/80 flex items-start gap-1.5"><span className="text-green-400 shrink-0">•</span> {s}</li>)}</ul>
                      </div>
                    )}
                    {evaluation.gaps?.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                        <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle size={13} /> Gaps</p>
                        <ul className="space-y-1.5">{evaluation.gaps.map((g, i) => <li key={i} className="text-xs text-red-200/80 flex items-start gap-1.5"><span className="text-red-400 shrink-0">•</span> {g}</li>)}</ul>
                      </div>
                    )}
                  </div>
                  {evaluation.ideal_answer_points?.length > 0 && (
                    <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 mb-4">
                      <p className="text-xs font-semibold text-brand-400 mb-2 flex items-center gap-1.5"><Star size={13} /> Ideal Answer Should Include</p>
                      <ul className="space-y-1.5">{evaluation.ideal_answer_points.map((p, i) => <li key={i} className="text-xs text-brand-200/80 flex items-start gap-1.5"><span className="text-brand-400 shrink-0">•</span> {p}</li>)}</ul>
                    </div>
                  )}
                  <div className="bg-[#0d0f14] border border-white/5 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-slate-300 mb-1">Overall Feedback</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{evaluation.feedback}</p>
                  </div>
                  {evaluation.tip && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <p className="text-xs font-medium text-yellow-400 flex items-center gap-1.5"><Sparkles size={13} /> Pro tip: {evaluation.tip}</p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-5">
                    <button onClick={getQuestion} className="btn-primary flex items-center gap-2 text-sm"><RefreshCw size={15} /> Next Question</button>
                    <button onClick={() => { setEval(null); setAnswer('') }} className="btn-secondary text-sm">Retry This Question</button>
                    <button onClick={() => { setActiveTab('history'); setHistoryLoaded(false) }} className="btn-ghost text-sm flex items-center gap-1.5"><History size={14} /> View in History</button>
                  </div>
                  {question.follow_up && (
                    <div className="mt-4 p-3 bg-[#0f1117] rounded-xl">
                      <p className="text-xs text-slate-500">Likely follow-up: <span className="text-slate-300 italic">"{question.follow_up}"</span></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!question && !loading && (
            <div className="card p-12 text-center">
              <MessagesSquare size={40} className="text-slate-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-100 mb-2">Ready to practice?</h2>
              <p className="text-sm text-slate-400 mb-6">Select your skill and level above, then click Start Interview to get your first question.</p>
            </div>
          )}
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div>
          {/* Stats bar */}
          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="card p-4 text-center border-white/5">
                <p className="text-2xl font-black text-brand-400">{history.length}</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1"><Layers size={10} /> Total Practiced</p>
              </div>
              <div className="card p-4 text-center border-white/5">
                <p className={`text-2xl font-black ${SCORE_COLOR(parseFloat(avgScore))}`}>{avgScore}</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1"><Star size={10} /> Avg Score /10</p>
              </div>
              <div className="card p-4 text-center border-white/5">
                <p className="text-2xl font-black text-green-400">
                  {history.filter(h => (h.evaluation?.score || 0) >= 7).length}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center justify-center gap-1"><Trophy size={10} /> Good or Better</p>
              </div>
            </div>
          )}

          {/* Refresh button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">
              {history.length > 0 ? `${history.length} practice session${history.length > 1 ? 's' : ''} — click any to expand` : ''}
            </p>
            <button
              onClick={fetchHistory}
              disabled={historyLoading}
              className="btn-ghost text-xs flex items-center gap-1.5 py-1.5"
            >
              {historyLoading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Refresh
            </button>
          </div>

          {/* List */}
          {historyLoading && (
            <div className="card p-12 text-center">
              <Loader2 size={28} className="animate-spin text-brand-400 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Loading your history…</p>
            </div>
          )}

          {!historyLoading && history.length === 0 && (
            <div className="card p-12 text-center">
              <History size={40} className="text-slate-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-100 mb-2">No history yet</h2>
              <p className="text-sm text-slate-400 mb-6">Complete your first interview practice session and your question, answer, and AI feedback will appear here.</p>
              <button onClick={() => setActiveTab('practice')} className="btn-primary text-sm">
                Start Practicing
              </button>
            </div>
          )}

          {!historyLoading && history.length > 0 && (
            <div className="space-y-3">
              {history.map(entry => (
                <HistoryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
