import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Loader2, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react'

const SKILLS = ['Python', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'Data Science',
  'DevOps', 'Docker & Kubernetes', 'Cloud Computing', 'SQL & Databases', 'Java', 'DSA & Problem Solving',
  'Web Development', 'TypeScript', 'Go', 'Cybersecurity']

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']

const GOALS = [
  'Get job-ready',
  'Crack interviews',
  'Build real-world projects',
  'Improve coding skills',
  'Learn fundamentals',
  'Transition careers',
]

const TIMELINES = ['1 Month', '2 Months', '3 Months', '6 Months']

const STEPS = ['Skills', 'Level', 'Goal', 'Timeline', 'Generate']

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    skills: [],
    skill_level: '',
    learning_goal: '',
    custom_goal: '',
    timeline: '',
  })
  const [customSkill, setCustomSkill] = useState('')

  const toggleSkill = (s) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s]
    }))
  }

  const handleAddCustomSkill = (e) => {
    e.preventDefault()
    if (!customSkill.trim()) return
    const skill = customSkill.trim()
    if (!form.skills.includes(skill)) {
      setForm(p => ({ ...p, skills: [...p.skills, skill] }))
    }
    setCustomSkill('')
  }

  const canNext = () => {
    if (step === 0) return form.skills.length > 0
    if (step === 1) return !!form.skill_level
    if (step === 2) return !!(form.learning_goal || form.custom_goal)
    if (step === 3) return !!form.timeline
    return true
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const payload = {
        skills: form.skills,
        skill_level: form.skill_level,
        learning_goal: form.learning_goal || 'Build skills',
        timeline: form.timeline,
        custom_goal: form.custom_goal || null,
      }
      const { data } = await api.post('/roadmaps/generate', payload)
      toast.success('Roadmap generated!')
      navigate(`/roadmaps/${data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Generation failed. Check your API key.')
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100">Build your learning roadmap</h1>
        <p className="text-zinc-400 mt-1 text-sm">Answer a few questions and AI will craft your personalized path</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all ${i < step ? 'bg-brand-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.4)]' :
                i === step ? 'bg-brand-500/20 text-brand-300 ring-2 ring-brand-500/50' :
                  'bg-white/5 text-zinc-500 border border-white/10'
              }`}>
              {i < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? 'text-brand-300' : 'text-zinc-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-brand-500/50' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="card p-8 min-h-72">
        {/* Step 0 — Skills */}
        {step === 0 && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">What do you want to learn?</h2>
            <p className="text-sm text-zinc-400 mb-5">Select one or more skills</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from(new Set([...SKILLS, ...form.skills])).map(s => (
                <button type="button" key={s} onClick={() => toggleSkill(s)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${form.skills.includes(s)
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}>
                  {s}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddCustomSkill}>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Or add a custom skill</label>
              <div className="flex gap-2">
                <input className="input text-sm flex-1" placeholder="e.g. Rust, UI/UX Design..."
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)} />
                <button type="submit" disabled={!customSkill.trim()}
                  className="btn-secondary px-4 py-2 text-sm whitespace-nowrap disabled:opacity-50">
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 1 — Level */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">What's your current level?</h2>
            <p className="text-sm text-zinc-400 mb-5">Be honest — this helps calibrate your roadmap</p>
            <div className="space-y-3">
              {LEVELS.map(l => (
                <button key={l} onClick={() => setForm(p => ({ ...p, skill_level: l }))}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-medium transition-all ${form.skill_level === l
                      ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/10'
                    }`}>
                  <span>{l}</span>
                  {form.skill_level === l && <Check size={16} className="text-brand-300" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Goal */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">What's your goal?</h2>
            <p className="text-sm text-zinc-400 mb-5">Pick one or write your own</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {GOALS.map(g => (
                <button key={g} onClick={() => setForm(p => ({ ...p, learning_goal: g, custom_goal: '' }))}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${form.learning_goal === g
                      ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/10'
                    }`}>
                  {g}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Or describe your own goal</label>
              <input className="input text-sm" placeholder="e.g. Build a full-stack SaaS product..."
                value={form.custom_goal}
                onChange={e => setForm(p => ({ ...p, custom_goal: e.target.value, learning_goal: '' }))} />
            </div>
          </div>
        )}

        {/* Step 3 — Timeline */}
        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">How much time do you have?</h2>
            <p className="text-sm text-zinc-400 mb-5">Your roadmap will be structured around this timeline</p>
            <div className="grid grid-cols-2 gap-3">
              {TIMELINES.map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, timeline: t }))}
                  className={`px-4 py-4 rounded-xl text-sm font-medium border text-center transition-all ${form.timeline === t
                      ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                      : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/10'
                    }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Ready to generate your roadmap</h2>
            <p className="text-sm text-zinc-400 mb-6">Here's a summary of your learning profile</p>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Skills', value: form.skills.join(', ') },
                { label: 'Level', value: form.skill_level },
                { label: 'Goal', value: form.custom_goal || form.learning_goal },
                { label: 'Timeline', value: form.timeline },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4 py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-zinc-500 w-20 shrink-0">{label}</span>
                  <span className="text-sm font-medium text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Generating your roadmap…</>
              ) : (
                <><Sparkles size={18} /> Generate my roadmap</>
              )}
            </button>
            {loading && (
              <p className="text-xs text-zinc-500 text-center mt-3">This may take 10–20 seconds…</p>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="btn-ghost flex items-center gap-1.5 text-sm disabled:opacity-30">
            <ChevronLeft size={16} /> Back
          </button>
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            className="btn-primary flex items-center gap-1.5 text-sm">
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
