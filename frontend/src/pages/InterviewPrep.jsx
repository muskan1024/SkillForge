import { useState } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Brain, Loader2, RefreshCw, ChevronRight, CheckCircle2, XCircle, Star, Mic, Code2, Users, Sparkles, ChevronDown } from 'lucide-react'

const SKILLS = ['Python','JavaScript','React','Node.js','Java','DevOps','Machine Learning','SQL','Data Science','TypeScript','DSA','Web Development']
const LEVELS = ['Beginner','Intermediate','Advanced']
const Q_TYPES = [
  { id: 'technical',   icon: Code2,  label: 'Technical',   desc: 'Concepts & theory' },
  { id: 'coding',      icon: Brain,  label: 'Coding',      desc: 'Problem solving' },
  { id: 'behavioral',  icon: Users,  label: 'Behavioral',  desc: 'Soft skills & experience' },
]

const VERDICT_COLORS = {
  Excellent:         'bg-green-500/10 border-green-500/20 text-green-400',
  Good:              'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'Needs Improvement':'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  Poor:              'bg-red-500/10 border-red-500/20 text-red-400',
}

export default function InterviewPrep() {
  const [skill, setSkill]         = useState('Python')
  const [level, setLevel]         = useState('Beginner')
  const [qType, setQType]         = useState('technical')
  const [question, setQuestion]   = useState(null)
  const [answer, setAnswer]       = useState('')
  const [evaluation, setEval]     = useState(null)
  const [loading, setLoading]     = useState(false)
  const [evalLoading, setEvalL]   = useState(false)
  const [sessionCount, setCount]  = useState(0)

  const getQuestion = async () => {
    setLoading(true); setQuestion(null); setAnswer(''); setEval(null)
    try {
      const { data } = await api.post('/features/interview/question', { skill, level, question_type: qType })
      setQuestion(data); setCount(c => c + 1)
    } catch { toast.error('Failed to generate question') }
    finally { setLoading(false) }
  }

  const submitAnswer = async () => {
    if (!answer.trim()) { toast.error('Please write an answer'); return }
    setEvalL(true)
    try {
      const { data } = await api.post('/features/interview/evaluate', { question: question.question, answer, skill, level })
      setEval(data)
    } catch { toast.error('Evaluation failed') }
    finally { setEvalL(false) }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <Brain size={22} className="text-brand-400"/> Interview Prep
        </h1>
        <p className="text-slate-400 mt-1 text-sm">AI-powered mock interviews tailored to your skill and level</p>
      </div>

      {/* Config */}
      <div className="card p-5 sm:p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-100 mb-4">Configure your mock interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Skill</label>
            <div className="relative">
              <select className="input text-sm appearance-none cursor-pointer pr-10" value={skill} onChange={e => setSkill(e.target.value)}>
                {SKILLS.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Level</label>
            <div className="relative">
              <select className="input text-sm appearance-none cursor-pointer pr-10" value={level} onChange={e => setLevel(e.target.value)}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Question Type</label>
            <div className="flex gap-2">
              {Q_TYPES.map(t => (
                <button key={t.id} onClick={() => setQType(t.id)}
                  className={`flex-1 h-[46px] rounded-xl border text-xs font-medium transition-all flex items-center justify-center ${qType===t.id ? 'bg-brand-600 text-white border-brand-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={getQuestion} disabled={loading}
          className="btn-primary flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin"/> Generating…</> : <><RefreshCw size={16}/> {question ? 'Next Question' : 'Start Interview'}</>}
        </button>
        {sessionCount > 0 && <p className="text-xs text-slate-500 mt-2">{sessionCount} question{sessionCount>1?'s':''} practiced this session</p>}
      </div>

      {/* Question */}
      {question && (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-brand-500/10 text-brand-400">{question.type}</span>
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
                placeholder="Type your answer here. Be thorough — the AI will evaluate your response…"/>
              <button onClick={submitAnswer} disabled={evalLoading || !answer.trim()} className="btn-primary flex items-center gap-2">
                {evalLoading ? <><Loader2 size={16} className="animate-spin"/> Evaluating…</> : <><Star size={16}/> Get AI Feedback</>}
              </button>
            </div>
          )}

          {evaluation && (
            <div className="card p-5 sm:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-slate-100">AI Feedback</h3>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-100">{evaluation.score}<span className="text-sm text-slate-500">/10</span></p>
                  </div>
                  <span className={`badge border ${VERDICT_COLORS[evaluation.verdict] || 'bg-[#1e2130] text-slate-400'}`}>{evaluation.verdict}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {evaluation.strengths?.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1"><CheckCircle2 size={13}/> Strengths</p>
                    <ul className="space-y-1.5">{evaluation.strengths.map((s,i) => <li key={i} className="text-xs text-green-200/80 flex items-start gap-1.5"><span className="text-green-400 shrink-0">•</span> {s}</li>)}</ul>
                  </div>
                )}
                {evaluation.gaps?.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle size={13}/> Gaps</p>
                    <ul className="space-y-1.5">{evaluation.gaps.map((g,i) => <li key={i} className="text-xs text-red-200/80 flex items-start gap-1.5"><span className="text-red-400 shrink-0">•</span> {g}</li>)}</ul>
                  </div>
                )}
              </div>
              {evaluation.ideal_answer_points?.length > 0 && (
                <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-brand-400 mb-2 flex items-center gap-1.5"><Star size={13} /> Ideal Answer Should Include</p>
                  <ul className="space-y-1.5">{evaluation.ideal_answer_points.map((p,i) => <li key={i} className="text-xs text-brand-200/80 flex items-start gap-1.5"><span className="text-brand-400 shrink-0">•</span> {p}</li>)}</ul>
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
                <button onClick={getQuestion} className="btn-primary flex items-center gap-2 text-sm"><RefreshCw size={15}/> Next Question</button>
                <button onClick={() => { setEval(null); setAnswer('') }} className="btn-secondary text-sm">Retry This Question</button>
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
          <Brain size={40} className="text-slate-500 mx-auto mb-4"/>
          <h2 className="text-lg font-semibold text-slate-100 mb-2">Ready to practice?</h2>
          <p className="text-sm text-slate-400 mb-6">Select your skill and level above, then click Start Interview to get your first question.</p>
        </div>
      )}
    </div>
  )
}
