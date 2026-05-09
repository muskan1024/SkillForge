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
    <div className="relative max-w-4xl mx-auto py-8 px-4 sm:px-0">
      <div className="absolute top-8 bottom-8 left-[35px] sm:left-1/2 sm:-translate-x-1/2 w-1.5 bg-[#1e2130] rounded-full" />
      
      <div className="space-y-8 sm:space-y-12">
        {topics.map((topic, i) => {
          const isCurrent = i === currentIndex
          const isDone = topic.completed
          
          return (
            <div key={topic.id} className="relative flex flex-col sm:flex-row items-start sm:items-center w-full group sm:even:flex-row-reverse">
              <div className={`absolute left-[35px] sm:left-1/2 w-10 h-10 rounded-full border-4 border-[#1a1c26] z-10 flex items-center justify-center -translate-x-[17px] sm:-translate-x-1/2 transition-colors duration-300 ${isDone ? 'bg-green-500' : isCurrent ? 'bg-brand-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-[#2a2d3e] group-hover:bg-[#3b3f54]'}`}>
                {isDone ? <Check size={16} className="text-white" /> : <span className="text-sm font-bold text-white">{i + 1}</span>}
              </div>

              <div className="hidden sm:block sm:w-1/2" />

              <div className="w-full pl-[70px] sm:pl-0 sm:w-1/2 sm:px-8">
                <div onClick={() => onTopicClick(topic)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDone ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/50' : isCurrent ? 'bg-brand-500/10 border-brand-500 shadow-lg shadow-brand-500/20' : 'bg-[#1e2130] border-transparent hover:border-brand-500/30'}`}>
                  {isCurrent && (
                    <div className="absolute -top-3 right-4 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <MapPin size={10} /> You are here
                    </div>
                  )}
                  <h3 className={`text-base font-bold mb-1 leading-tight ${isCurrent ? 'text-brand-300' : isDone ? 'text-green-400' : 'text-slate-100'}`}>{topic.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 leading-none">
                    <span className="flex items-center gap-1"><Clock size={12} /> {topic.estimated_hours}h</span>
                    <span className="flex items-center gap-1">Week {topic.week}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${isDone ? 'bg-green-500/20 text-green-400' : isCurrent ? 'bg-brand-500/20 text-brand-300' : 'bg-[#2a2d3e] text-slate-400'}`}>{topic.difficulty}</span>
                  </div>
                </div>
              </div>
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
  const [showResources, setShowResources] = useState(false)
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
                <TopicNotes topicId={topic.id} roadmapId={roadmapId} />
                
                {topic.resources?.length > 0 && (
                  <div>
                    <button onClick={() => setShowResources(!showResources)} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-brand-400 transition-colors mb-2">
                      <ExternalLink size={14} /> {showResources ? 'Hide Additional Resources' : 'Show Additional Resources'}
                    </button>
                    {showResources && (
                      <div className="flex flex-wrap gap-2 mt-2 animate-fade-in">
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
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-1 border-t border-white/5">
                  <button onClick={() => onLearn(topic, index)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    <BookOpen size={13} /> Learn
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

  const exportRoadmapImage = () => {
    const printWindow = window.open('', '_blank');

    const topicsHTML = roadmap.topics.map((topic, i) => {
      const isDone = topic.completed;
      const isCurrent = i === roadmap.current_topic_index && roadmap.progress_percent < 100;
      const isEven = i % 2 === 0;

      const dotColor = isDone ? '#22c55e' : isCurrent ? '#6366f1' : '#374151';
      const cardBg = isDone ? '#052e16' : isCurrent ? '#1e1b4b' : '#1e2130';
      const cardBorder = isDone ? '#166534' : isCurrent ? '#6366f1' : '#374151';
      const titleColor = isCurrent ? '#a5b4fc' : isDone ? '#4ade80' : '#f1f5f9';
      const badgeBg = isDone ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(99,102,241,0.2)' : '#374151';
      const badgeColor = isDone ? '#4ade80' : isCurrent ? '#a5b4fc' : '#94a3b8';

      return `
        <div style="display:flex; align-items:center; margin-bottom:36px; position:relative; flex-direction:${isEven ? 'row' : 'row-reverse'};">
          <div style="flex:1;">&nbsp;</div>
          <div style="width:44px; display:flex; justify-content:center; flex-shrink:0;">
            <div style="width:40px; height:40px; border-radius:50%; background:${dotColor}; color:white; font-size:14px; font-weight:700; display:flex; align-items:center; justify-content:center; border:4px solid #0f1117; position:relative; z-index:2; box-shadow:${isCurrent ? '0 0 12px rgba(99,102,241,0.6)' : 'none'};">
              ${isDone ? '✓' : i + 1}
            </div>
          </div>
          <div style="flex:1; padding:0 28px;">
            <div style="background:${cardBg}; border:2px solid ${cardBorder}; border-radius:16px; padding:18px 20px; position:relative;">
              ${isCurrent ? `<div style="position:absolute; top:-12px; right:14px; background:#6366f1; color:white; font-size:9px; font-weight:700; padding:3px 10px; border-radius:999px; letter-spacing:0.5px; text-transform:uppercase;">📍 You are here</div>` : ''}
              <div style="font-size:15px; font-weight:700; color:${titleColor}; margin-bottom:8px; line-height:1.3;">${topic.name}</div>
              <div style="display:flex; align-items:center; gap:12px; font-size:12px; color:#64748b;">
                <span>⏱ ${topic.estimated_hours}h</span>
                <span>Week ${topic.week}</span>
                <span style="background:${badgeBg}; color:${badgeColor}; padding:3px 10px; border-radius:999px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${topic.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${roadmap.title} - Roadmap</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f1117; color: #e2e8f0; padding: 40px 20px; margin: 0; }
    .header { text-align: center; margin-bottom: 48px; }
    .timeline { position: relative; max-width: 780px; margin: 0 auto; }
    .spine { position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; background: #1e2130; transform: translateX(-50%); border-radius: 9px; }
    @media print {
      body { background: #0f1117 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { size: A4 portrait; margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="font-size:26px; font-weight:700; color:#a5b4fc; margin:0 0 8px 0;">${roadmap.title}</h1>
    <p style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:1px; margin:0 0 6px 0;">${roadmap.skill_level} · ${roadmap.timeline}</p>
    <p style="font-size:13px; color:#94a3b8; margin:0;">${roadmap.learning_goal}</p>
  </div>
  <div class="timeline">
    <div class="spine"></div>
    ${topicsHTML}
  </div>
  <script>
    window.onload = function() {
      var s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = function() {
        // Wait for fonts to paint
        setTimeout(function() {
          var W = document.body.scrollWidth;
          var H = document.body.scrollHeight;
          html2canvas(document.body, {
            scale: 2,
            backgroundColor: '#0f1117',
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: W,
            windowHeight: H,
            width: W,
            height: H
          }).then(function(canvas) {
            var link = document.createElement('a');
            link.download = '${roadmap.title.replace(/\\s+/g, '-')}-Roadmap.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            setTimeout(function() { window.close(); }, 1500);
          });
        }, 800);
      };
      document.head.appendChild(s);
    };
  <\/script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-100">Your Learning Journey</h2>
            <button onClick={exportRoadmapImage} className="btn-secondary flex items-center gap-2 text-xs py-1.5 px-3">
              <Download size={14} /> Download Map
            </button>
          </div>
          <div id="graphical-roadmap-export-container" className="bg-[#1a1c26] p-6 rounded-xl border border-white/5">
            <GraphicalRoadmap
              topics={roadmap.topics}
              currentIndex={roadmap.current_topic_index}
              onTopicClick={(t) => { setViewMode('list'); setTimeout(() => document.getElementById(`topic-${t.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100) }}
            />
          </div>
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
