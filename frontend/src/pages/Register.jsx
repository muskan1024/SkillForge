import { useState,useMemo } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Eye,EyeOff,Check,X } from 'lucide-react'
import SkillForge_Logo_BG from '../assets/SkillForge_Logo_BG.png'

const PW_RULES = [
  { id: 'len',label: 'At least 8 characters',test: (p) => p.length >= 8 },
  { id: 'upper',label: 'One uppercase letter (A–Z)',test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',label: 'One lowercase letter (a–z)',test: (p) => /[a-z]/.test(p) },
  { id: 'num',label: 'One number (0–9)',test: (p) => /[0-9]/.test(p) },
  { id: 'spec',label: 'One special character (!@#…)',test: (p) => /[^A-Za-z0-9]/.test(p) },
]

const STRENGTH_LABEL = ['','Very weak','Weak','Fair','Strong','Very strong']
const STRENGTH_COLOR = ['','bg-red-500','bg-orange-500','bg-yellow-500','bg-emerald-400','bg-emerald-500']
const STRENGTH_TEXT = ['','text-red-400','text-orange-400','text-yellow-400','text-emerald-400','text-emerald-400']

export default function Register() {
  const [form,setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPw,setShowPw] = useState(false)
  const [showConfirmPw,setShowConfirmPw] = useState(false)
  const [pwFocused,setPwFocused] = useState(false)
  const [loading,setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm((prev) => ({ ...prev,[field]: e.target.value }))

  /* ── Password strength ── */
  const pwChecks = useMemo(() => PW_RULES.map((r) => ({ ...r,passed: r.test(form.password) })),[form.password])
  const pwStrength = pwChecks.filter((r) => r.passed).length   // 0–5
  const pwValid = pwStrength === PW_RULES.length

  /* ── Confirm password ── */
  const pwMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword
  const pwMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pwValid) { toast.error('Password does not meet all requirements'); return }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }

    setLoading(true)
    try {
      const payload = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        password: form.password,
      }
      const { data } = await api.post('/auth/register',payload)
      login(data.access_token,data.user)
      toast.success("Account created! Let's build your first roadmap.")
      navigate('/onboarding')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: '#0f1117' }}
    >
      <div className="w-full max-w-lg animate-slide-up">

        {/* ── Brand header ── */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <img src={SkillForge_Logo_BG} className="h-9" alt="SkillForge Logo" />
            <span className="font-bold text-xl text-slate-100 group-hover:text-white transition-colors">
              SkillForge
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Create your account</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Start your personalized learning journey today
          </p>
        </div>

        {/* ── Form card ── */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full name — two columns */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Your full name
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="input"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set('firstName')}
                  autoComplete="given-name"
                  required
                  minLength={2}
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set('lastName')}
                  autoComplete="family-name"
                  required
                  minLength={1}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Email address
              </label>
              <input
                className="input"
                type="email"
                placeholder="Enter your Email Address"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Password
              </label>

              {/* Input */}
              <div className="relative">
                <input
                  className="input pr-11"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={set('password')}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1.5">
                    {[1,2,3,4,5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwStrength ? STRENGTH_COLOR[pwStrength] : 'bg-slate-700/80'
                          }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${STRENGTH_TEXT[pwStrength]}`}>
                    {STRENGTH_LABEL[pwStrength]}
                  </p>
                </div>
              )}

              {/* Requirements checklist */}
              {(pwFocused || form.password.length > 0) && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-800/50 border border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {pwChecks.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-2 min-w-0">
                      <div
                        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${rule.passed ? 'bg-emerald-500/20' : 'bg-slate-700'
                          }`}
                      >
                        {rule.passed
                          ? <Check size={9} className="text-emerald-400" strokeWidth={3} />
                          : <X size={9} className="text-slate-500" strokeWidth={3} />
                        }
                      </div>
                      <span
                        className={`text-xs truncate transition-colors duration-200 ${rule.passed ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  className={`input pr-16 transition-colors duration-200 ${pwMatch ? 'border-emerald-500/50 focus:border-emerald-500' :
                      pwMismatch ? 'border-red-500/50    focus:border-red-500' : ''
                    }`}
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  autoComplete="new-password"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {form.confirmPassword.length > 0 && (
                    pwMatch
                      ? <Check size={14} className="text-emerald-400 flex-shrink-0" strokeWidth={3} />
                      : <X size={14} className="text-red-400    flex-shrink-0" strokeWidth={3} />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {pwMismatch && <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>}
              {pwMatch && <p className="mt-1.5 text-xs text-emerald-400">Passwords match ✓</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center !py-3 text-base font-semibold mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 hover:underline transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
