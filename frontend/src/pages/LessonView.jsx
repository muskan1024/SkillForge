import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import {
  ArrowLeft, ArrowRight, BookOpen, Loader2, CheckCircle,
  XCircle, ChevronDown, ChevronUp, Star, Trophy, RotateCcw,
  Lightbulb, Code2, AlertTriangle, HelpCircle, MapPin,
  FileText, Download, X
} from 'lucide-react'

/* ── Code Block ── */
function CodeBlock({ snippet, language }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 my-3">
      <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#0d0f14' }}>
        <Code2 size={13} className="text-brand-400" />
        <span className="text-xs text-slate-500 font-mono">{language || 'code'}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ background: '#0a0b10', color: '#a5f3fc' }}>
        {snippet}
      </pre>
    </div>
  )
}

/* ── Lesson Page Content ── */
function LessonPage({ page }) {
  const [showCheck, setShowCheck] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Subtopic title */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="w-2 h-8 rounded-full bg-brand-500" />
        <h2 className="text-xl font-bold text-slate-100">{page.subtopic}</h2>
      </div>

      {/* Concept Explanation */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-brand-400" />
          <h3 className="text-sm font-semibold text-brand-400 uppercase tracking-wide">Concept Explanation</h3>
        </div>
        <div className="space-y-3">
          {page.concept_explanation.split('\n\n').map((para, i) => (
            <p key={i} className="text-slate-300 leading-relaxed text-[15px]">{para}</p>
          ))}
        </div>
      </section>

      {/* Key Points */}
      {page.key_points?.length > 0 && (
        <section className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-yellow-400" />
            <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">Key Points</h3>
          </div>
          <ul className="space-y-2">
            {page.key_points.map((pt, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-200">
                <span className="text-brand-400 font-bold shrink-0 mt-0.5">•</span>
                {pt}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Real-world Example */}
      {page.real_world_example && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={15} className="text-green-400" />
            <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">Real-world Example</h3>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-slate-300 leading-relaxed text-[14px]">{page.real_world_example}</p>
          </div>
        </section>
      )}

      {/* Code / Process Example */}
      {page.code_example && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={15} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
              {page.code_example.is_code ? 'Code Example' : 'Step-by-step Process'}
            </h3>
          </div>
          {page.code_example.is_code
            ? <CodeBlock snippet={page.code_example.snippet} language={page.code_example.language} />
            : (
              <div className="rounded-xl p-4 font-mono text-sm" style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.07)' }}>
                <pre className="whitespace-pre-wrap text-slate-300">{page.code_example.snippet}</pre>
              </div>
            )
          }
          {page.code_example.explanation && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{page.code_example.explanation}</p>
          )}
        </section>
      )}

      {/* Common Mistakes */}
      {page.common_mistakes?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-orange-400" />
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide">Common Mistakes</h3>
          </div>
          <div className="space-y-2">
            {page.common_mistakes.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl text-[13px] text-slate-300"
                style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}>
                <span className="text-orange-400 font-bold shrink-0">!</span>
                {m}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Check */}
      {page.quick_check && (
        <section>
          <button onClick={() => setShowCheck(!showCheck)}
            className="flex items-center gap-2 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors">
            <HelpCircle size={15} />
            Quick Check Question
            {showCheck ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showCheck && (
            <div className="mt-2 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <p className="text-slate-200 text-sm leading-relaxed">{page.quick_check}</p>
              <p className="text-xs text-slate-500 mt-2">Think about it before moving on!</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

/* ── Study Notes Modal ── */
function NotesModal({ topic, roadmap, onClose }) {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.post('/features/study-notes', {
      roadmap_id: roadmap.id,
      topic_id: topic.id,
      roadmap_title: roadmap.title,
      topic_name: topic.name, 
      subtopics: topic.subtopics || [], 
      difficulty: topic.difficulty
    }).then(r => { setNotes(r.data.notes); setLoading(false) })
      .catch(() => { toast.error('Notes generation failed'); onClose() })
  }, [])

  const parseSimpleMarkdown = (text) => {
    if (!text) return { __html: '' };
    let html = text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") 
      .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-[#0f1117] border border-white/10 p-4 rounded-xl my-3 overflow-x-auto text-cyan-300 text-[13px] font-mono whitespace-pre">$1</pre>')
      .replace(/^### (.*$)/gim, '<h4 class="text-slate-100 font-bold mt-5 mb-2 text-base">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="text-brand-300 font-bold mt-6 mb-2 text-lg border-b border-white/10 pb-2">$1</h3>')
      .replace(/^# (.*$)/gim, '<h2 class="text-brand-400 font-bold mt-6 mb-3 text-xl border-b border-white/10 pb-2">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-[#1e2130] text-pink-400 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
    return { __html: html }
  }

  const downloadPDF = async () => {
    toast.loading('Preparing document...', { id: 'pdf' });
    if (!window.marked) {
      await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }

    toast.dismiss('pdf');
    const printWindow = window.open('', '_blank');
    const parsedNotes = window.marked.parse(notes);
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${topic.name} - ${roadmap?.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { 
      font-family: 'Inter', -apple-system, sans-serif; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 40px; 
      color: #1e293b; 
      line-height: 1.7; 
      background: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e2e8f0;
    }
    .header h1 {
      color: #4f46e5;
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
    }
    .header p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
    #content { font-size: 15px; }
    #content h1, #content h2, #content h3 { color: #0f172a; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.75em; page-break-after: avoid; }
    #content h1 { font-size: 24px; color: #4f46e5; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; display: none; }
    #content h2 { font-size: 20px; }
    #content h3 { font-size: 18px; color: #334155; }
    #content p { margin-top: 0; margin-bottom: 16px; }
    #content ul, #content ol { padding-left: 24px; margin-top: 0; margin-bottom: 16px; color: #334155; }
    #content li { margin-bottom: 8px; }
    #content li::marker { color: #4f46e5; font-weight: 600; }
    #content code { background-color: #f1f5f9; color: #db2777; padding: 3px 6px; border-radius: 6px; font-family: monospace; font-size: 13px; }
    #content pre { background-color: #0f172a; border-radius: 12px; padding: 20px; overflow-x: auto; margin: 24px 0; page-break-inside: avoid; }
    #content pre code { background-color: transparent; color: #38bdf8; padding: 0; }
    #content blockquote { border-left: 4px solid #4f46e5; background: #f8fafc; padding: 16px 20px; margin: 24px 0; border-radius: 0 8px 8px 0; color: #475569; font-style: italic; page-break-inside: avoid; }
    #content strong { color: #0f172a; font-weight: 600; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${topic.name}</h1>
    <p>${roadmap?.title}</p>
  </div>
  <div id="content">
    ${parsedNotes}
  </div>
  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
    printWindow.document.write(html);
    printWindow.document.close();
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
            {!loading && <button onClick={downloadPDF} className="flex items-center gap-2 text-xs py-2 px-3 bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 rounded-xl transition-all"><Download size={14} /> Download PDF</button>}
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
            <div className="text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={parseSimpleMarkdown(notes)} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Quiz Section (one question at a time) ── */
function LessonQuiz({ topic, roadmapId, topicIndex, onPassed, onFailed }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.post('/features/generate-lesson-quiz', {
      roadmap_id: roadmapId,
      topic_index: topicIndex,
      topic_name: topic.name,
      subtopics: topic.subtopics || [],
      difficulty: topic.difficulty || 'Beginner',
    }).then(r => { setQuestions(r.data.questions); setLoading(false) })
      .catch(() => toast.error('Quiz generation failed'))
  }, [])

  const handleSubmitAnswer = () => {
    if (selected === null) return
    setSubmitted(true)
  }

  const handleNext = async () => {
    const newAnswers = [...answers, selected]
    if (current < questions.length - 1) {
      setAnswers(newAnswers)
      setCurrent(current + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      // Calculate result
      const correct = newAnswers.filter((a, i) => a === questions[i].correct).length
      const score = Math.round((correct / questions.length) * 100)
      const passed = score >= 60
      const res = { score, correct, total: questions.length, passed, answers: newAnswers }
      setResult(res)
      setDone(true)
      if (passed) {
        try {
          await api.post('/quiz/submit', {
            roadmap_id: roadmapId,
            topic_id: topic.id,
            answers: newAnswers,
            questions,
          })
          onPassed(res)
        } catch { onPassed(res) }
      } else {
        onFailed(res)
      }
    }
  }

  const retry = () => {
    setCurrent(0); setSelected(null); setSubmitted(false)
    setAnswers([]); setDone(false); setResult(null)
  }

  if (loading) return (
    <div className="flex flex-col items-center py-20">
      <Loader2 size={32} className="text-brand-400 animate-spin mb-3" />
      <p className="text-slate-400 text-sm">Generating quiz…</p>
    </div>
  )

  if (done && result) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 ${result.passed ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
          {result.passed ? <Trophy size={40} className="text-green-400" /> : <XCircle size={40} className="text-red-400" />}
        </div>
        <h2 className="text-3xl font-bold text-slate-100 mb-1">{result.score}%</h2>
        <p className="text-slate-400 mb-3">{result.correct}/{result.total} correct</p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-6 ${result.passed ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {result.passed ? <><CheckCircle size={14} /> Passed! Topic completed +15 XP</> : <><AlertTriangle size={14} /> Need 60%+ to pass</>}
        </div>
        {/* Answer review */}
        <div className="text-left space-y-3 mb-6">
          {questions.map((q, i) => {
            const isRight = result.answers[i] === q.correct
            return (
              <div key={i} className={`p-4 rounded-xl border text-sm ${isRight ? 'bg-green-500/05 border-green-500/20' : 'bg-red-500/05 border-red-500/20'}`}>
                <p className="font-medium text-slate-200 mb-1">{i + 1}. {q.question}</p>
                <p className={isRight ? 'text-green-400 text-xs' : 'text-red-400 text-xs'}>
                  Your answer: {q.options[result.answers[i]] || 'Not answered'}
                </p>
                {!isRight && <p className="text-green-400 text-xs">Correct: {q.options[q.correct]}</p>}
                {q.explanation && <p className="text-slate-500 text-xs mt-1 italic">{q.explanation}</p>}
              </div>
            )
          })}
        </div>
        {!result.passed && (
          <button onClick={retry} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mx-auto mb-3"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
            <RotateCcw size={14} /> Retry Quiz
          </button>
        )}
      </div>
    )
  }

  const q = questions[current]
  const isCorrect = submitted && selected === q.correct

  return (
    <div className="animate-fade-in">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-400">Question {current + 1} of {questions.length}</p>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < current ? 'bg-green-400' : i === current ? 'bg-brand-400' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="p-5 rounded-xl mb-5" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p className="text-base font-semibold text-slate-100 leading-relaxed">{q.question}</p>
      </div>

      <div className="space-y-2.5 mb-5">
        {q.options.map((opt, oi) => {
          let style = 'border-white/10 bg-white/3 hover:border-brand-500/40'
          if (submitted) {
            if (oi === q.correct) style = 'border-green-500 bg-green-500/10'
            else if (oi === selected) style = 'border-red-500 bg-red-500/10'
          } else if (selected === oi) {
            style = 'border-brand-500 bg-brand-500/10'
          }
          return (
            <button key={oi} disabled={submitted}
              onClick={() => setSelected(oi)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all text-sm text-slate-200 ${style}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === oi && !submitted ? 'border-brand-500 bg-brand-500' : submitted && oi === q.correct ? 'border-green-500 bg-green-500' : submitted && oi === selected ? 'border-red-500 bg-red-500' : 'border-white/20'}`}>
                {(selected === oi || (submitted && oi === q.correct)) && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {opt}
            </button>
          )
        })}
      </div>

      {submitted && (
        <div className={`p-3 rounded-xl text-sm mb-4 ${isCorrect ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
          {isCorrect ? '✓ Correct! ' : '✗ Not quite. '}
          {q.explanation}
        </div>
      )}

      {!submitted
        ? <button onClick={handleSubmitAnswer} disabled={selected === null}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: selected === null ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.9)', color: selected === null ? '#64748b' : '#fff' }}>
          Submit Answer
        </button>
        : <button onClick={handleNext}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'rgba(99,102,241,0.9)' }}>
          {current < questions.length - 1 ? 'Next Question →' : 'See Results'}
        </button>
      }
    </div>
  )
}

/* ── Main LessonView ── */
export default function LessonView() {
  const { roadmapId, topicIndex } = useParams()
  const navigate = useNavigate()
  const idx = parseInt(topicIndex, 10)

  const [roadmap, setRoadmap] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageIdx, setPageIdx] = useState(0)
  const [phase, setPhase] = useState('lesson') // 'lesson' | 'quiz' | 'result'
  const [quizResult, setQuizResult] = useState(null)
  const [showNotes, setShowNotes] = useState(false)

  const topic = roadmap?.topics?.[idx]
  const prevTopic = roadmap?.topics?.[idx - 1]
  const nextTopic = roadmap?.topics?.[idx + 1]
  const pages = lesson?.lesson?.pages || []
  const totalPages = pages.length
  const isLastPage = pageIdx === totalPages - 1

  useEffect(() => {
    setLoading(true)
    setLesson(null)
    setPageIdx(0)
    setPhase('lesson')
    setQuizResult(null)

    api.get(`/roadmaps/${roadmapId}`)
      .then(r => {
        setRoadmap(r.data)
        const t = r.data.topics?.[idx]
        if (!t) { toast.error('Topic not found'); navigate(`/roadmaps/${roadmapId}`); return }
        return api.post('/features/generate-lesson', {
          roadmap_id: roadmapId,
          topic_index: idx,
          topic_name: t.name,
          subtopics: t.subtopics || [],
          difficulty: t.difficulty || 'Beginner',
          skill: r.data.skills?.[0] || 'Programming',
        })
      })
      .then(r => { if (r) setLesson(r.data) })
      .catch(() => toast.error('Failed to load lesson'))
      .finally(() => setLoading(false))
  }, [roadmapId, topicIndex])

  const goToTopic = (newIdx) => navigate(`/learn/${roadmapId}/${newIdx}`)

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#16181f' }}>
      <Loader2 size={36} className="text-brand-400 animate-spin mb-4" />
      <p className="text-slate-400 text-sm">Generating your lesson…</p>
      <p className="text-slate-600 text-xs mt-1">This may take a few seconds</p>
    </div>
  )

  if (!topic || !lesson) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#16181f' }}>
      <div className="text-center">
        <p className="text-slate-300 mb-4">Lesson could not be loaded.</p>
        <button onClick={() => navigate(`/roadmaps/${roadmapId}`)} className="text-brand-400 hover:underline text-sm">← Back to roadmap</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#16181f', color: '#e8eaf0' }}>
      {showNotes && <NotesModal topic={topic} roadmap={roadmap} onClose={() => setShowNotes(false)} />}
      {/* Top nav bar */}
      <div className="sticky top-0 z-40 border-b border-white/8" style={{ background: 'rgba(22,24,31,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors shrink-0">
            <ArrowLeft size={15} /> Roadmap
          </button>
          <div className="flex-1 text-center min-w-0">
            <p className="text-xs text-slate-500 truncate">{roadmap?.title}</p>
            <p className="text-sm font-semibold text-slate-100 truncate">{topic.name}</p>
          </div>
          <div className="text-xs text-slate-500 shrink-0">
            {phase === 'lesson' ? `${pageIdx + 1}/${totalPages} pages` : 'Quiz'}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: '#1e2130' }}>
          <div className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: phase === 'lesson' ? `${((pageIdx + 1) / totalPages) * 100}%` : '100%' }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-600 mb-6">
          <span>Topic {idx + 1}</span>
          <span>/</span>
          <span className="text-slate-400">{topic.name}</span>
          {phase === 'quiz' && <><span>/</span><span className="text-brand-400">Quiz</span></>}
        </div>

        {/* LESSON PHASE */}
        {phase === 'lesson' && pages.length > 0 && (
          <>
            <LessonPage page={pages[pageIdx]} />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/8">
              {pageIdx > 0
                ? <button onClick={() => setPageIdx(pageIdx - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ArrowLeft size={15} /> Previous
                </button>
                : <button onClick={() => prevTopic && goToTopic(idx - 1)}
                  disabled={!prevTopic}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ArrowLeft size={15} /> Previous Topic
                </button>
              }

              {!isLastPage
                ? <button onClick={() => setPageIdx(pageIdx + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'rgba(99,102,241,0.9)' }}>
                  Next <ArrowRight size={15} />
                </button>
                : <div className="flex items-center gap-2">
                    <button onClick={() => setShowNotes(true)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <FileText size={15} /> Study Notes
                    </button>
                    <button onClick={() => setPhase('quiz')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      <Star size={15} /> Take Quiz
                    </button>
                  </div>
              }
            </div>

            {/* Subtopic pills */}
            {totalPages > 1 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {pages.map((p, i) => (
                  <button key={i} onClick={() => setPageIdx(i)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${i === pageIdx ? 'bg-brand-500 text-white' : i < pageIdx ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-slate-500'}`}>
                    {i < pageIdx ? '✓ ' : ''}{p.subtopic}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-100">Knowledge Check</h2>
              <p className="text-sm text-slate-500 mt-1">Answer all 5 questions. Score 60%+ to complete this topic.</p>
            </div>
            <LessonQuiz
              topic={topic}
              roadmapId={roadmapId}
              topicIndex={idx}
              onPassed={(res) => { setQuizResult(res); setPhase('result') }}
              onFailed={(res) => { setQuizResult(res); setPhase('result') }}
            />
          </div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && quizResult && (
          <div className="text-center py-6 animate-fade-in">
            {quizResult.passed ? (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Topic Complete!</h2>
                <p className="text-slate-400 text-sm mb-2">You scored <span className="text-green-400 font-bold">{quizResult.score}%</span> — {quizResult.correct}/{quizResult.total} correct</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium mb-8 bg-green-500/10 text-green-400 border border-green-500/20">
                  <Star size={14} /> +15 XP Earned
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">📖</div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Keep Practising!</h2>
                <p className="text-slate-400 text-sm mb-2">You scored <span className="text-red-400 font-bold">{quizResult.score}%</span> — need 60% to complete</p>
                <p className="text-slate-500 text-xs mb-8">Review the lesson and try the quiz again.</p>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate(`/roadmaps/${roadmapId}`)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
                <ArrowLeft size={15} /> Back to Roadmap
              </button>

              {!quizResult.passed && (
                <button onClick={() => { setPhase('lesson'); setPageIdx(0) }}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                  <BookOpen size={15} /> Review Lesson
                </button>
              )}

              {nextTopic && (
                <button onClick={() => goToTopic(idx + 1)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  Next Topic <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
