import { Link } from 'react-router-dom'
import { Zap, Map, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-surface-3 px-8 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-ink-primary">SkillForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center animate-fade-in">
        <div className="badge bg-brand-50 text-brand-700 mb-6 mx-auto">
          <Zap size={12} />
          Powered by AI · Free to use
        </div>
        <h1 className="text-5xl font-semibold text-ink-primary leading-tight mb-6 tracking-tight">
          Your personalized<br />
          <span className="text-brand-600">learning roadmap</span>
        </h1>
        <p className="text-xl text-ink-tertiary mb-10 max-w-2xl mx-auto leading-relaxed">
          Tell us what you want to learn, your level, and your timeline.
          SkillForge generates a structured, week-by-week learning path with curated free resources.
        </p>
        <div className="flex items-center gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Start learning free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-6 py-3">Sign in</Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 pb-24 grid grid-cols-3 gap-6">
        {[
          { icon: Zap, title: 'AI-Generated Paths', desc: 'Gemini AI creates a custom week-by-week plan based on your skills, level, and goals.' },
          { icon: Map, title: 'Track Your Progress', desc: 'Mark topics as complete. See exactly where you are and what comes next.' },
          { icon: TrendingUp, title: 'Streak & XP System', desc: 'Stay motivated with daily streaks and experience points as you complete topics.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 animate-slide-up">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <Icon size={20} className="text-brand-600" />
            </div>
            <h3 className="font-semibold text-ink-primary mb-2">{title}</h3>
            <p className="text-sm text-ink-tertiary leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
