import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Zap, Map, Brain, Award, MessageSquare, Target,
  Star, ArrowRight, BookOpen, CheckCircle,
  Cpu, PenLine, BarChart2, Layers, Terminal
} from 'lucide-react';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#platform', label: 'Platform' },
  { href: '#reviews', label: 'Reviews' },
];

const PLATFORM_FEATURES = [
  {
    icon: Map, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20',
    title: 'Personalized AI Roadmaps',
    desc: 'Tell us what you want to learn, your level, and how much time you have. Our AI generates a structured week-by-week roadmap instantly - no templates, fully tailored to you.',
    tags: ['Skill-based', 'Week-by-week', 'Free resources'],
  },
  {
    icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
    title: 'AI-Generated Lessons',
    desc: 'Every topic in your roadmap comes with a full AI-written lesson - concept explanation, real-world examples, code walkthroughs and common mistakes. Learn without leaving SkillForge.',
    tags: ['In-app lessons', 'Code examples', 'No external links'],
  },
  {
    icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
    title: 'Quiz-Based Progress',
    desc: 'No more manual checkboxes. After studying a topic, take a 5-question AI quiz. Score 60%+ and the topic auto-completes. Your progress reflects real understanding.',
    tags: ['Auto-completion', 'AI-generated', '+15 XP per topic'],
  },
  {
    icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20',
    title: 'AI Learning Assistant',
    desc: 'A 24/7 AI mentor that knows your roadmap. Ask anything - from "explain this concept" to "review my code". Chat history is organized by roadmap for easy reference.',
    tags: ['Context-aware', 'Chat history', 'Code review'],
  },
  {
    icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20',
    title: 'Daily Challenges',
    desc: 'Every day you get a fresh challenge directly based on the topic you\'re currently studying. Submit your answer and get instant personalized AI feedback with XP rewards.',
    tags: ['Topic-specific', 'AI feedback', '+20 XP reward'],
  },
  {
    icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20',
    title: 'Embedded Practice IDE',
    desc: 'Write and run code in 10+ languages directly inside SkillForge - Python, JavaScript, Java, C++, Go, Rust and more. No installation, no redirects, no excuses.',
    tags: ['10+ languages', 'Live execution', 'Web playground'],
  },
  {
    icon: Cpu, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20',
    title: 'Interview Preparation',
    desc: 'Practice with AI-generated technical, behavioral and coding interview questions tailored to your skill and level. Get scored feedback on every answer with improvement tips.',
    tags: ['Technical', 'Behavioral', 'AI evaluation'],
  },
  {
    icon: PenLine, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20',
    title: 'Personal Notes',
    desc: 'Write and save your own notes inside every topic card. Auto-saved to your account, always there when you come back. Your personal knowledge base built as you learn.',
    tags: ['Auto-saved', 'Per topic', 'Always synced'],
  },
  {
    icon: Award, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20',
    title: 'Badges & Achievements',
    desc: 'Earn badges for every milestone - first roadmap, 7-day streak, completing 10 topics, finishing a full roadmap. Gamified learning that keeps you coming back.',
    tags: ['11 badges', 'XP system', 'Daily streaks'],
  },
  {
    icon: BarChart2, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20',
    title: 'Activity Tracking',
    desc: 'A GitHub-style contribution graph tracks every day you learn. Watch your consistency grow over the year. Your streak, XP, and completed topics all in one dashboard.',
    tags: ['Year view', 'Streak tracking', 'XP points'],
  },
];

const STEPS = [
  { num: '01', icon: Map, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20', title: 'Build your roadmap', desc: 'Choose your skill, level, goal and timeline. The AI creates your personalized week-by-week plan in seconds.' },
  { num: '02', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: 'Study AI-written lessons', desc: 'Each topic includes a full lesson with explanations, code examples, and key takeaways - all inside SkillForge.' },
  { num: '03', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: 'Take the quiz', desc: 'Complete an AI-generated quiz to verify your understanding. Pass it and the topic auto-marks as done.' },
  { num: '04', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', title: 'Daily challenge', desc: 'Every morning get a challenge based on exactly where you are in your roadmap.' },
  { num: '05', icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', title: 'Practice in the IDE', desc: 'Open the embedded IDE and write real code. Get AI code review without ever leaving the platform.' },
  { num: '06', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', title: 'Earn & level up', desc: 'Collect XP, unlock badges, and watch your activity graph fill up as you build real skills.' },
];

const SKILLS = [
  'Python', 'JavaScript', 'React', 'Machine Learning', 'DevOps',
  'Data Science', 'Java', 'Cloud Computing', 'SQL', 'TypeScript',
  'DSA & Algorithms', 'Web Development', 'Node.js', 'Docker & K8s',
  'Go', 'Rust', 'Cybersecurity', 'System Design',
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta', role: 'CS Student → SDE Intern', avatar: 'AM',
    text: 'SkillForge isn\'t just a roadmap tool - it\'s like having a personal tutor. The AI lessons are better than most YouTube tutorials, and the quiz system actually made me learn instead of just watching.',
    highlight: 'Cracked my first SDE internship using only SkillForge.',
  },
  {
    name: 'Priya Sharma', role: 'BCA Graduate', avatar: 'PS',
    text: 'I love that I never have to leave the website. I study the lesson, run code in the Practice IDE, then take the quiz - all in one place. The daily challenges keep me accountable every single day.',
    highlight: 'Maintained a 34-day streak. First time I stuck to a plan.',
  },
  {
    name: 'Rohan Verma', role: 'Working Professional', avatar: 'RV',
    text: 'The interview prep feature alone is worth it. I practiced 50+ questions with AI feedback before my interview. The feedback is specific to YOUR answer - not generic tips you\'d find on Google.',
    highlight: 'Got my first senior developer role after 3 months of prep.',
  },
];

const STATS = [
  { value: '10+', label: 'Skills covered', icon: Layers },
  { value: 'AI', label: 'Lesson generation', icon: Brain },
  { value: '10+', label: 'Languages in IDE', icon: Terminal },
  { value: '24/7', label: 'AI mentor available', icon: MessageSquare },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface-900 text-zinc-200">
      {/* Background glow effects */}
      <div className="fixed top-[15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[60%] left-[20%] w-[30%] h-[30%] rounded-full bg-sky-600/10 blur-[100px] pointer-events-none -z-10" />

      {/* ── Fixed Navbar ────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-surface-900/80 backdrop-blur-xl border-white/10 shadow-lg"
          : "bg-transparent border-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Zap size={20} className="text-white fill-white/20" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg md:text-xl text-white tracking-tight">SkillForge</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-zinc-400 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-3 md:gap-4 items-center">
            <Link to="/login" className="btn-secondary hidden sm:flex text-sm py-2 px-4">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="pt-32 md:pt-40 pb-20 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-medium text-brand-300 mb-8 backdrop-blur-md animate-fade-in shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            <Zap size={14} className="text-brand-400 fill-brand-400/20" /> AI-Powered · Learn · Practice · Get Hired
          </div>

          <h1 className="text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.1] mb-6 tracking-tight animate-slide-up">
            <span className="text-zinc-300 font-bold">The complete platform</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-sky-400 bg-clip-text text-transparent font-black drop-shadow-sm">
              to learn any skill
            </span>
            <br />
            <span className="text-zinc-500 font-bold">from scratch to job-ready</span>
          </h1>

          <p className="text-base md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up font-medium" style={{ animationDelay: '100ms' }}>
            SkillForge doesn't just give you a roadmap - it teaches you. AI lessons, quizzes, daily challenges, a practice IDE, interview prep, and an AI mentor. Everything in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up items-center" style={{ animationDelay: '200ms' }}>
            <Link to="/register" className="btn-primary text-base md:text-lg px-8 py-3.5 md:py-4 w-full sm:w-auto justify-center group">
              Start learning free <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-base md:text-lg px-8 py-3.5 md:py-4 w-full sm:w-auto justify-center">
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass-card p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                <Icon size={24} className="text-brand-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* Auto-scrolling Skills Strip */}
          <div className="mt-24 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">
              18+ Skills & Technologies Supported
            </p>
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden flex flex-col gap-4 py-2">
              {/* Fade overlays */}
              <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-surface-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-surface-900 to-transparent z-10 pointer-events-none" />

              <div className="flex w-max hover:[animation-play-state:paused] animate-scroll-x">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-4 pr-4">
                    {SKILLS.slice(0, 9).map((s) => (
                      <div key={`${i}-${s}`} className="px-6 py-3 bg-surface-800/50 backdrop-blur-sm border border-white/5 rounded-full text-sm md:text-base font-semibold text-zinc-300 whitespace-nowrap shadow-sm hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white transition-colors cursor-default">
                        {s}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex w-max hover:[animation-play-state:paused] animate-scroll-x" style={{ animationDirection: 'reverse' }}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-4 pr-4">
                    {SKILLS.slice(9, 18).map((s) => (
                      <div key={`${i}-${s}`} className="px-6 py-3 bg-surface-800/50 backdrop-blur-sm border border-white/5 rounded-full text-sm md:text-base font-semibold text-zinc-300 whitespace-nowrap shadow-sm hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white transition-colors cursor-default">
                        {s}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner ─────────────────────────────── */}
      <section className="px-6 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group border-brand-500/20 hover:border-brand-500/40 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-purple-600/10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="flex-1 relative z-10">
            <p className="text-xs font-bold text-brand-400 uppercase tracking-[0.2em] mb-3">More than a roadmap generator</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              Learn, practice & get hired - without leaving SkillForge
            </h2>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Most platforms give you a list of links. We give you the actual lesson, let you run code, test your knowledge with quizzes, and prepare you for interviews - all in one unified platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
            {[
              { icon: '📍', text: 'AI lesson for every topic' },
              { icon: '🧠', text: 'Quiz-based auto progress' },
              { icon: '💻', text: 'Embedded IDE - 10+ languages' },
              { icon: '🎯', text: 'Daily topic-specific challenges' },
              { icon: '🤝', text: 'AI interview preparation' },
              { icon: '📊', text: 'GitHub-style activity tracking' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium text-zinc-300">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Platform Features</p>
          <h2 className="text-[clamp(28px,5vw,44px)] font-bold text-white mb-6 tracking-tight">
            Everything you need to go from zero to hired
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Ten integrated features that work together. No switching between apps. No subscriptions. All free.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map(({ icon: Icon, color, bg, border, title, desc, tags }) => (
            <div key={title} className="glass-card p-8 group flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl ${bg} ${color} border ${border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow">{desc}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-surface-800/50 border border-white/10 rounded-md text-[11px] font-medium text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section id="how" className="py-24 px-6 border-y border-white/5 bg-surface-800/30 backdrop-blur-sm relative z-10 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">How it works</p>
            <h2 className="text-[clamp(28px,5vw,44px)] font-bold text-white mb-6 tracking-tight">
              Your complete learning loop
            </h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
              Every step connects to the next. SkillForge keeps you in a productive learning cycle every single day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map(({ num, icon: Icon, color, bg, border, title, desc }) => (
              <div key={num} className="glass-card p-6 flex gap-5 group items-start hover:border-brand-500/30 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className={color} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{num}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Big visual features ────────────────── */}
      <section id="platform" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">What you get</p>
          <h2 className="text-[clamp(28px,5vw,44px)] font-bold text-white mb-6 tracking-tight">
            A full learning system, not just a list of links
          </h2>
        </div>

        <div className="space-y-32">
          {[
            {
              icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',
              eyebrow: 'In-app lessons', title: 'AI writes the lesson. You just learn.',
              desc: 'Every topic in your roadmap has a full lesson generated by AI - structured explanation, real-world example, code walkthrough, and common mistakes. No searching YouTube, no reading docs. Just open the topic and start learning.',
              points: ['Full lesson for every topic', 'Code examples with explanations', 'Common mistakes section', 'Key takeaways summary'],
              flip: false,
            },
            {
              icon: Terminal, color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20',
              eyebrow: 'Practice IDE', title: 'Write real code without leaving the page.',
              desc: 'SkillForge has a built-in code editor supporting Python, JavaScript, Java, C++, TypeScript, Go, Rust, C#, SQL, and a full HTML/CSS/JS live preview. Run code, see output, get AI code review - all inside the platform.',
              points: ['10+ languages supported', 'Live code execution', 'HTML/CSS/JS live preview', 'AI code review in one click'],
              flip: true,
            },
            {
              icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20',
              eyebrow: 'Interview prep', title: 'Practice interviews with an AI that evaluates you.',
              desc: 'Get AI-generated technical, coding and behavioral interview questions tailored to your skill and level. Type your answer, submit it, and get scored feedback that references exactly what you wrote - not generic tips.',
              points: ['Technical, coding & behavioral', 'AI evaluates your exact answer', 'Score, strengths & gaps', 'Follow-up questions included'],
              flip: false,
            },
          ].map(({ icon: Icon, color, bg, border, eyebrow, title, desc, points, flip }) => (
            <div key={title} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${flip ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${bg} ${color} ${border} border mb-6`}>
                  <Icon size={14} /> {eyebrow}
                </div>
                <h3 className="text-[clamp(24px,4vw,36px)] font-bold text-white mb-4 leading-[1.2] tracking-tight">{title}</h3>
                <p className="text-base text-zinc-400 leading-relaxed mb-8">{desc}</p>
                <ul className="space-y-3">
                  {points.map((p, i) => (
                    <li key={p} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                      <CheckCircle size={18} className={i === 0 ? color : 'text-zinc-600'} /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full max-w-xl">
                <div className="glass-card p-6 border-brand-500/10 shadow-2xl group hover:border-brand-500/30 transition-all duration-500 relative overflow-hidden">
                  <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${bg} blur-[80px] group-hover:scale-150 transition-transform duration-700 opacity-50`} />

                  <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-white/5 pb-4">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center border ${border}`}>
                      <Icon size={20} className={color} />
                    </div>
                    <span className="font-semibold text-white">{eyebrow}</span>
                    <div className="ml-auto flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    {points.map((p, i) => (
                      <div key={p} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${i === 0 ? `bg-white/10 ${border}` : 'bg-surface-800/50 border-white/5'} transition-colors`}>
                        <CheckCircle size={16} className={i === 0 ? color : 'text-zinc-600'} />
                        <span className={`text-sm ${i === 0 ? 'text-white font-medium' : 'text-zinc-400'}`}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ── Testimonials ───────────────────────── */}
      <section id="reviews" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Student stories</p>
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold text-white mb-6 tracking-tight">
            Real results from real learners
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, text, highlight }) => (
            <div key={name} className="glass-card p-8 flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-6 flex-1 text-sm md:text-base italic">"{text}"</p>

              <div className="px-3 py-2 bg-brand-500/10 border border-brand-500/20 rounded-lg mb-6">
                <p className="text-xs font-semibold text-brand-300 flex items-center gap-2">
                  <span>🏆</span> {highlight}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-sm shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{name}</p>
                  <p className="text-xs text-zinc-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 relative overflow-hidden group border-brand-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-purple-600/10 to-sky-600/10 pointer-events-none opacity-80" />

          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-8 relative z-10 animate-float shadow-[0_0_30px_rgba(124,58,237,0.3)]">
            <Zap size={28} className="text-brand-400 fill-brand-400/20" />
          </div>

          <h2 className="text-[clamp(32px,5vw,48px)] font-extrabold text-white mb-6 tracking-tight relative z-10 drop-shadow-md">
            Your learning journey starts today
          </h2>
          <p className="text-lg text-zinc-300 mb-10 max-w-xl mx-auto relative z-10 font-medium">
            Build a roadmap, study AI lessons, run code, take quizzes, and track your progress - all free, all in one place.
          </p>

          <Link to="/register" className="btn-primary text-base md:text-lg px-10 py-4 mx-auto w-fit relative z-10 shadow-xl group-hover:scale-105 transition-all duration-300">
            Create free account <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-zinc-500 mt-6 relative z-10 font-medium">No credit card · No subscription · Free forever</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 bg-surface-900/80 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={14} className="text-white fill-white/20" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-sm">SkillForge</span>
          </div>
          <p className="text-xs text-zinc-500 text-center">
            AI-Based Personalized Skill Development and Learning Management System · MCA Major Project
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-xs text-zinc-500 hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="text-xs text-zinc-500 hover:text-white transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}