import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  Brain,
  Loader2,
  RefreshCw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Star,
  Mic,
  Code2,
  Users,
} from "lucide-react";

const SKILLS = [
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "Java",
  "DevOps",
  "Machine Learning",
  "SQL",
  "Data Science",
  "TypeScript",
  "DSA",
  "Web Development",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const Q_TYPES = [
  {
    id: "technical",
    icon: Code2,
    label: "Technical",
    desc: "Concepts & theory",
  },
  { id: "coding", icon: Brain, label: "Coding", desc: "Problem solving" },
  {
    id: "behavioral",
    icon: Users,
    label: "Behavioral",
    desc: "Soft skills & experience",
  },
];

const VERDICT_COLORS = {
  Excellent: "bg-green-50 border-green-300 text-green-700",
  Good: "bg-blue-50 border-blue-300 text-blue-700",
  "Needs Improvement": "bg-yellow-50 border-yellow-300 text-yellow-700",
  Poor: "bg-red-50 border-red-300 text-red-700",
};

export default function InterviewPrep() {
  const [skill, setSkill] = useState("Python");
  const [level, setLevel] = useState("Beginner");
  const [qType, setQType] = useState("technical");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEval] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evalLoading, setEvalL] = useState(false);
  const [sessionCount, setCount] = useState(0);

  const getQuestion = async () => {
    setLoading(true);
    setQuestion(null);
    setAnswer("");
    setEval(null);
    try {
      const { data } = await api.post("/features/interview/question", {
        skill,
        level,
        question_type: qType,
      });
      setQuestion(data);
      setCount((c) => c + 1);
    } catch {
      toast.error("Failed to generate question");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please write an answer");
      return;
    }
    setEvalL(true);
    try {
      const { data } = await api.post("/features/interview/evaluate", {
        question: question.question,
        answer,
        skill,
        level,
      });
      setEval(data);
    } catch {
      toast.error("Evaluation failed");
    } finally {
      setEvalL(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink-primary flex items-center gap-2">
          <Brain size={22} className="text-brand-600" /> Interview Prep
        </h1>
        <p className="text-ink-tertiary mt-1 text-sm">
          AI-powered mock interviews tailored to your skill and level
        </p>
      </div>

      {/* Config */}
      <div className="card p-5 sm:p-6 mb-6">
        <h2 className="text-sm font-semibold text-ink-primary mb-4">
          Configure your mock interview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Skill
            </label>
            <select
              className="input text-sm"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            >
              {SKILLS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Level
            </label>
            <select
              className="input text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Question Type
            </label>
            <div className="flex gap-2">
              {Q_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setQType(t.id)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-all ${qType === t.id ? "bg-brand-600 text-white border-brand-600" : "bg-white border-surface-4 text-ink-secondary hover:border-brand-200"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={getQuestion}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Generating…
            </>
          ) : (
            <>
              <RefreshCw size={16} />{" "}
              {question ? "Next Question" : "Start Interview"}
            </>
          )}
        </button>
        {sessionCount > 0 && (
          <p className="text-xs text-ink-ghost mt-2">
            {sessionCount} question{sessionCount > 1 ? "s" : ""} practiced this
            session
          </p>
        )}
      </div>

      {/* Question */}
      {question && (
        <div className="space-y-4 animate-slide-up">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge bg-brand-50 text-brand-700">
                {question.type}
              </span>
              <span className="badge bg-surface-2 text-ink-tertiary">
                {question.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-ink-primary mb-4 leading-relaxed">
              {question.question}
            </h2>
            {question.what_interviewer_looks_for && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-medium text-amber-700 mb-1">
                  💡 What the interviewer looks for:
                </p>
                <p className="text-xs text-amber-600">
                  {question.what_interviewer_looks_for}
                </p>
              </div>
            )}
          </div>

          {!evaluation && (
            <div className="card p-5 sm:p-6">
              <label className="block text-sm font-medium text-ink-secondary mb-2">
                Your Answer
              </label>
              <textarea
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="input text-sm resize-none mb-4"
                placeholder="Type your answer here. Be thorough — the AI will evaluate your response…"
              />
              <button
                onClick={submitAnswer}
                disabled={evalLoading || !answer.trim()}
                className="btn-primary flex items-center gap-2"
              >
                {evalLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Evaluating…
                  </>
                ) : (
                  <>
                    <Star size={16} /> Get AI Feedback
                  </>
                )}
              </button>
            </div>
          )}

          {evaluation && (
            <div className="card p-5 sm:p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-ink-primary">AI Feedback</h3>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-ink-primary">
                      {evaluation.score}
                      <span className="text-sm text-ink-ghost">/10</span>
                    </p>
                  </div>
                  <span
                    className={`badge border ${VERDICT_COLORS[evaluation.verdict] || "bg-surface-2 text-ink-tertiary"}`}
                  >
                    {evaluation.verdict}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {evaluation.strengths?.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Strengths
                    </p>
                    <ul className="space-y-1">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-green-600">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {evaluation.gaps?.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                      <XCircle size={13} /> Gaps
                    </p>
                    <ul className="space-y-1">
                      {evaluation.gaps.map((g, i) => (
                        <li key={i} className="text-xs text-red-500">
                          • {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {evaluation.ideal_answer_points?.length > 0 && (
                <div className="bg-brand-50 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-brand-700 mb-2">
                    📋 Ideal Answer Should Include
                  </p>
                  <ul className="space-y-1">
                    {evaluation.ideal_answer_points.map((p, i) => (
                      <li key={i} className="text-xs text-brand-600">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bg-surface-1 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-ink-secondary mb-1">
                  Overall Feedback
                </p>
                <p className="text-sm text-ink-tertiary leading-relaxed">
                  {evaluation.feedback}
                </p>
              </div>
              {evaluation.tip && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <p className="text-xs font-medium text-yellow-700">
                    💡 Pro tip: {evaluation.tip}
                  </p>
                </div>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={getQuestion}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  <RefreshCw size={15} /> Next Question
                </button>
                <button
                  onClick={() => {
                    setEval(null);
                    setAnswer("");
                  }}
                  className="btn-secondary text-sm"
                >
                  Retry This Question
                </button>
              </div>
              {question.follow_up && (
                <div className="mt-4 p-3 bg-surface-1 rounded-xl">
                  <p className="text-xs text-ink-ghost">
                    Likely follow-up:{" "}
                    <span className="text-ink-secondary italic">
                      "{question.follow_up}"
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!question && !loading && (
        <div className="card p-12 text-center">
          <Brain size={40} className="text-ink-ghost mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-primary mb-2">
            Ready to practice?
          </h2>
          <p className="text-sm text-ink-tertiary mb-6">
            Select your skill and level above, then click Start Interview to get
            your first question.
          </p>
        </div>
      )}
    </div>
  );
}
