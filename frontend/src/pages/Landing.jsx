import { Link } from 'react-router-dom';
import { useEffect,useState } from 'react';
import {
  Zap,Map,Brain,Award,MessageSquare,Target,
  Star,ArrowRight,BookOpen,CheckCircle,
  Cpu,PenLine,BarChart2,Layers,Terminal,
  Github,Twitter,Linkedin,ChevronRight,LayoutDashboard,Code2,ShieldCheck,Sparkles,Globe,
  Route
} from 'lucide-react';
import { targetArrow } from '@lucide/lab';
import SkillForge_Logo_BG from '../assets/SkillForge_Logo_BG.png'

const TargetArrowIcon = ({ size = 24,className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-target-arrow ${className}`}
  >
    {targetArrow.map(([tag,attrs],index) => {
      const Tag = tag;
      return <Tag key={attrs.key || index} {...attrs} />;
    })}
  </svg>
);

const NAV_LINKS = [
  { href: '#features',label: 'Features' },
  { href: '#how-it-helps',label: 'Why SkillForge?' },
  { href: '#how-it-works',label: 'How it works' },
  // { href: '#reviews', label: 'Reviews' },
];

const PLATFORM_FEATURES = [
  {
    icon: Route,color: 'text-brand-400',bg: 'bg-brand-500/10',border: 'border-brand-500/20',
    title: 'Personalized AI Roadmaps',
    desc: 'Structured week-by-week plans customized to your skill level and timeline. No generic templates.',
    size: 'md:col-span-2 lg:col-span-2'
  },
  {
    icon: BookOpen,color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',
    title: 'AI-Generated Lessons',
    desc: 'Comprehensive, in-app lessons with real-world code examples and explanations for every topic.',
    size: 'md:col-span-1 lg:col-span-1'
  },
  {
    icon: Terminal,color: 'text-sky-400',bg: 'bg-sky-500/10',border: 'border-sky-500/20',
    title: 'Embedded Practice IDE',
    desc: 'Write, run, and test code in 10+ languages (Python, JS, Java, etc.) directly in your browser without any setup.',
    size: 'md:col-span-1 lg:col-span-1'
  },
  {
    icon: Target,color: 'text-orange-400',bg: 'bg-orange-500/10',border: 'border-orange-500/20',
    title: 'Daily Challenges',
    desc: 'Receive fresh, context-aware coding challenges daily. Get instant AI feedback and earn XP.',
    size: 'md:col-span-1 lg:col-span-1'
  },
  {
    icon: Cpu,color: 'text-pink-400',bg: 'bg-pink-500/10',border: 'border-pink-500/20',
    title: 'Interview Preparation',
    desc: 'Practice technical and behavioral rounds with our AI evaluator. Receive scored feedback and actionable tips.',
    size: 'md:col-span-1 lg:col-span-1'
  },
  {
    icon: MessageSquare,color: 'text-purple-400',bg: 'bg-purple-500/10',border: 'border-purple-500/20',
    title: 'AI Learning Assistant',
    desc: 'Your 24/7 mentor. Ask questions, get code reviews, and clarify concepts instantly while studying.',
    size: 'md:col-span-2 lg:col-span-2'
  },
  {
    icon: Brain,color: 'text-yellow-400',bg: 'bg-yellow-500/10',border: 'border-yellow-500/20',
    title: 'Quiz-Based Progress',
    desc: 'Auto-complete topics by passing AI-generated quizzes. Ensure you actually understand the material.',
    size: 'md:col-span-1 lg:col-span-1'
  },
  {
    icon: Award,color: 'text-brand-400',bg: 'bg-brand-500/10',border: 'border-brand-500/20',
    title: 'Gamification & Tracking',
    desc: 'Earn badges, level up your XP, and visualize your consistency with a activity graph.',
    size: 'md:col-span-3 lg:col-span-3'
  },
];

const HOW_IT_HELPS = [
  {
    title: "Everything in one place",
    desc: "Stop juggling between YouTube tutorials, documentation, and a local code editor. SkillForge brings lessons, practice, and evaluation into a single, unified workspace.",
    icon: LayoutDashboard,
    color: "text-brand-400",bg: "bg-brand-500/10"
  },
  {
    title: "Active Learning > Passive Watching",
    desc: "Tutorial hell is real. We force you to write code, take quizzes, and solve challenges. You only progress when the AI verifies your understanding.",
    icon: Code2,
    color: "text-emerald-400",bg: "bg-emerald-500/10"
  },
  {
    title: "Job-Ready Preparation",
    desc: "Learning syntax isn't enough. Our AI interview preparation simulator trains you for the real deal, evaluating both your technical answers and communication skills.",
    icon: ShieldCheck,
    color: "text-sky-400",bg: "bg-sky-500/10"
  }
];

const SKILLS = [
  'Python','JavaScript','React','Machine Learning','DevOps',
  'Data Science','Java','Cloud Computing','SQL','TypeScript',
  'DSA & Algorithms','Web Development','Node.js','Docker & K8s',
  'Go','Rust','Cybersecurity','System Design',
];

const TESTIMONIALS = [
  {
    name: 'Arjun Mehta',role: 'CS Student → SDE Intern',avatar: 'AM',
    text: 'SkillForge isn\'t just a roadmap tool - it\'s like having a personal tutor. The AI lessons are better than most YouTube tutorials, and the quiz system actually made me learn.',
    highlight: 'Cracked my first SDE internship using only SkillForge.',
  },
  {
    name: 'Priya Sharma',role: 'BCA Graduate',avatar: 'PS',
    text: 'I love that I never have to leave the website. I study the lesson, run code in the Practice IDE, then take the quiz. The daily challenges keep me accountable.',
    highlight: 'Maintained a 34-day streak. First time I stuck to a plan.',
  },
  {
    name: 'Rohan Verma',role: 'Working Professional',avatar: 'RV',
    text: 'The interview prep feature alone is worth it. I practiced 50+ questions with AI feedback before my interview. The feedback is specific to YOUR answer.',
    highlight: 'Got my first senior developer role after 3 months of prep.',
  },
];

export default function Landing() {
  const [scrolled,setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll',fn);
    return () => window.removeEventListener('scroll',fn);
  },[]);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface-900 text-zinc-200 selection:bg-brand-500 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/15 blur-[150px] pointer-events-none -z-10 animate-pulse-soft" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-600/10 blur-[150px] pointer-events-none -z-10 animate-pulse-soft" style={{ animationDelay: '2s' }} />
      <div className="fixed top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none -z-10 animate-float" />

      {/* ── Fixed Navbar ────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-surface-900/80 backdrop-blur-xl border-white/10 shadow-lg py-3"
          : "bg-transparent border-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Zap size={22} className="text-white fill-white/20 relative z-10" strokeWidth={2.5} />
            </div> */}
            <img src={SkillForge_Logo_BG} className='h-9 ' alt="SkillForge_Logo" srcset="" />
            <a href="#"><span className="font-bold text-xl text-white tracking-tight">SkillForge</span></a>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-zinc-400 hover:text-white transition-all">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-3 md:gap-4 items-center">
            <Link to="/login" className="btn-ghost hidden sm:flex text-sm py-2 px-4">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5 group">
              Get started <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="pt-36 md:pt-40 pb-20 px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-5xl mx-auto relative z-10 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-semibold text-brand-300 mb-8 backdrop-blur-md animate-slide-up shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            <Sparkles size={14} className="text-brand-400" /> The Future of Interactive Learning
          </div>

          {/* <h1 className="text-[clamp(40px,7vw,80px)] font-black leading-[1.05] mb-6 tracking-tight animate-slide-up drop-shadow-lg" style={{ animationDelay: '100ms' }}>
            <span className="text-zinc-100">Master any skill with your </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">AI Co-Pilot</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-sky-400 rounded-full blur-sm opacity-60"></div>
            </span>
          </h1> */}

          <h1 className="text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.1] mb-6 tracking-tight animate-slide-up">
            <span className="text-zinc-300 font-bold">The complete platform</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-sky-400 bg-clip-text text-transparent font-black drop-shadow-sm">
              to learn any skill
            </span>
            <br />
            <span className="text-zinc-500 font-bold">from scratch to job-ready</span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-400 leading-relaxed mb-10 max-w-3xl mx-auto animate-slide-up font-medium" style={{ animationDelay: '200ms' }}>
            Ditch the endless tutorials. SkillForge generates custom roadmaps, provides AI lessons, embeds a full practice IDE, and prepares you for interviews. <strong>All in one unified platform.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-slide-up items-center" style={{ animationDelay: '300ms' }}>
            <Link to="/register" className="btn-primary text-base md:text-lg px-8 py-4 w-full sm:w-auto justify-center group shadow-[0_0_30px_rgba(124,58,237,0.4)]">
              Start Learning for Free <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="btn-secondary text-base md:text-lg px-8 py-4 w-full sm:w-auto justify-center">
              Explore Features
            </a>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-20 w-full max-w-4xl mx-auto relative animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent z-20 pointer-events-none h-full" />
            <div className="glass-card p-2 rounded-2xl md:rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors duration-500" />
              <div className="bg-surface-900 rounded-xl md:rounded-[1.5rem] border border-white/5 overflow-hidden flex flex-col h-[300px] md:h-[500px]">
                {/* Mock Browser Top */}
                <div className="bg-surface-800 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="mx-auto bg-surface-900 px-4 py-1.5 rounded-md text-xs text-zinc-500 font-mono w-1/2 text-center truncate border border-white/5">skillforge.app/dashboard</div>
                </div>
                {/* Mock Content */}
                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 opacity-80">
                  <div className="flex-1 space-y-4">
                    <div className="h-6 w-1/3 bg-white/10 rounded-md animate-pulse"></div>
                    <div className="h-4 w-full bg-white/5 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-white/5 rounded-md"></div>
                    <div className="h-24 w-full bg-brand-500/20 border border-brand-500/30 rounded-xl mt-4"></div>
                  </div>
                  <div className="w-full md:w-1/3 glass-card bg-surface-800/80 border-white/5 rounded-xl p-4 flex flex-col gap-3">
                    <div className="h-4 w-1/2 bg-white/10 rounded-md"></div>
                    <div className="h-8 w-full bg-white/5 rounded-md"></div>
                    <div className="h-8 w-full bg-white/5 rounded-md"></div>
                    <div className="h-8 w-full bg-brand-500/40 rounded-md mt-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Auto-scrolling Skills Strip ───────────────── */}
      <section className="py-10 border-y border-white/5 bg-surface-900/50 backdrop-blur-sm">
        <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">
          Supporting 18+ Technologies & Growing
        </p>
        <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden flex flex-col gap-4 py-2">
          <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 bg-gradient-to-r from-surface-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 bg-gradient-to-l from-surface-900 to-transparent z-10 pointer-events-none" />

          <div className="flex w-max hover:[animation-play-state:paused] animate-scroll-x">
            {[...Array(2)].map((_,i) => (
              <div key={i} className="flex gap-4 pr-4">
                {SKILLS.slice(0,9).map((s) => (
                  <div key={`${i}-${s}`} className="px-6 py-3 glass-card border-white/5 rounded-full text-sm md:text-base font-semibold text-zinc-300 whitespace-nowrap shadow-sm hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white transition-all cursor-default flex items-center gap-2">
                    <Globe size={16} className="text-brand-400" /> {s}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex w-max hover:[animation-play-state:paused] animate-scroll-x" style={{ animationDirection: 'reverse' }}>
            {[...Array(2)].map((_,i) => (
              <div key={i} className="flex gap-4 pr-4">
                {SKILLS.slice(9,18).map((s) => (
                  <div key={`${i}-${s}`} className="px-6 py-3 glass-card border-white/5 rounded-full text-sm md:text-base font-semibold text-zinc-300 whitespace-nowrap shadow-sm hover:border-brand-500/40 hover:bg-brand-500/10 hover:text-white transition-all cursor-default flex items-center gap-2">
                    <Globe size={16} className="text-brand-400" /> {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Helps You (Why SkillForge?) ─────────── */}
      <section id="how-it-helps" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-brand-400 uppercase tracking-[0.2em] mb-4">Why SkillForge?</p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight leading-tight">
            Designed for actual learning,<br />not just watching.
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            We solved the hardest part of self-learning: staying on track and getting real practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_HELPS.map(({ title,desc,icon: Icon,color,bg }) => (
            <div key={title} className="glass-card p-8 group hover:-translate-y-2 transition-all duration-300 border-white/5 hover:border-white/20">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} className={color} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Exact Features Setup ───────────────────────── */}
      <section id="features" className="py-24 px-6 bg-surface-800/30 border-y border-white/5 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-purple-400 uppercase tracking-[0.2em] mb-4">Platform Capabilities</p>
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
              Everything you need, built-in.
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Our system provides these exact features to ensure you go from beginner to hired seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PLATFORM_FEATURES.map(({ icon: Icon,color,bg,border,title,desc,size }) => (
              <div key={title} className={`glass-card p-8 group flex flex-col h-full hover:border-white/20 transition-all duration-500 overflow-hidden relative ${size}`}>
                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full ${bg} blur-[60px] group-hover:opacity-100 opacity-0 transition-opacity duration-500`} />
                <div className={`w-12 h-12 rounded-xl ${bg} ${color} border ${border} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm relative z-10">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-sky-400 uppercase tracking-[0.2em] mb-4">The Workflow</p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
            Your continuous learning loop
          </h2>
        </div>

        <div className="space-y-12">
          {[
            { num: '01',title: 'Generate Your Roadmap',desc: 'Tell the AI what you want to learn. It creates a personalized week-by-week curriculum instantly.',icon: Route },
            { num: '02',title: 'Study Interactive Lessons',desc: 'Read AI-generated lessons, explore real-world code snippets, and ask the AI mentor clarifying questions.',icon: BookOpen },
            { num: '03',title: 'Practice in the IDE',desc: 'Open the embedded code editor and write real code to solidify concepts without switching tabs.',icon: Terminal },
            { num: '04',title: 'Pass Quizzes & Challenges',desc: 'Prove your knowledge. Score 60%+ on the AI quiz to auto-complete the topic, and tackle the daily challenge.',icon: TargetArrowIcon },
          ].map((step,index) => (
            <div key={step.num} className="flex flex-col md:flex-row items-center gap-8 glass-card p-8 group hover:border-brand-500/30 transition-all duration-300">
              <div className="text-[80px] font-black text-white/5 group-hover:text-white/10 transition-colors leading-none shrink-0">
                {step.num}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
                <step.icon size={32} className="text-brand-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-lg">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ───────────────────────── */}
      {/* <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Success Stories</p>
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-white mb-6 tracking-tight">
            Real learners. Real outcomes.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(({ name, role, avatar, text, highlight }) => (
            <div key={name} className="glass-card p-8 flex flex-col h-full hover:-translate-y-2 transition-all duration-300 border-white/5 hover:border-brand-500/30">
              <div className="flex gap-1 mb-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-8 flex-1 text-base italic">"{text}"</p>

              <div className="p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl mb-6">
                <p className="text-sm font-semibold text-brand-300 flex items-center gap-2">
                  <span className="text-lg">🏆</span> {highlight}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-white text-base">{name}</p>
                  <p className="text-sm text-zinc-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── CTA ────────────────────────────────── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center glass-card p-12 md:p-24 relative overflow-hidden group border-brand-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-purple-600/15 to-sky-600/10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="w-20 h-20 rounded-3xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-10 relative z-10 animate-float shadow-[0_0_40px_rgba(124,58,237,0.4)]">
            <img src={SkillForge_Logo_BG} className='h-[36px]' alt="SkillForge_Logo" srcset="" />
            {/* <Zap size={36} className="text-brand-400 fill-brand-400/20" /> */}
          </div>

          <h2 className="text-[clamp(36px,6vw,56px)] font-extrabold text-white mb-6 tracking-tight relative z-10 drop-shadow-md leading-tight">
            Stop tutorial hell.<br />Start building real skills.
          </h2>
          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Join thousands of learners building their custom AI roadmaps today. Completely free. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/register" className="btn-primary text-lg px-12 py-5 shadow-[0_0_30px_rgba(124,58,237,0.5)] group">
              Create Free Account <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comprehensive Footer ─────────────────────────────── */}
      <footer className="border-t border-white/5 bg-surface-950/80 backdrop-blur-xl relative z-10 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                {/* <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Zap size={20} className="text-white fill-white/20" strokeWidth={2.5} />
                </div> */}
                <img src={SkillForge_Logo_BG} className='h-9' alt="SkillForge_Logo" srcset="" />
                <span className="font-bold text-xl text-white tracking-tight">SkillForge</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                The ultimate AI-powered personalized skill development and learning management platform. Go from zero to hired in one workspace.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-brand-500 hover:text-white transition-all"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-brand-500 hover:text-white transition-all"><Github size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-brand-500 hover:text-white transition-all"><Linkedin size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">How it Works</a></li>
                <li><a href="#how-it-helps" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Why SkillForge?</a></li>
                {/* <li><a href="#reviews" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Success Stories</a></li> */}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link to="/login" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Sign in</Link></li>
                <li><Link to="/register" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Create Account</Link></li>
                {/* <li><a href="#" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-zinc-400 hover:text-brand-400 transition-colors">API Documentation</a></li> */}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Stay Updated</h4>
              <p className="text-sm text-zinc-400 mb-4">Subscribe to our newsletter for the latest features and learning tips.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="input py-2 text-sm" />
                <button className="btn-primary py-2 px-4 text-sm">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} SkillForge. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}