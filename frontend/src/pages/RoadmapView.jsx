import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import {
  CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
  ExternalLink, Youtube, BookOpen, Code2, PlayCircle,
  Loader2, Trash2, ArrowLeft, MapPin, Star, Bot,
  FileText, StickyNote, Download, X, Check, AlertCircle
} from 'lucide-react'

const RESOURCE_ICONS = {
  youtube: { icon: Youtube, color: 'text-red-500 bg-red-500/10' },
  docs: { icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
  course: { icon: PlayCircle, color: 'text-purple-500 bg-purple-500/10' },
  practice: { icon: Code2, color: 'text-green-500 bg-green-500/10' },
}
const DIFF_COLORS = {
  Beginner: 'bg-green-500/10 text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-400',
  Advanced: 'bg-red-500/10 text-red-400',
}

/* ── Quiz Modal ──────────────────────────────────────────────── */
function QuizModal({ topic, roadmapId, onClose, onPassed }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.post('/quiz/generate', {
      roadmap_id: roadmapId, topic_id: topic.id,
      topic_name: topic.name, subtopics: topic.subtopics || [],
      difficulty: topic.difficulty || 'Beginner'
    }).then(r => { setQuestions(r.data.questions); setLoading(false) })
      .catch(() => { toast.error('Quiz generation failed'); onClose() })
  }, [])

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions'); return
    }
    setSubmitting(true)
    try {
      const ans = questions.map((_, i) => answers[i] ?? -1)
      const res = await api.post('/quiz/submit', {
        roadmap_id: roadmapId, topic_id: topic.id,
        answers: ans, questions
      })
      setResult(res.data)
      if (res.data.passed) onPassed(res.data)
    } catch { toast.error('Submission failed') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1c26] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-[#1a1c26] border-b border-white/5 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-semibold text-slate-100">Quiz: {topic.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Score 60%+ to auto-complete this topic</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1e2130] rounded-xl text-slate-500"><X size={18} /></button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 size={32} className="text-brand-500 animate-spin mb-3" />
              <p className="text-sm text-slate-400">Generating quiz questions…</p>
            </div>
          ) : result ? (
            <div className="text-center py-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {result.passed ? <Check size={36} className="text-green-600" /> : <X size={36} className="text-red-500" />}
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-1">{result.score}%</h3>
              <p className="text-slate-400 mb-2">{result.correct}/{result.total} correct</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-6 ${result.passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {result.passed ? <><Check size={15} /> Topic completed! +15 XP</> : <><AlertCircle size={15} /> Need 60% to pass — try again</>}
              </div>
              {/* Answer review */}
              <div className="text-left space-y-4 mt-6">
                {questions.map((q, i) => {
                  const userAns = result.answers[i]
                  const correct = q.correct
                  const isRight = userAns === correct
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${isRight ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-200'}`}>
                      <p className="text-sm font-medium text-slate-100 mb-2">{i + 1}. {q.question}</p>
                      <p className={`text-xs mb-1 ${isRight ? 'text-green-400' : 'text-red-400'}`}>
                        Your answer: {q.options[userAns] || 'Not answered'}
                      </p>
                      {!isRight && <p className="text-xs text-green-400">Correct: {q.options[correct]}</p>}
                      {q.explanation && <p className="text-xs text-slate-400 mt-2 italic">{q.explanation}</p>}
                    </div>
                  )
                })}
              </div>
              <button onClick={onClose} className="btn-primary mt-6">{result.passed ? 'Continue Learning' : 'Close & Review'}</button>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, qi) => (
                <div key={qi} className="p-4 bg-[#0f1117] rounded-xl">
                  <p className="text-sm font-semibold text-slate-100 mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${answers[qi] === oi ? 'bg-brand-500/10 border-brand-500' : 'bg-[#1e2130] border-white/5 hover:border-brand-500/20'}`}>
                        <input type="radio" name={`q${qi}`} className="hidden" onChange={() => setAnswers(p => ({ ...p, [qi]: oi }))} />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[qi] === oi ? 'border-brand-500 bg-brand-500/100' : 'border-white/8'}`}>
                          {answers[qi] === oi && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm text-slate-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={handleSubmit} disabled={submitting || Object.keys(answers).length < questions.length}
                className="btn-primary w-full justify-center">
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : 'Submit Quiz'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Study Notes Modal ───────────────────────────────────────── */
function NotesModal({ topic, onClose }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.post('/features/study-notes', {
      topic_name: topic.name, subtopics: topic.subtopics || [], difficulty: topic.difficulty
    }).then(r => { setNotes(r.data.notes); setLoading(false) })
      .catch(() => { toast.error('Notes generation failed'); onClose() })
  }, [])

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank')
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>${topic.name} - Study Notes</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; color: #0f1117; line-height: 1.8; white-space: pre-wrap; }
  h1 { color: #4f4fe8; } code { background: #f0f4ff; padding: 2px 6px; border-radius: 4px; }
  pre { background: #1e1e2e; color: #4ade80; padding: 16px; border-radius: 8px; overflow-x: auto; }
</style></head>
<body>${notes.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body></html>`
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 400)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1c26] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-100">Study Notes: {topic.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-generated comprehensive notes</p>
          </div>
          <div className="flex items-center gap-2">
            {!loading && <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2 text-xs py-2"><Download size={14} /> Download</button>}
            <button onClick={onClose} className="p-2 hover:bg-[#1e2130] rounded-xl text-slate-500"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <Loader2 size={32} className="text-brand-500 animate-spin mb-3" />
              <p className="text-sm text-slate-400">Generating study notes…</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">{notes}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Per-Topic User Notes ─────────────────────────────────────── */
function TopicNotes({ topicId, roadmapId }) {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(true)
  const timer = useRef(null)

  useEffect(() => {
    api.get(`/notes/${roadmapId}/${topicId}`).then(r => setNote(r.data.content || ''))
  }, [topicId])

  const handleChange = (val) => {
    setNote(val); setSaved(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      await api.post('/notes/', { roadmap_id: roadmapId, topic_id: topicId, content: val })
      setSaved(true)
    }, 1000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Notes</p>
        <span className={`text-[10px] ${saved ? 'text-green-500' : 'text-slate-500'}`}>{saved ? '✓ Saved' : 'Saving…'}</span>
      </div>
      <textarea value={note} onChange={e => handleChange(e.target.value)} rows={3}
        className="w-full input text-xs resize-none"
        placeholder="Write your personal notes for this topic…" />
    </div>
  )
}

/* ── Graphical Roadmap View ──────────────────────────────────── */
function GraphicalRoadmap({ topics, currentIndex, onTopicClick }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex flex-col items-center gap-0 min-w-max mx-auto">
        {topics.map((topic, i) => {
          const isCurrent = i === currentIndex
          const isDone = topic.completed
          return (
            <div key={topic.id} className="flex flex-col items-center">
              <div onClick={() => onTopicClick(topic)}
                className={`relative cursor-pointer w-56 sm:w-64 rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${isDone ? 'bg-green-500/10 border-green-500/30 hover:border-green-500' :
                    isCurrent ? 'bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/20' :
                      'bg-[#1e2130] border-white/5 hover:border-brand-500/30'
                  }`}>
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <MapPin size={9} /> You are here
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isDone ? 'bg-green-500/100 text-white' : isCurrent ? 'bg-brand-600 text-white' : 'bg-[#2a2d3e] text-slate-500'
                    }`}>
                    {isDone ? <Check size={13} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-brand-300' : isDone ? 'text-green-400' : 'text-slate-100'}`}>{topic.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Week {topic.week} · {topic.estimated_hours}h</p>
                  </div>
                </div>
              </div>
              {i < topics.length - 1 && (
                <div className={`w-0.5 h-6 ${topics[i + 1]?.completed ? 'bg-green-400' : i < currentIndex ? 'bg-green-300' : 'bg-[#2a2d3e]'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Topic Card ──────────────────────────────────────────────── */
function TopicCard({ topic, index, isCurrent, onQuiz, onAskAI, onNotes, roadmapId, onLearn }) {
  const [open, setOpen] = useState(isCurrent)
  useEffect(() => { if (isCurrent) setOpen(true) }, [isCurrent])

  return (
    <div id={`topic-${topic.id}`} className={`rounded-2xl border-2 transition-all duration-200 ${isCurrent ? 'border-brand-500 shadow-md shadow-brand-500/10 bg-[#1e2130]' :
        topic.completed ? 'border-transparent bg-[#0f1117]' : 'border-white/5 bg-[#1e2130]'
      }`}>
      {isCurrent && (
        <div className="bg-brand-600 text-white px-4 py-2 rounded-t-2xl flex items-center gap-2 text-xs font-medium">
          <MapPin size={13} /> You are here <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse ml-1" />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${topic.completed ? 'bg-green-500/100 text-white' : isCurrent ? 'bg-brand-600 text-white' : 'bg-[#2a2d3e] text-slate-500'
            }`}>
            {topic.completed ? <Check size={13} /> : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-slate-500">Week {topic.week} · {topic.day_range}</span>
                  <span className={`badge text-[10px] ${DIFF_COLORS[topic.difficulty] || 'bg-[#1e2130] text-slate-400'}`}>{topic.difficulty}</span>
                  {topic.quiz_score !== undefined && (
                    <span className="badge bg-green-500/10 text-green-400 text-[10px]">Quiz: {topic.quiz_score}%</span>
                  )}
                </div>
                <h3 className={`font-semibold text-sm sm:text-base ${topic.completed ? 'text-slate-500 line-through' : isCurrent ? 'text-brand-300' : 'text-slate-100'}`}>{topic.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 text-xs text-slate-500"><Clock size={11} />{topic.estimated_hours}h</span>
                <button onClick={() => setOpen(!open)} className="text-slate-500 hover:text-slate-300 p-1">
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {open && (
              <div className="mt-4 space-y-4 animate-slide-up">
                {topic.description && <p className="text-sm text-slate-400 leading-relaxed">{topic.description}</p>}
                {topic.subtopics?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subtopics</p>
                    <ul className="space-y-1">
                      {topic.subtopics.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {topic.resources?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.resources.map((r, i) => {
                        const meta = RESOURCE_ICONS[r.type] || RESOURCE_ICONS.docs
                        const Icon = meta.icon
                        return (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${meta.color} hover:opacity-80`}>
                            <Icon size={12} />{r.title}<ExternalLink size={10} />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
                <TopicNotes topicId={topic.id} roadmapId={roadmapId} />
                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                  <button onClick={() => onLearn(topic, index)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <BookOpen size={13} /> Learn
                  </button>
                  {!topic.completed && (
                    <button onClick={() => onQuiz(topic)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-medium transition-all">
                      <Star size={13} /> Take Quiz to Complete
                    </button>
                  )}
                  <button onClick={() => onNotes(topic)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/10 hover:bg-purple-100 border border-purple-500/20 text-purple-400 rounded-xl text-xs font-medium transition-all">
                    <FileText size={13} /> Study Notes
                  </button>
                  <button onClick={() => onAskAI(topic)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-brand-500/10 hover:bg-brand-500/15 border border-brand-500/20 text-brand-300 rounded-xl text-xs font-medium transition-all">
                    <Bot size={13} /> Ask AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main RoadmapView ────────────────────────────────────────── */
export default function RoadmapView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [quizTopic, setQuizTopic] = useState(null)
  const [notesTopic, setNotesTopic] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'graph'

  useEffect(() => {
    api.get(`/roadmaps/${id}`)
      .then(r => { setRoadmap(r.data); setLoading(false) })
      .catch(() => { toast.error('Roadmap not found'); navigate('/roadmaps') })
  }, [id])

  const handleQuizPassed = (result) => {
    setRoadmap(prev => ({
      ...prev,
      topics: prev.topics.map(t => t.id === quizTopic.id ? { ...t, completed: true, quiz_score: result.score } : t),
      completed_topics: result.completed_topics ?? prev.completed_topics,
      progress_percent: result.progress_percent ?? prev.progress_percent,
      current_topic_index: result.current_topic_index ?? prev.current_topic_index,
    }))
    toast.success(`Topic completed! Score: ${result.score}% 🎉`, { icon: '⭐' })
  }

  const handleAskAI = (topic) => {
    const prompt = `Explain the topic "${topic.name}" in detail. Cover: ${topic.subtopics?.join(', ') || 'key concepts'}. I'm at ${topic.difficulty} level.`
    navigate(`/chat?prompt=${encodeURIComponent(prompt)}&roadmap=${id}`)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this roadmap?')) return
    setDeleting(true)
    try { await api.delete(`/roadmaps/${id}`); toast.success('Deleted'); navigate('/roadmaps') }
    catch { toast.error('Delete failed'); setDeleting(false) }
  }

  const exportPDF = () => {
    if (!roadmap) return
    let content = `${roadmap.title}\n${'='.repeat(60)}\nGoal: ${roadmap.learning_goal}\nLevel: ${roadmap.skill_level} | Timeline: ${roadmap.timeline}\nProgress: ${roadmap.progress_percent}%\n\n`
    roadmap.topics.forEach((t, i) => {
      content += `${i + 1}. ${t.name} [${t.completed ? '✓ Done' : 'Pending'}]\n   Week ${t.week} | ${t.estimated_hours}h | ${t.difficulty}\n   Subtopics: ${t.subtopics?.join(', ')}\n\n`
    })
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `${roadmap.title.replace(/\s+/g, '-')}-roadmap.txt`; a.click()
    toast.success('Roadmap exported!')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-brand-500 animate-spin" /></div>
  if (!roadmap) return null

  const weeks = [...new Set(roadmap.topics.map(t => t.week))].sort((a, b) => a - b)

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {quizTopic && <QuizModal topic={quizTopic} roadmapId={id} onClose={() => setQuizTopic(null)} onPassed={(r) => { handleQuizPassed(r); setQuizTopic(null) }} />}
      {notesTopic && <NotesModal topic={notesTopic} onClose={() => setNotesTopic(null)} />}

      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 text-sm mb-6 -ml-2">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card p-5 sm:p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="badge bg-brand-500/10 text-brand-300">{roadmap.skill_level}</span>
              <span className="badge bg-[#1e2130] text-slate-400">{roadmap.timeline}</span>
              {roadmap.progress_percent >= 100 && <span className="badge bg-green-500/10 text-green-400">✓ Completed</span>}
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-100">{roadmap.title}</h1>
            <p className="text-sm text-slate-400 mt-1">Goal: {roadmap.learning_goal}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={exportPDF} title="Export" className="p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 rounded-xl transition-colors">
              <Download size={18} />
            </button>
            <button onClick={handleDelete} disabled={deleting} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
              {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300 font-medium">{roadmap.completed_topics}/{roadmap.total_topics} topics</span>
          <span className="text-sm font-semibold text-brand-400">{roadmap.progress_percent}%</span>
        </div>
        <div className="h-3 bg-[#1e2130] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700" style={{ width: `${roadmap.progress_percent}%` }} />
        </div>
        {/* View toggle */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'bg-[#1e2130] text-slate-300 hover:bg-[#2a2d3e]'}`}>List View</button>
          <button onClick={() => setViewMode('graph')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'graph' ? 'bg-brand-600 text-white' : 'bg-[#1e2130] text-slate-300 hover:bg-[#2a2d3e]'}`}>Visual Map</button>
        </div>
      </div>

      {/* Graphical View */}
      {viewMode === 'graph' && (
        <div className="card p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-100 mb-6 text-center">Your Learning Journey</h2>
          <GraphicalRoadmap
            topics={roadmap.topics}
            currentIndex={roadmap.current_topic_index}
            onTopicClick={(t) => { setViewMode('list'); setTimeout(() => document.getElementById(`topic-${t.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100) }}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && weeks.map(week => (
        <div key={week} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Week {week}</span>
            <div className="flex-1 h-px bg-[#2a2d3e]" />
          </div>
          <div className="space-y-3">
            {roadmap.topics.filter(t => t.week === week).map(topic => {
              const globalIndex = roadmap.topics.findIndex(t => t.id === topic.id)
              const isCurrent = globalIndex === roadmap.current_topic_index && roadmap.progress_percent < 100
              return (
                <TopicCard key={topic.id} topic={topic} index={globalIndex}
                  isCurrent={isCurrent} roadmapId={id}
                  onQuiz={setQuizTopic} onNotes={setNotesTopic} onAskAI={handleAskAI}
                  onLearn={(t, i) => navigate(`/learn/${id}/${i}`)} />
              )
            })}
          </div>
        </div>
      ))}

      {roadmap.progress_percent >= 100 && (
        <div className="card p-8 text-center mt-4">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Roadmap complete!</h2>
          <p className="text-sm text-slate-400 mb-4">You've mastered all topics. Ready for the next challenge?</p>
          <button onClick={() => navigate('/onboarding')} className="btn-primary inline-flex items-center gap-2"><Star size={16} /> New roadmap</button>
        </div>
      )}
    </div>
  )
}
