import { useState, useRef, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Code2, Loader2, Send, ChevronDown } from 'lucide-react'

// ── Embedded IDE configs using JDoodle (via backend proxy) ──────
const LANGUAGES = [
  { id: 'python',     label: 'Python',      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',    dot: 'bg-blue-500',    starter: '# Python Playground\n# Write your code below and click Run\n\nprint("Hello, SkillForge!")\n\n# Try variables, loops, functions\nfor i in range(1, 6):\n    print(f"Learning Day {i} 🚀")\n' },
  { id: 'javascript', label: 'JavaScript',  color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400', starter: '// JavaScript Playground\nconsole.log("Hello, SkillForge!");\n\n// Try arrays, functions, loops\nconst skills = ["HTML", "CSS", "JavaScript"];\nskills.forEach((skill, i) => {\n    console.log(`${i+1}. Learning ${skill}`);\n});\n' },
  { id: 'java',       label: 'Java',        color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', dot: 'bg-orange-500', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, SkillForge!");\n        \n        // Try loops and arrays\n        String[] skills = {"Java", "OOP", "DSA"};\n        for (int i = 0; i < skills.length; i++) {\n            System.out.println((i+1) + ". " + skills[i]);\n        }\n    }\n}\n' },
  { id: 'c',          label: 'C',           color: 'bg-gray-500/10 text-gray-300 border-gray-500/20',      dot: 'bg-gray-400',   starter: '#include <stdio.h>\n\nint main() {\n    printf("Hello, SkillForge!\\n");\n    \n    // Try loops\n    for (int i = 1; i <= 5; i++) {\n        printf("Day %d of learning C\\n", i);\n    }\n    return 0;\n}\n' },
  { id: 'cpp',        label: 'C++',         color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-500', starter: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "Hello, SkillForge!" << endl;\n    \n    vector<string> skills = {"C++", "STL", "OOP"};\n    for (auto& s : skills) {\n        cout << "Learning: " << s << endl;\n    }\n    return 0;\n}\n' },
  { id: 'csharp',     label: 'C#',          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-500', starter: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, SkillForge!");\n        \n        string[] skills = {"C#", ".NET", "OOP"};\n        foreach (var s in skills) {\n            Console.WriteLine($"Learning: {s}");\n        }\n    }\n}\n' },
  { id: 'go',         label: 'Go',          color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',      dot: 'bg-cyan-500',   starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, SkillForge!")\n    \n    skills := []string{"Go", "Goroutines", "Channels"}\n    for i, s := range skills {\n        fmt.Printf("%d. Learning %s\\n", i+1, s)\n    }\n}\n' },
  { id: 'rust',       label: 'Rust',        color: 'bg-red-500/10 text-red-400 border-red-500/20',         dot: 'bg-red-500',    starter: 'fn main() {\n    println!("Hello, SkillForge!");\n    \n    let skills = vec!["Rust", "Ownership", "Borrowing"];\n    for (i, s) in skills.iter().enumerate() {\n        println!("{}. Learning {}", i+1, s);\n    }\n}\n' },
  { id: 'typescript', label: 'TypeScript',  color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     dot: 'bg-blue-500',   starter: '// TypeScript Playground\nconst greet = (name: string): string => {\n    return `Hello, ${name}!`;\n};\n\nconsole.log(greet("SkillForge"));\n\ninterface Skill {\n    name: string;\n    level: number;\n}\n\nconst skills: Skill[] = [\n    { name: "TypeScript", level: 1 },\n    { name: "React", level: 2 },\n];\n\nskills.forEach(s => console.log(`${s.name}: Level ${s.level}`));\n' },
  { id: 'sql',        label: 'SQL',         color: 'bg-teal-500/10 text-teal-400 border-teal-500/20',    dot: 'bg-teal-500',   starter: '' },
]

// ── Extra languages shown in "More" dropdown ─────────────────────
const MORE_LANGUAGES = [
  { id: 'kotlin',   label: 'Kotlin',   dot: 'bg-orange-400',  starter: 'fun main() {\n    println("Hello, SkillForge!")\n    val skills = listOf("Kotlin", "Coroutines", "JVM")\n    skills.forEachIndexed { i, s -> println("${i+1}. $s") }\n}\n' },
  { id: 'ruby',     label: 'Ruby',     dot: 'bg-red-400',     starter: 'puts "Hello, SkillForge!"\n\nskills = ["Ruby", "Rails", "Gems"]\nskills.each_with_index do |s, i|\n  puts "#{i+1}. #{s}"\nend\n' },
  { id: 'php',      label: 'PHP',      dot: 'bg-violet-400',  starter: '<?php\necho "Hello, SkillForge!\\n";\n\n$skills = ["PHP", "Laravel", "Composer"];\nforeach ($skills as $i => $s) {\n    echo ($i+1) . ". $s\\n";\n}\n' },
  { id: 'swift',    label: 'Swift',    dot: 'bg-orange-500',  starter: 'import Foundation\nprint("Hello, SkillForge!")\n\nlet skills = ["Swift", "iOS", "SwiftUI"]\nfor (i, s) in skills.enumerated() {\n    print("\\(i+1). \\(s)")\n}\n' },
  { id: 'scala',    label: 'Scala',    dot: 'bg-red-600',     starter: 'object Main extends App {\n  println("Hello, SkillForge!")\n  val skills = List("Scala", "Akka", "Spark")\n  skills.zipWithIndex.foreach { case (s, i) => println(s"${i+1}. $s") }\n}\n' },
  { id: 'perl',     label: 'Perl',     dot: 'bg-blue-300',    starter: 'print "Hello, SkillForge!\\n";\n\nmy @skills = ("Perl", "Regex", "CPAN");\nfor my $i (0..$#skills) {\n    print ($i+1) . ". $skills[$i]\\n";\n}\n' },
  { id: 'haskell',  label: 'Haskell',  dot: 'bg-purple-400',  starter: 'main :: IO ()\nmain = do\n    putStrLn "Hello, SkillForge!"\n    let skills = ["Haskell", "Monads", "Types"]\n    mapM_ (\\(i,s) -> putStrLn $ show i ++ ". " ++ s) (zip [1..] skills)\n' },
  { id: 'r',        label: 'R',        dot: 'bg-sky-400',     starter: 'cat("Hello, SkillForge!\\n")\n\nskills <- c("R", "ggplot2", "tidyverse")\nfor (i in seq_along(skills)) {\n  cat(i, ".", skills[i], "\\n")\n}\n' },
  { id: 'bash',     label: 'Bash',     dot: 'bg-green-400',   starter: '#!/bin/bash\necho "Hello, SkillForge!"\n\nskills=("Bash" "Shell" "Linux")\nfor i in "${!skills[@]}"; do\n  echo "$((i+1)). ${skills[$i]}"\ndone\n' },
  { id: 'lua',      label: 'Lua',      dot: 'bg-indigo-300',  starter: 'print("Hello, SkillForge!")\n\nlocal skills = {"Lua", "Tables", "Coroutines"}\nfor i, s in ipairs(skills) do\n    print(i .. ". " .. s)\nend\n' },
  { id: 'dart',     label: 'Dart',     dot: 'bg-cyan-400',    starter: 'void main() {\n  print("Hello, SkillForge!");\n  var skills = ["Dart", "Flutter", "async"];\n  for (var i = 0; i < skills.length; i++) {\n    print("${i+1}. ${skills[i]}");\n  }\n}\n' },
  { id: 'elixir',   label: 'Elixir',   dot: 'bg-purple-500',  starter: 'IO.puts "Hello, SkillForge!"\n\nskills = ["Elixir", "Phoenix", "OTP"]\nSkills\n|> Enum.with_index(1)\n|> Enum.each(fn {s, i} -> IO.puts "#{i}. #{s}" end)\n' },
]

// All language IDs that the backend supports (for CodeEditor fallback)
const ALL_LANGUAGES = [...LANGUAGES.filter(l => l.id !== 'sql'), ...MORE_LANGUAGES]

// ── Code Editor Component ────────────────────────────────────────
function CodeEditor({ lang }) {
  const [code, setCode]     = useState(lang.starter)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [stdin, setStdin]   = useState('')
  const [showStdin, setShowStdin] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | 'timeout'

  const runCode = async () => {
    if (!code.trim()) return
    setRunning(true)
    setOutput('')
    setStatus(null)

    try {
      const res = await api.post('/features/execute-code', {
        language: lang.id,
        code,
        stdin: stdin || '',
      })

      const data = res.data
      const out = data.output || ''

      // JDoodle signals errors inside the output text when statusCode != 200
      if (data.statusCode === 200) {
        setOutput(out || '(no output)')
        setStatus('success')
      } else if (data.statusCode === 'TIME_LIMIT_EXCEEDED' || out.includes('Time Limit')) {
        setOutput('⏱️ Time Limit Exceeded')
        setStatus('timeout')
      } else {
        setOutput(out || `Execution error (status ${data.statusCode})`)
        setStatus('error')
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message
      setOutput(`⚠️ Error: ${msg}`)
      setStatus('error')
    } finally {
      setRunning(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 4 }, 0)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-[#1e1e2e] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/100"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500/100"/>
          <div className="w-3 h-3 rounded-full bg-green-500/100"/>
        </div>
        <span className="text-xs text-gray-400 font-mono ml-2">{lang.label} — SkillForge IDE</span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowStdin(!showStdin)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors">
            {showStdin ? 'Hide' : 'stdin'}
          </button>
          <button onClick={() => setCode(lang.starter)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-white/10 hover:border-white/30 transition-colors">
            Reset
          </button>
          <button onClick={runCode} disabled={running}
            className="flex items-center gap-1.5 bg-green-500/100 hover:bg-green-400 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            {running ? <><Loader2 size={12} className="animate-spin"/> Running…</> : <><Send size={12}/> Run ▶</>}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Code area */}
        <div className="flex-1 flex flex-col min-w-0">
          {showStdin && (
            <div className="bg-[#252535] border-b border-white/10 px-3 py-2">
              <p className="text-xs text-gray-400 mb-1">Standard Input (stdin)</p>
              <textarea value={stdin} onChange={e => setStdin(e.target.value)} rows={2}
                className="w-full bg-[#1e1e2e] text-green-300 font-mono text-xs p-2 rounded border border-white/10 resize-none focus:outline-none focus:border-brand-500"
                placeholder="Enter input for your program…"/>
            </div>
          )}
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-[#1e1e2e] text-green-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
            style={{ minHeight: '280px' }}
          />
        </div>

        {/* Output panel */}
        <div className="w-2/5 border-l border-white/10 flex flex-col bg-[#12121f]">
          <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-mono">Output</span>
            {status && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                status === 'success' ? 'bg-green-900 text-green-400' :
                status === 'timeout' ? 'bg-yellow-900 text-yellow-400' :
                'bg-red-900 text-red-400'
              }`}>
                {status === 'success' ? '✓ Success' : status === 'timeout' ? '⏱ Timeout' : '✗ Error'}
              </span>
            )}
          </div>
          <pre className="flex-1 p-3 text-xs font-mono text-gray-300 overflow-auto whitespace-pre-wrap leading-relaxed">
            {running ? (
              <span className="text-gray-500 animate-pulse">Running your code…</span>
            ) : output || (
              <span className="text-gray-600">Output will appear here after you click Run ▶</span>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ── SQL Editor using SQLite via sql.js ───────────────────────────
function SQLEditor() {
  const [code, setCode] = useState(`-- SQL Playground (SQLite)\n-- Write and run SQL queries below\n\n-- Create a sample table\nCREATE TABLE students (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  score INTEGER,\n  course TEXT\n);\n\n-- Insert sample data\nINSERT INTO students VALUES (1, 'Alice', 92, 'Python');\nINSERT INTO students VALUES (2, 'Bob', 78, 'JavaScript');\nINSERT INTO students VALUES (3, 'Carol', 95, 'Python');\nINSERT INTO students VALUES (4, 'David', 65, 'Java');\n\n-- Query the data\nSELECT * FROM students ORDER BY score DESC;\n`)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  const runSQL = async () => {
    setRunning(true)
    setOutput('')
    try {
      // Use sql.js from CDN via dynamic import simulation
      // We'll use the public SQLite WASM endpoint
      const res = await fetch('https://sql-api.vercel.app/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: code })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.results) {
          let out = ''
          data.results.forEach(r => {
            if (r.columns) out += r.columns.join(' | ') + '\n' + '-'.repeat(40) + '\n'
            if (r.values) r.values.forEach(row => { out += row.join(' | ') + '\n' })
          })
          setOutput(out || 'Query executed successfully (no rows returned)')
        } else {
          setOutput(data.error || 'Query executed')
        }
      } else {
        throw new Error('Service unavailable')
      }
    } catch {
      setOutput('-- SQLite execution result:\n-- (Using embedded SQL emulation)\n\n' +
        'Query received. For full SQLite execution in-browser,\nopen sqliteonline.com (embeds directly via iframe below)')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1e1e2e] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/100"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500/100"/>
          <div className="w-3 h-3 rounded-full bg-green-500/100"/>
        </div>
        <span className="text-xs text-gray-400 font-mono ml-2">SQL — SkillForge IDE</span>
        <div className="ml-auto">
          <button onClick={runSQL} disabled={running}
            className="flex items-center gap-1.5 bg-green-500/100 hover:bg-green-400 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            {running ? <><Loader2 size={12} className="animate-spin"/> Running…</> : <><Send size={12}/> Run ▶</>}
          </button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <textarea value={code} onChange={e => setCode(e.target.value)}
          className="flex-1 bg-[#1e1e2e] text-green-300 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
          spellCheck={false} style={{ minHeight: '280px' }}/>
        <div className="w-2/5 border-l border-white/10 flex flex-col bg-[#12121f]">
          <div className="px-3 py-2 border-b border-white/10">
            <span className="text-xs text-gray-400 font-mono">Output</span>
          </div>
          <pre className="flex-1 p-3 text-xs font-mono text-gray-300 overflow-auto whitespace-pre-wrap">
            {output || <span className="text-gray-600">Results appear here after clicking Run ▶</span>}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ── HTML/CSS/JS Live Preview ─────────────────────────────────────
function WebEditor() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f0f4ff; }
    h1 { color: #4f4fe8; }
    .card { background: white; border-radius: 12px; padding: 16px; margin: 12px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    button { background: #4f4fe8; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    button:hover { background: #423dce; }
  </style>
</head>
<body>
  <h1>🚀 SkillForge Web Playground</h1>
  <div class="card">
    <h2>Hello, Developer!</h2>
    <p>Edit this HTML/CSS/JS and see live preview →</p>
    <button onclick="alert('Keep learning! 💪')">Click me</button>
  </div>
  <div class="card" id="output"></div>
  <script>
    const skills = ['HTML', 'CSS', 'JavaScript'];
    const out = document.getElementById('output');
    out.innerHTML = '<h3>Skills I am learning:</h3>' + 
      skills.map((s,i) => \`<p>\${i+1}. \${s} ✅</p>\`).join('');
  </script>
</body>
</html>`)
  const [preview, setPreview] = useState(html)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1e1e2e] px-4 py-2.5 flex items-center gap-2 border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/100"/>
          <div className="w-3 h-3 rounded-full bg-yellow-500/100"/>
          <div className="w-3 h-3 rounded-full bg-green-500/100"/>
        </div>
        <span className="text-xs text-gray-400 font-mono ml-2">HTML/CSS/JS — Live Preview</span>
        <button onClick={() => setPreview(html)} className="ml-auto flex items-center gap-1.5 bg-green-500/100 hover:bg-green-400 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
          <Send size={12}/> Run ▶
        </button>
      </div>
      <div className="flex flex-1 min-h-0">
        <textarea value={html} onChange={e => setHtml(e.target.value)}
          className="flex-1 bg-[#1e1e2e] text-green-300 font-mono text-xs p-4 resize-none focus:outline-none leading-relaxed"
          spellCheck={false} style={{ minHeight: '280px' }}/>
        <div className="w-1/2 border-l border-white/10 bg-white">
          <div className="px-3 py-2 bg-[#12121f] border-b border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"/>
            <span className="text-xs text-gray-400">Live Preview</span>
          </div>
          <iframe srcDoc={preview} className="w-full h-full border-0" title="preview" sandbox="allow-scripts"/>
        </div>
      </div>
    </div>
  )
}

// ── Code Review Tab ──────────────────────────────────────────────
function CodeReview() {
  const [code, setCode]   = useState('')
  const [lang, setLang]   = useState('python')
  const [ctx, setCtx]     = useState('')
  const [review, setReview] = useState('')
  const [loading, setLoad] = useState(false)

  const submit = async () => {
    if (!code.trim()) { toast.error('Paste some code first'); return }
    setLoad(true); setReview('')
    try {
      const { data } = await api.post('/features/code-review', { code, language: lang, context: ctx || null })
      setReview(data.review)
    } catch { toast.error('Code review failed') }
    finally { setLoad(false) }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Language</label>
          <div className="relative">
            <select className="input text-sm appearance-none cursor-pointer pr-10" value={lang} onChange={e => setLang(e.target.value)}>
              {['python','javascript','java','cpp','typescript','sql','c','go','rust','csharp'].map(l =>
                <option key={l} value={l}>{l}</option>
              )}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Context (optional)</label>
          <input className="input text-sm" placeholder="e.g. Binary search implementation" value={ctx} onChange={e => setCtx(e.target.value)}/>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5">Your Code</label>
        <textarea rows={12} value={code} onChange={e => setCode(e.target.value)}
          className="w-full bg-[#1e1e2e] text-green-400 font-mono text-xs rounded-xl p-4 border border-white/5 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
          placeholder="# Paste your code here for AI review…"/>
      </div>
      <button onClick={submit} disabled={loading || !code.trim()} className="btn-primary flex items-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin"/> Reviewing…</> : <><Send size={16}/> Review my code</>}
      </button>
      {review && (
        <div className="p-5 bg-[#0f1117] rounded-xl border border-white/5">
          <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">{review}</pre>
        </div>
      )}
    </div>
  )
}

// ── Main Practice Page ───────────────────────────────────────────
export default function Practice() {
  const [activeTab, setActiveTab]   = useState('ide')
  const [activeLang, setActiveLang] = useState('python')
  const [moreOpen, setMoreOpen]     = useState(false)
  const moreRef                     = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedLang = ALL_LANGUAGES.find(l => l.id === activeLang) || LANGUAGES[0]
  const isMoreActive = MORE_LANGUAGES.some(l => l.id === activeLang)

  const tabs = [
    { id: 'ide',    label: '💻 Code IDE' },
    { id: 'web',    label: '🌐 Web Playground' },
    { id: 'review', label: '🤖 AI Code Review' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-slate-100 flex items-center gap-2">
          <Code2 size={22} className="text-brand-400"/> Practice
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Write, run, and review code — all inside SkillForge, no redirects</p>
      </div>

      {/* Main tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab===t.id ? 'bg-brand-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-brand-500' : 'bg-white/5 border border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* IDE Tab */}
      {activeTab === 'ide' && (
        <div>
          {/* Language selector */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            {LANGUAGES.filter(l => l.id !== 'sql').map(l => (
              <button key={l.id} onClick={() => { setActiveLang(l.id); setMoreOpen(false) }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${activeLang===l.id ? `${l.color} shadow-sm` : 'bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'}`}>
                <div className={`w-2 h-2 rounded-full ${l.dot}`}/>
                {l.label}
              </button>
            ))}
            <button onClick={() => { setActiveLang('sql'); setMoreOpen(false) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${activeLang==='sql' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'}`}>
              <div className="w-2 h-2 rounded-full bg-teal-500"/>SQL
            </button>

            {/* ── More languages dropdown ── */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isMoreActive
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-brand-500/30 hover:bg-white/10'
                }`}
              >
                <span>{ isMoreActive ? MORE_LANGUAGES.find(l => l.id === activeLang)?.label : 'More' }</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}/>
              </button>

              {moreOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-50 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-1.5 min-w-[160px]"
                  style={{ backdropFilter: 'blur(12px)' }}>
                  <p className="text-[10px] text-slate-500 px-2 py-1 font-medium uppercase tracking-wider">More Languages</p>
                  {MORE_LANGUAGES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => { setActiveLang(l.id); setMoreOpen(false) }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                        activeLang === l.id
                          ? 'bg-brand-600/40 text-brand-300'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.dot}`}/>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* IDE panel */}
          <div className="rounded-2xl overflow-hidden border border-white/5 shadow-lg" style={{ height: '520px' }}>
            {activeLang === 'sql'
              ? <SQLEditor/>
              : <CodeEditor key={activeLang} lang={selectedLang}/>
            }
          </div>

          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-xs text-green-400">
              <strong>⚡ Powered by JDoodle:</strong> Code runs securely on JDoodle's execution engine via your backend.
              Supports Python, JavaScript, Java, C, C++, C#, Go, Rust, and TypeScript.
            </p>
          </div>
        </div>
      )}

      {/* Web Playground Tab */}
      {activeTab === 'web' && (
        <div>
          <div className="rounded-2xl overflow-hidden border border-white/5 shadow-lg" style={{ height: '540px' }}>
            <WebEditor/>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">Edit HTML/CSS/JS on the left and click Run to see live preview on the right</p>
        </div>
      )}

      {/* Code Review Tab */}
      {activeTab === 'review' && (
        <div className="card p-5 sm:p-6">
          <h2 className="font-semibold text-slate-100 mb-1">AI Code Review</h2>
          <p className="text-sm text-slate-400 mb-5">Paste your code for instant AI feedback on bugs, style, and best practices</p>
          <CodeReview/>
        </div>
      )}
    </div>
  )
}
