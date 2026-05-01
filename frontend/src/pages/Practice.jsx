import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  Code2,
  ExternalLink,
  Youtube,
  BookOpen,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Loader2,
  Send,
  X,
} from "lucide-react";

const IDES = {
  python: {
    name: "Python",
    dot: "bg-blue-500",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    topics: ["Variables", "Functions", "OOP", "File I/O", "Libraries"],
    alternatives: [
      {
        name: "Replit Python",
        url: "https://replit.com/new/python3",
        icon: "🔁",
      },
      {
        name: "Google Colab",
        url: "https://colab.research.google.com/",
        icon: "📓",
      },
      {
        name: "Programiz",
        url: "https://www.programiz.com/python-programming/online-compiler/",
        icon: "⚡",
      },
      {
        name: "JDoodle",
        url: "https://www.jdoodle.com/python3-programming-online/",
        icon: "🍜",
      },
    ],
  },
  javascript: {
    name: "JavaScript",
    dot: "bg-yellow-500",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    topics: ["DOM", "Async/Await", "ES6+", "APIs", "Events"],
    alternatives: [
      { name: "CodePen", url: "https://codepen.io/pen/", icon: "✏️" },
      { name: "JSFiddle", url: "https://jsfiddle.net/", icon: "🎻" },
      { name: "StackBlitz", url: "https://stackblitz.com/", icon: "⚡" },
      { name: "Playcode", url: "https://playcode.io/", icon: "🎮" },
    ],
  },
  react: {
    name: "React",
    dot: "bg-cyan-500",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    topics: ["Components", "Props", "Hooks", "Context", "Routing"],
    alternatives: [
      {
        name: "StackBlitz React",
        url: "https://stackblitz.com/edit/react",
        icon: "⚡",
      },
      {
        name: "CodeSandbox",
        url: "https://codesandbox.io/s/react-new",
        icon: "📦",
      },
      {
        name: "Replit React",
        url: "https://replit.com/new/reactjs",
        icon: "🔁",
      },
      { name: "Playcode React", url: "https://playcode.io/react", icon: "🎮" },
    ],
  },
  java: {
    name: "Java",
    dot: "bg-orange-500",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    topics: ["OOP", "Collections", "Generics", "Threads", "DSA"],
    alternatives: [
      {
        name: "OnlineGDB",
        url: "https://www.onlinegdb.com/online_java_compiler",
        icon: "🐛",
      },
      { name: "Replit Java", url: "https://replit.com/new/java", icon: "🔁" },
      {
        name: "JDoodle",
        url: "https://www.jdoodle.com/online-java-compiler/",
        icon: "🍜",
      },
      {
        name: "Programiz",
        url: "https://www.programiz.com/java-programming/online-compiler/",
        icon: "⚡",
      },
    ],
  },
  dsa: {
    name: "DSA",
    dot: "bg-green-500",
    color: "bg-green-50 text-green-700 border-green-200",
    topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "DP"],
    alternatives: [
      { name: "LeetCode", url: "https://leetcode.com/problemset/", icon: "💪" },
      {
        name: "HackerRank",
        url: "https://www.hackerrank.com/domains/algorithms",
        icon: "🟢",
      },
      { name: "Codeforces", url: "https://codeforces.com/", icon: "⚔️" },
      {
        name: "GFG Practice",
        url: "https://practice.geeksforgeeks.org/",
        icon: "🧑‍💻",
      },
    ],
  },
  sql: {
    name: "SQL",
    dot: "bg-teal-500",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    topics: ["SELECT", "JOINs", "Aggregations", "Indexes", "Transactions"],
    alternatives: [
      { name: "SQLiteOnline", url: "https://sqliteonline.com/", icon: "🗄️" },
      { name: "DB Fiddle", url: "https://www.db-fiddle.com/", icon: "🎻" },
      { name: "SQLZoo", url: "https://sqlzoo.net/", icon: "🦓" },
      { name: "Mode SQL", url: "https://mode.com/sql-tutorial/", icon: "📊" },
    ],
  },
  ml: {
    name: "Machine Learning",
    dot: "bg-purple-500",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    topics: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Neural Networks",
      "Visualization",
    ],
    alternatives: [
      {
        name: "Google Colab",
        url: "https://colab.research.google.com/",
        icon: "📓",
      },
      { name: "Kaggle", url: "https://www.kaggle.com/code", icon: "🏆" },
      { name: "Deepnote", url: "https://deepnote.com/", icon: "🔬" },
      { name: "HuggingFace", url: "https://huggingface.co/spaces", icon: "🤗" },
    ],
  },
  devops: {
    name: "DevOps",
    dot: "bg-slate-500",
    color: "bg-slate-50 text-slate-700 border-slate-200",
    topics: ["Docker", "Kubernetes", "CI/CD", "Linux", "Cloud"],
    alternatives: [
      {
        name: "Play with Docker",
        url: "https://labs.play-with-docker.com/",
        icon: "🐳",
      },
      { name: "Killercoda", url: "https://killercoda.com/", icon: "⚔️" },
      {
        name: "Play with K8s",
        url: "https://labs.play-with-k8s.com/",
        icon: "☸️",
      },
      {
        name: "AWS CloudShell",
        url: "https://console.aws.amazon.com/cloudshell/",
        icon: "☁️",
      },
    ],
  },
};

/* ── Code Review Panel ─────────────────────────────────────── */
function CodeReview() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("python");
  const [ctx, setCtx] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoad] = useState(false);

  const submit = async () => {
    if (!code.trim()) {
      toast.error("Paste some code first");
      return;
    }
    setLoad(true);
    setReview("");
    try {
      const { data } = await api.post("/features/code-review", {
        code,
        language: lang,
        context: ctx || null,
      });
      setReview(data.review);
    } catch {
      toast.error("Code review failed");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="card p-5 sm:p-6">
      <h2 className="font-semibold text-ink-primary mb-1">AI Code Review</h2>
      <p className="text-sm text-ink-tertiary mb-5">
        Paste your code and get instant feedback on bugs, best practices, and
        improvements
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1.5">
            Language
          </label>
          <select
            className="input text-sm"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {[
              "python",
              "javascript",
              "java",
              "cpp",
              "typescript",
              "sql",
              "react",
            ].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1.5">
            Context (optional)
          </label>
          <input
            className="input text-sm"
            placeholder="e.g. Sorting algorithm for interview"
            value={ctx}
            onChange={(e) => setCtx(e.target.value)}
          />
        </div>
      </div>
      <textarea
        rows={10}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full bg-[#1e1e2e] text-green-400 font-mono text-xs rounded-xl p-4 border border-surface-3 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none mb-4"
        placeholder="# Paste your code here..."
      />
      <button
        onClick={submit}
        disabled={loading || !code.trim()}
        className="btn-primary flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Reviewing…
          </>
        ) : (
          <>
            <Send size={16} /> Review my code
          </>
        )}
      </button>

      {review && (
        <div className="mt-6 p-5 bg-surface-1 rounded-xl border border-surface-3">
          <pre className="whitespace-pre-wrap text-sm text-ink-secondary font-sans leading-relaxed">
            {review}
          </pre>
        </div>
      )}
    </div>
  );
}

function IDECard({ id, ide }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden transition-all ${open ? "shadow-md" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-surface-1 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${ide.dot}`} />
          <div className="text-left">
            <h3 className="font-semibold text-ink-primary text-sm">
              {ide.name}
            </h3>
            <div className="flex gap-1 flex-wrap mt-1">
              {ide.topics.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className={`badge text-[10px] border ${ide.color}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-ink-ghost shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-ink-ghost shrink-0" />
        )}
      </button>
      {open && (
        <div className="border-t border-surface-3 p-4 sm:p-5 animate-slide-up">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {ide.topics.map((t) => (
              <span key={t} className={`badge border ${ide.color}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ide.alternatives.map((alt) => (
              <a
                key={alt.name}
                href={alt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-3 bg-surface-1 hover:bg-brand-50 border border-surface-3 hover:border-brand-200 rounded-xl transition-all group"
              >
                <span className="text-lg">{alt.icon}</span>
                <span className="text-sm font-medium text-ink-secondary group-hover:text-brand-700 flex-1">
                  {alt.name}
                </span>
                <ExternalLink
                  size={13}
                  className="text-ink-ghost group-hover:text-brand-500"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Practice() {
  const [tab, setTab] = useState("ide");
  const [search, setSearch] = useState("");

  const filtered = Object.entries(IDES).filter(([, ide]) =>
    ide.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink-primary flex items-center gap-2">
          <Code2 size={22} className="text-brand-600" /> Practice
        </h1>
        <p className="text-ink-tertiary mt-1 text-sm">
          Hands-on coding environments and AI code review — all free
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          ["ide", "🖥️ Online IDEs"],
          ["review", "🤖 AI Code Review"],
        ].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-brand-600 text-white" : "bg-white border border-surface-3 text-ink-secondary hover:border-brand-200"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "ide" && (
        <>
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-5 sm:p-6 mb-6 text-white">
            <h2 className="font-semibold text-lg mb-1">Learn by doing</h2>
            <p className="text-brand-100 text-sm leading-relaxed">
              Practice in real browser-based IDEs — no installation, no setup.
              Each environment is pre-configured for your chosen skill.
            </p>
          </div>
          <input
            className="input mb-4 text-sm"
            placeholder="Search by language…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="space-y-3">
            {filtered.map(([id, ide]) => (
              <IDECard key={id} id={id} ide={ide} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-ink-ghost">
                <Layers size={32} className="mx-auto mb-3" />
                <p>No environments found for "{search}"</p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "review" && <CodeReview />}
    </div>
  );
}
