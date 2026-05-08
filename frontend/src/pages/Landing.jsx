// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   Zap,
//   Map,
//   Brain,
//   Award,
//   Code2,
//   MessageSquare,
//   Target,
//   Star,
//   ArrowRight,
//   Flame,
//   BookOpen,
// } from "lucide-react";

// const STATS = [
//   { value: "10+", label: "Skills to Learn", icon: Brain },
//   { value: "AI", label: "Powered Roadmaps", icon: Zap },
//   { value: "∞", label: "Learning Paths", icon: Map },
//   { value: "24/7", label: "AI Assistant", icon: MessageSquare },
// ];

// const FEATURES = [
//   {
//     icon: Zap,
//     color: "text-brand-400",
//     bg: "bg-brand-500/10",
//     title: "AI-Generated Roadmaps",
//     desc: "Tell us your skill, level and timeline. Our AI creates a detailed week-by-week plan with curated free resources in seconds.",
//   },
//   {
//     icon: Brain,
//     color: "text-purple-400",
//     bg: "bg-purple-500/10",
//     title: "Quiz-Based Progress Tracking",
//     desc: "No manual checkboxes. Complete an AI-generated quiz after each topic. Pass 60%+ and the topic auto-completes.",
//   },
//   {
//     icon: MessageSquare,
//     color: "text-green-400",
//     bg: "bg-green-500/10",
//     title: "AI Learning Assistant",
//     desc: 'Ask anything — from "explain recursion" to "review my code". Remembers your roadmap context for personalized answers.',
//   },
//   {
//     icon: Award,
//     color: "text-yellow-400",
//     bg: "bg-yellow-500/10",
//     title: "Badges & Achievements",
//     desc: "Earn badges as you progress — Pathfinder, Topic Master, Week Warrior. Gamified learning keeps you motivated.",
//   },
//   {
//     icon: Target,
//     color: "text-orange-400",
//     bg: "bg-orange-500/10",
//     title: "Daily Challenges",
//     desc: "A fresh coding challenge every day tailored to your current roadmap topic. Stay sharp and build consistency.",
//   },
//   {
//     icon: Code2,
//     color: "text-teal-400",
//     bg: "bg-teal-500/10",
//     title: "Embedded Practice IDE",
//     desc: "Write and run Python, JavaScript, Java, C++ and more — directly inside SkillForge. No external redirects.",
//   },
//   {
//     icon: BookOpen,
//     color: "text-red-400",
//     bg: "bg-red-500/10",
//     title: "AI Study Notes",
//     desc: "One click generates comprehensive notes — key concepts, code examples, common mistakes and a cheat sheet.",
//   },
//   {
//     icon: Map,
//     color: "text-cyan-400",
//     bg: "bg-cyan-500/10",
//     title: "Visual Roadmap",
//     desc: 'See your entire learning journey as a beautiful graphical roadmap with week-by-week progression and a "You are here" marker.',
//   },
// ];

// const SKILLS = [
//   "Python",
//   "JavaScript",
//   "React",
//   "Machine Learning",
//   "DevOps",
//   "Data Science",
//   "Java",
//   "Cloud Computing",
//   "SQL",
//   "TypeScript",
//   "DSA",
//   "Web Dev",
// ];

// const HOW_IT_WORKS = [
//   {
//     step: "01",
//     title: "Tell us what you want to learn",
//     desc: "Select your skills, current level, learning goal and timeline through a guided 5-step form.",
//   },
//   {
//     step: "02",
//     title: "AI builds your personalized path",
//     desc: "Our AI generates a structured roadmap with topics, subtopics and curated free resources organised by week.",
//   },
//   {
//     step: "03",
//     title: "Learn, quiz, and progress",
//     desc: "Study each topic, take an AI quiz to verify understanding, earn XP and badges as you advance.",
//   },
//   {
//     step: "04",
//     title: "Get job-ready",
//     desc: "Use Interview Prep mode, code review and daily challenges to sharpen your skills and land your dream role.",
//   },
// ];

// const TESTIMONIALS = [
//   {
//     name: "Arjun Mehta",
//     role: "CS Student → SDE Intern",
//     avatar: "AM",
//     text: "SkillForge built me a Python + DSA roadmap in seconds. The quiz-based completion made me actually learn, not just click checkboxes. Cracked my first internship!",
//     rating: 5,
//   },
//   {
//     name: "Priya Sharma",
//     role: "BCA Graduate",
//     avatar: "PS",
//     text: "The AI assistant explained React concepts better than any YouTube video. Having it tied to my roadmap context was a game changer.",
//     rating: 5,
//   },
//   {
//     name: "Rohan Verma",
//     role: "Working Professional",
//     avatar: "RV",
//     text: "Switched from manual notes to SkillForge's AI study notes. Saved hours of prep time. The daily challenges keep me consistent.",
//     rating: 5,
//   },
// ];

// export default function Landing() {
//   const [scrolled, setScrolled] = useState(false);
//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", fn);
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   return (
//     <div className="relative overflow-x-hidden min-h-screen">
//       {/* Background glow effects */}
//       <div className="fixed top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/30 blur-[120px] pointer-events-none -z-10" />
//       <div className="fixed bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none -z-10" />

//       {/* ── Fixed Navbar ────────────────────────── */}
//       <header
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           scrolled ? "bg-surface-900/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
//               <Zap size={20} className="text-white fill-white/20" strokeWidth={2} />
//             </div>
//             <span className="font-bold text-xl text-zinc-100 tracking-tight">SkillForge</span>
//           </div>
//           <nav className="hidden md:flex gap-8 text-sm font-medium">
//             <a href="#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
//             <a href="#how" className="text-zinc-400 hover:text-zinc-100 transition-colors">How it works</a>
//             <a href="#skills" className="text-zinc-400 hover:text-zinc-100 transition-colors">Skills</a>
//           </nav>
//           <div className="flex gap-4 items-center">
//             <Link to="/login" className="text-zinc-400 hover:text-zinc-100 font-medium text-sm transition-colors hidden sm:block">
//               Sign in
//             </Link>
//             <Link to="/register" className="btn-primary">
//               Get started free
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* ── Hero ───────────────────────────────── */}
//       <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
//         <div className="max-w-4xl mx-auto relative z-10">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-medium text-brand-300 mb-8 backdrop-blur-md animate-fade-in">
//             <Zap size={14} className="text-brand-400" /> AI-Powered · Quiz-Verified · Free to use
//           </div>

//           <h1 className="text-[clamp(40px,7vw,72px)] font-bold leading-[1.1] mb-6 tracking-tight animate-slide-up">
//             <span className="text-zinc-200">Your personalized</span>
//             <br />
//             <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
//               learning roadmap
//             </span>
//             <br />
//             <span className="text-zinc-500">starts here</span>
//           </h1>

//           <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
//             SkillForge uses AI to generate a structured, week-by-week learning
//             path for any tech skill. Verify your learning with quizzes, get AI
//             mentorship, and track real progress.
//           </p>

//           <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
//             <Link to="/register" className="btn-primary text-lg px-8 py-4">
//               Build my roadmap <ArrowRight size={20} className="ml-2" />
//             </Link>
//             <Link to="/login" className="btn-secondary text-lg px-8 py-4">
//               Sign in
//             </Link>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
//             {STATS.map(({ value, label, icon: Icon }) => (
//               <div key={label} className="glass-card p-6 text-center group hover:-translate-y-2 transition-transform duration-300">
//                 <Icon size={24} className="text-brand-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
//                 <div className="text-3xl font-bold text-zinc-100 mb-1">{value}</div>
//                 <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Skills strip ───────────────────────── */}
//       <section id="skills" className="py-12 border-y border-white/5 bg-surface-900/50 backdrop-blur-sm relative z-10">
//         <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">
//           Skills you can learn
//         </p>
//         <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto px-6">
//           {SKILLS.map((s) => (
//             <span key={s} className="px-5 py-2.5 glass-card !rounded-full text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:border-brand-500/50 transition-colors cursor-default">
//               {s}
//             </span>
//           ))}
//         </div>
//       </section>

//       {/* ── Features ───────────────────────────── */}
//       <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-20">
//           <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
//             Everything you need to learn effectively
//           </h2>
//           <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
//             Not just a roadmap generator — a complete AI learning companion that
//             adapts to you.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
//             <div key={title} className="glass-card p-8 group">
//               <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
//                 <Icon size={24} />
//               </div>
//               <h3 className="text-lg font-bold text-zinc-100 mb-3">{title}</h3>
//               <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── How it works ───────────────────────── */}
//       <section id="how" className="py-32 px-6 border-y border-white/5 bg-surface-800/20 backdrop-blur-sm relative z-10">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-20">
//             <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
//               How SkillForge works
//             </h2>
//             <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
//               From zero to job-ready in four simple steps
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {HOW_IT_WORKS.map(({ step, title, desc }) => (
//               <div key={step} className="relative group">
//                 <div className="text-6xl font-black text-brand-500/10 mb-6 group-hover:text-brand-500/20 transition-colors">{step}</div>
//                 <h3 className="text-xl font-bold text-zinc-100 mb-4">{title}</h3>
//                 <p className="text-zinc-400 leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Testimonials ───────────────────────── */}
//       <section className="py-32 px-6 max-w-6xl mx-auto relative z-10">
//         <div className="text-center mb-20">
//           <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
//             Loved by learners
//           </h2>
//           <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
//             Real stories from students who transformed their careers
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {TESTIMONIALS.map(({ name, role, avatar, text, rating }) => (
//             <div key={name} className="glass-card p-8 flex flex-col h-full">
//               <div className="flex gap-1 mb-6">
//                 {Array.from({ length: rating }).map((_, i) => (
//                   <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
//                 ))}
//               </div>
//               <p className="text-zinc-300 leading-relaxed mb-8 flex-1 italic">"{text}"</p>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-sm">
//                   {avatar}
//                 </div>
//                 <div>
//                   <p className="font-bold text-zinc-100">{name}</p>
//                   <p className="text-xs text-zinc-500">{role}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── CTA ────────────────────────────────── */}
//       <section className="py-32 px-6 relative z-10">
//         <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 pointer-events-none" />
//           <Flame size={48} className="text-brand-400 mx-auto mb-6 animate-pulse-soft" />
//           <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight relative z-10">
//             Start learning smarter today
//           </h2>
//           <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto relative z-10">
//             Join thousands of students using AI to build real skills, pass
//             quizzes, and get job-ready — completely free.
//           </p>
//           <Link to="/register" className="btn-primary text-lg px-10 py-5 mx-auto w-fit relative z-10">
//             Create free account <ArrowRight size={20} className="ml-2" />
//           </Link>
//         </div>
//       </section>

//       {/* ── Footer ─────────────────────────────── */}
//       <footer className="border-t border-white/5 py-10 px-6 bg-surface-900/50 backdrop-blur-md relative z-10">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
//               <Zap size={14} className="text-white fill-white/20" strokeWidth={2} />
//             </div>
//             <span className="font-bold text-zinc-100">SkillForge</span>
//           </div>
//           <p className="text-sm text-zinc-500">
//             AI-Driven Personalized Learning Path Generator · MCA Major Project
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }


import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import {
  Zap, Map, Brain, Award, Code2, MessageSquare, Target,
  Star, ArrowRight, Flame, BookOpen, CheckCircle, ChevronRight,
  Play, Users, TrendingUp, Shield, Clock, Cpu, PenLine,
  BarChart2, Layers, Terminal
} from 'lucide-react'

/* ── Design tokens ──────────────────────────────────── */
const BG = '#080a10'
const CARD = '#0f1218'
const CARD2 = '#13161f'
const BORDER = 'rgba(255,255,255,0.06)'
const BORDER2 = 'rgba(255,255,255,0.1)'
const T1 = '#f0f2f8'
const T2 = '#8892a4'
const T3 = '#3d4558'
const BRAND = '#6366f1'
const BRAND2 = '#818cf8'

/* ── Reusable atoms ─────────────────────────────────── */
const Pill = ({ children, style }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500,
    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
    color: BRAND2, ...style
  }}>{children}</span>
)

const GradText = ({ children, style }) => (
  <span style={{
    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', ...style
  }}>{children}</span>
)

const SectionLabel = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 14, textAlign: 'center' }}>{children}</p>
)

/* ── Data ───────────────────────────────────────────── */
const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#platform', label: 'Platform' },
  { href: '#reviews', label: 'Reviews' },
]

const PLATFORM_FEATURES = [
  {
    icon: Map, color: '#818cf8', bg: 'rgba(99,102,241,0.12)',
    title: 'Personalized AI Roadmaps',
    desc: 'Tell us what you want to learn, your level, and how much time you have. Our AI generates a structured week-by-week roadmap instantly — no templates, fully tailored to you.',
    tags: ['Skill-based', 'Week-by-week', 'Free resources'],
  },
  {
    icon: BookOpen, color: '#34d399', bg: 'rgba(52,211,153,0.12)',
    title: 'AI-Generated Lessons',
    desc: 'Every topic in your roadmap comes with a full AI-written lesson — concept explanation, real-world examples, code walkthroughs and common mistakes. Learn without leaving SkillForge.',
    tags: ['In-app lessons', 'Code examples', 'No external links'],
  },
  {
    icon: Brain, color: '#c084fc', bg: 'rgba(192,132,252,0.12)',
    title: 'Quiz-Based Progress',
    desc: 'No more manual checkboxes. After studying a topic, take a 5-question AI quiz. Score 60%+ and the topic auto-completes. Your progress reflects real understanding.',
    tags: ['Auto-completion', 'AI-generated', '+15 XP per topic'],
  },
  {
    icon: MessageSquare, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',
    title: 'AI Learning Assistant',
    desc: 'A 24/7 AI mentor that knows your roadmap. Ask anything — from "explain this concept" to "review my code". Chat history is organized by roadmap for easy reference.',
    tags: ['Context-aware', 'Chat history', 'Code review'],
  },
  {
    icon: Target, color: '#fb923c', bg: 'rgba(251,146,60,0.12)',
    title: 'Daily Challenges',
    desc: 'Every day you get a fresh challenge directly based on the topic you\'re currently studying. Submit your answer and get instant personalized AI feedback with XP rewards.',
    tags: ['Topic-specific', 'AI feedback', '+20 XP reward'],
  },
  {
    icon: Terminal, color: '#4ade80', bg: 'rgba(74,222,128,0.12)',
    title: 'Embedded Practice IDE',
    desc: 'Write and run code in 10+ languages directly inside SkillForge — Python, JavaScript, Java, C++, Go, Rust and more. No installation, no redirects, no excuses.',
    tags: ['10+ languages', 'Live execution', 'Web playground'],
  },
  {
    icon: Cpu, color: '#f472b6', bg: 'rgba(244,114,182,0.12)',
    title: 'Interview Preparation',
    desc: 'Practice with AI-generated technical, behavioral and coding interview questions tailored to your skill and level. Get scored feedback on every answer with improvement tips.',
    tags: ['Technical', 'Behavioral', 'AI evaluation'],
  },
  {
    icon: PenLine, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',
    title: 'Personal Notes',
    desc: 'Write and save your own notes inside every topic card. Auto-saved to your account, always there when you come back. Your personal knowledge base built as you learn.',
    tags: ['Auto-saved', 'Per topic', 'Always synced'],
  },
  {
    icon: Award, color: '#fb923c', bg: 'rgba(251,146,60,0.12)',
    title: 'Badges & Achievements',
    desc: 'Earn badges for every milestone — first roadmap, 7-day streak, completing 10 topics, finishing a full roadmap. Gamified learning that keeps you coming back.',
    tags: ['11 badges', 'XP system', 'Daily streaks'],
  },
  {
    icon: BarChart2, color: '#818cf8', bg: 'rgba(99,102,241,0.12)',
    title: 'Activity Tracking',
    desc: 'A GitHub-style contribution graph tracks every day you learn. Watch your consistency grow over the year. Your streak, XP, and completed topics all in one dashboard.',
    tags: ['Year view', 'Streak tracking', 'XP points'],
  },
]

const STEPS = [
  { num: '01', icon: Map, color: BRAND2, title: 'Build your roadmap', desc: 'Choose your skill, level, goal and timeline. The AI creates your personalized week-by-week plan in seconds.' },
  { num: '02', icon: BookOpen, color: '#34d399', title: 'Study AI-written lessons', desc: 'Each topic includes a full lesson with explanations, code examples, and key takeaways — all inside SkillForge.' },
  { num: '03', icon: Brain, color: '#c084fc', title: 'Take the quiz', desc: 'Complete an AI-generated quiz to verify your understanding. Pass it and the topic auto-marks as done.' },
  { num: '04', icon: Target, color: '#fb923c', title: 'Daily challenge', desc: 'Every morning get a challenge based on exactly where you are in your roadmap.' },
  { num: '05', icon: Terminal, color: '#4ade80', title: 'Practice in the IDE', desc: 'Open the embedded IDE and write real code. Get AI code review without ever leaving the platform.' },
  { num: '06', icon: Award, color: '#fbbf24', title: 'Earn & level up', desc: 'Collect XP, unlock badges, and watch your activity graph fill up as you build real skills.' },
]

const SKILLS = [
  'Python', 'JavaScript', 'React', 'Machine Learning', 'DevOps',
  'Data Science', 'Java', 'Cloud Computing', 'SQL', 'TypeScript',
  'DSA & Algorithms', 'Web Development', 'Node.js', 'Docker & K8s',
  'Go', 'Rust', 'Cybersecurity', 'System Design',
]

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta', role: 'CS Student → SDE Intern', avatar: 'AM',
    text: 'SkillForge isn\'t just a roadmap tool — it\'s like having a personal tutor. The AI lessons are better than most YouTube tutorials, and the quiz system actually made me learn instead of just watching.',
    highlight: 'Cracked my first SDE internship using only SkillForge.',
  },
  {
    name: 'Priya Sharma', role: 'BCA Graduate', avatar: 'PS',
    text: 'I love that I never have to leave the website. I study the lesson, run code in the Practice IDE, then take the quiz — all in one place. The daily challenges keep me accountable every single day.',
    highlight: 'Maintained a 34-day streak. First time I stuck to a plan.',
  },
  {
    name: 'Rohan Verma', role: 'Working Professional', avatar: 'RV',
    text: 'The interview prep feature alone is worth it. I practiced 50+ questions with AI feedback before my interview. The feedback is specific to YOUR answer — not generic tips you\'d find on Google.',
    highlight: 'Got my first senior developer role after 3 months of prep.',
  },
]

const STATS = [
  { value: '10+', label: 'Skills covered', icon: Layers },
  { value: 'AI', label: 'Lesson generation', icon: Brain },
  { value: '10+', label: 'Languages in IDE', icon: Terminal },
  { value: '24/7', label: 'AI mentor available', icon: MessageSquare },
]

/* ── NavLink atom ───────────────────────────────────── */
function NavA({ href, children }) {
  return (
    <a href={href} style={{ color: T2, textDecoration: 'none', fontSize: 14, transition: 'color 0.15s' }}
      onMouseEnter={e => e.target.style.color = T1}
      onMouseLeave={e => e.target.style.color = T2}>
      {children}
    </a>
  )
}

/* ── Feature Card ───────────────────────────────────── */
function FeatureCard({ icon: Icon, color, bg, title, desc, tags }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: CARD, border: `1px solid ${hovered ? 'rgba(99,102,241,0.3)' : BORDER}`,
        borderRadius: 20, padding: 24, transition: 'all 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
      }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Icon size={22} color={color} />
      </div>
      <h3 style={{ fontWeight: 600, fontSize: 15, color: T1, marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 13, color: T2, lineHeight: 1.65, marginBottom: 14 }}>{desc}</p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: 11, color: T3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 6, padding: '3px 8px' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Main ───────────────────────────────────────────── */
export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const btnPrimary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: BRAND, color: '#fff', fontWeight: 600, fontSize: 15,
    textDecoration: 'none', padding: '12px 28px', borderRadius: 12,
    transition: 'all 0.15s', border: 'none', cursor: 'pointer',
  }
  const btnSecondary = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'transparent', color: T2, fontWeight: 500, fontSize: 15,
    textDecoration: 'none', padding: '12px 24px', borderRadius: 12,
    border: `1px solid ${BORDER2}`, transition: 'all 0.15s',
  }

  return (
    <div style={{ background: BG, color: T1, fontFamily: 'DM Sans, system-ui, sans-serif', overflowX: 'hidden', lineHeight: 1 }}>

      {/* ── Navbar ──────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,10,16,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: T1 }}>SkillForge</span>
          </div>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {NAV_LINKS.map(l => <NavA key={l.href} href={l.href}>{l.label}</NavA>)}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/login" style={btnSecondary}
              onMouseEnter={e => { e.currentTarget.style.color = T1; e.currentTarget.style.borderColor = BORDER2 }}
              onMouseLeave={e => { e.currentTarget.style.color = T2; e.currentTarget.style.borderColor = BORDER2 }}>
              Sign in
            </Link>
            <Link to="/register" style={btnPrimary}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = BRAND}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section style={{ paddingTop: 160, paddingBottom: 100, paddingLeft: 24, paddingRight: 24, textAlign: 'center', position: 'relative' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, left: '15%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 200, right: '15%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <Pill style={{ marginBottom: 28 }}>
            <Zap size={12} /> AI-Powered · Learn · Practice · Get Hired — All in One Place
          </Pill>

          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-2px' }}>
            <span style={{ color: '#cbd5e1' }}>The complete platform</span><br />
            <GradText>to learn any skill</GradText><br />
            <span style={{ color: '#334155' }}>from scratch to job-ready</span>
          </h1>

          <p style={{ fontSize: 18, color: T2, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 40px', fontWeight: 400 }}>
            SkillForge doesn't just give you a roadmap — it teaches you. AI lessons, quizzes, daily challenges, a practice IDE, interview prep, and an AI mentor. Everything in one place.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link to="/register" style={{ ...btnPrimary, fontSize: 16, padding: '14px 32px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = BRAND}>
              Start learning free <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ ...btnSecondary, fontSize: 16, padding: '14px 28px' }}
              onMouseEnter={e => { e.currentTarget.style.color = T1; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = T2; e.currentTarget.style.borderColor = BORDER2 }}>
              Sign in
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 620, margin: '0 auto' }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px 12px', textAlign: 'center' }}>
                <Icon size={17} color={BRAND2} style={{ margin: '0 auto 8px', display: 'block' }} />
                <div style={{ fontSize: 22, fontWeight: 800, color: T1, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: T3, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Not just a roadmap generator banner ─ */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(192,132,252,0.08) 100%)', border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 24, padding: '40px 48px', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: BRAND2, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>More than a roadmap generator</p>
            <h2 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, color: T1, marginBottom: 12, lineHeight: 1.2 }}>
              Learn, practice & get hired — without leaving SkillForge
            </h2>
            <p style={{ fontSize: 14, color: T2, lineHeight: 1.65 }}>
              Most platforms give you a list of links. We give you the actual lesson, let you run code, test your knowledge with quizzes, and prepare you for interviews — all in one unified platform.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '📍', text: 'AI lesson for every topic' },
              { icon: '🧠', text: 'Quiz-based auto progress' },
              { icon: '💻', text: 'Embedded IDE — 10+ languages' },
              { icon: '🎯', text: 'Daily topic-specific challenges' },
              { icon: '🤝', text: 'AI interview preparation' },
              { icon: '📊', text: 'GitHub-style activity tracking' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: T2 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All features grid ────────────────────── */}
      <section id="features" style={{ padding: '0 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionLabel>Platform Features</SectionLabel>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: T1, textAlign: 'center', marginBottom: 12, letterSpacing: '-0.5px' }}>
          Everything you need to go from zero to hired
        </h2>
        <p style={{ fontSize: 16, color: T2, textAlign: 'center', marginBottom: 56, maxWidth: 520, margin: '0 auto 56px' }}>
          Ten integrated features that work together. No switching between apps. No subscriptions. All free.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {PLATFORM_FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── How it works ─────────────────────────── */}
      <section id="how" style={{ padding: '80px 24px', background: '#0b0d14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionLabel>How it works</SectionLabel>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: T1, textAlign: 'center', marginBottom: 12 }}>Your complete learning loop</h2>
          <p style={{ fontSize: 16, color: T2, textAlign: 'center', maxWidth: 480, margin: '0 auto 60px', lineHeight: 1.6 }}>
            Every step connects to the next. SkillForge keeps you in a productive learning cycle every single day.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {STEPS.map(({ num, icon: Icon, color, title, desc }) => (
              <div key={num} style={{ display: 'flex', gap: 18, padding: 24, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={color} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T3 }}>{num}</span>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, fontSize: 15, color: T1, marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: T2, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform showcase (visual) ───────────── */}
      <section id="platform" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionLabel>What you get</SectionLabel>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: T1, textAlign: 'center', marginBottom: 56 }}>
          A full learning system, not just a list of links
        </h2>

        {/* Big feature rows */}
        {[
          {
            icon: BookOpen, color: '#34d399', bg: 'rgba(52,211,153,0.1)',
            eyebrow: 'In-app lessons',
            title: 'AI writes the lesson. You just learn.',
            desc: 'Every topic in your roadmap has a full lesson generated by AI — structured explanation, real-world example, code walkthrough, and common mistakes. No searching YouTube, no reading docs. Just open the topic and start learning.',
            points: ['Full lesson for every topic', 'Code examples with explanations', 'Common mistakes section', 'Key takeaways summary'],
            flip: false,
          },
          {
            icon: Terminal, color: '#4ade80', bg: 'rgba(74,222,128,0.1)',
            eyebrow: 'Practice IDE',
            title: 'Write real code without leaving the page.',
            desc: 'SkillForge has a built-in code editor supporting Python, JavaScript, Java, C++, TypeScript, Go, Rust, C#, SQL, and a full HTML/CSS/JS live preview. Run code, see output, get AI code review — all inside the platform.',
            points: ['10+ languages supported', 'Live code execution', 'HTML/CSS/JS live preview', 'AI code review in one click'],
            flip: true,
          },
          {
            icon: Brain, color: '#c084fc', bg: 'rgba(192,132,252,0.1)',
            eyebrow: 'Interview prep',
            title: 'Practice interviews with an AI that evaluates you.',
            desc: 'Get AI-generated technical, coding and behavioral interview questions tailored to your skill and level. Type your answer, submit it, and get scored feedback that references exactly what you wrote — not generic tips.',
            points: ['Technical, coding & behavioral', 'AI evaluates your exact answer', 'Score, strengths & gaps', 'Follow-up questions included'],
            flip: false,
          },
        ].map(({ icon: Icon, color, bg, eyebrow, title, desc, points, flip }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 64, marginBottom: 100, flexDirection: flip ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: bg, border: `1px solid ${color}30`, borderRadius: 999, fontSize: 12, fontWeight: 600, color, marginBottom: 20 }}>
                <Icon size={13} /> {eyebrow}
              </div>
              <h3 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: T1, marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.5px' }}>{title}</h3>
              <p style={{ fontSize: 15, color: T2, lineHeight: 1.7, marginBottom: 24 }}>{desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {points.map(p => (
                  <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: T2 }}>
                    <CheckCircle size={15} color={color} style={{ flexShrink: 0 }} />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1, minWidth: 280, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: 32, minHeight: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: T1 }}>{eyebrow}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#f87171' : i === 1 ? '#facc15' : '#4ade80' }} />)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {points.map((p, i) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: i === 0 ? `${color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${i === 0 ? `${color}25` : BORDER}`, borderRadius: 10 }}>
                    <CheckCircle size={14} color={i === 0 ? color : T3} />
                    <span style={{ fontSize: 13, color: i === 0 ? T1 : T2 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Skills strip ─────────────────────────── */}
      <section style={{ padding: '0 0 80px', overflow: 'hidden' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: 3, textAlign: 'center', marginBottom: 24 }}>18 skills and counting</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          {SKILLS.map(s => (
            <span key={s} style={{ padding: '8px 18px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: T2 }}>{s}</span>
          ))}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section id="reviews" style={{ padding: '80px 24px', background: '#0b0d14' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionLabel>Student stories</SectionLabel>
          <h2 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 700, color: T1, textAlign: 'center', marginBottom: 52 }}>Real results from real learners</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(({ name, role, avatar, text, highlight }) => (
              <div key={name} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2, 3, 4].map(i => <Star key={i} size={13} fill="#facc15" color="#facc15" />)}
                </div>
                <p style={{ fontSize: 13, color: T2, lineHeight: 1.7, flex: 1 }}>"{text}"</p>
                <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: BRAND2, fontWeight: 500 }}>🏆 {highlight}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BRAND2 }}>{avatar}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: T1, margin: 0 }}>{name}</p>
                    <p style={{ fontSize: 11, color: T3, margin: 0 }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(192,132,252,0.08) 50%, rgba(56,189,248,0.06) 100%)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 28, padding: '72px 48px' }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={26} color={BRAND2} />
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 5vw, 40px)', fontWeight: 800, color: T1, marginBottom: 16, letterSpacing: '-0.5px' }}>
              Your learning journey starts today
            </h2>
            <p style={{ fontSize: 16, color: T2, marginBottom: 36, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 36px' }}>
              Build a roadmap, study AI lessons, run code, take quizzes, and track your progress — all free, all in one place.
            </p>
            <Link to="/register" style={{ ...btnPrimary, fontSize: 16, padding: '15px 36px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.background = BRAND}>
              Create free account <ArrowRight size={18} />
            </Link>
            <p style={{ fontSize: 12, color: T3, marginTop: 16 }}>No credit card · No subscription · Free forever</p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: T1 }}>SkillForge</span>
          </div>
          <p style={{ fontSize: 12, color: T3, textAlign: 'center' }}>
            AI-Based Personalized Skill Development and Learning Management System · MCA Major Project
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/login" style={{ fontSize: 13, color: T3, textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = T2} onMouseLeave={e => e.target.style.color = T3}>Sign in</Link>
            <Link to="/register" style={{ fontSize: 13, color: T3, textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = T2} onMouseLeave={e => e.target.style.color = T3}>Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}