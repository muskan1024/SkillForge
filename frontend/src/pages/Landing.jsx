import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Zap,
  Map,
  Brain,
  Award,
  Code2,
  MessageSquare,
  Target,
  Star,
  ArrowRight,
  Flame,
  BookOpen,
} from "lucide-react";

const STATS = [
  { value: "10+", label: "Skills to Learn", icon: Brain },
  { value: "AI", label: "Powered Roadmaps", icon: Zap },
  { value: "∞", label: "Learning Paths", icon: Map },
  { value: "24/7", label: "AI Assistant", icon: MessageSquare },
];

const FEATURES = [
  {
    icon: Zap,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    title: "AI-Generated Roadmaps",
    desc: "Tell us your skill, level and timeline. Our AI creates a detailed week-by-week plan with curated free resources in seconds.",
  },
  {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Quiz-Based Progress Tracking",
    desc: "No manual checkboxes. Complete an AI-generated quiz after each topic. Pass 60%+ and the topic auto-completes.",
  },
  {
    icon: MessageSquare,
    color: "text-green-400",
    bg: "bg-green-500/10",
    title: "AI Learning Assistant",
    desc: 'Ask anything — from "explain recursion" to "review my code". Remembers your roadmap context for personalized answers.',
  },
  {
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    title: "Badges & Achievements",
    desc: "Earn badges as you progress — Pathfinder, Topic Master, Week Warrior. Gamified learning keeps you motivated.",
  },
  {
    icon: Target,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    title: "Daily Challenges",
    desc: "A fresh coding challenge every day tailored to your current roadmap topic. Stay sharp and build consistency.",
  },
  {
    icon: Code2,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    title: "Embedded Practice IDE",
    desc: "Write and run Python, JavaScript, Java, C++ and more — directly inside SkillForge. No external redirects.",
  },
  {
    icon: BookOpen,
    color: "text-red-400",
    bg: "bg-red-500/10",
    title: "AI Study Notes",
    desc: "One click generates comprehensive notes — key concepts, code examples, common mistakes and a cheat sheet.",
  },
  {
    icon: Map,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    title: "Visual Roadmap",
    desc: 'See your entire learning journey as a beautiful graphical roadmap with week-by-week progression and a "You are here" marker.',
  },
];

const SKILLS = [
  "Python",
  "JavaScript",
  "React",
  "Machine Learning",
  "DevOps",
  "Data Science",
  "Java",
  "Cloud Computing",
  "SQL",
  "TypeScript",
  "DSA",
  "Web Dev",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us what you want to learn",
    desc: "Select your skills, current level, learning goal and timeline through a guided 5-step form.",
  },
  {
    step: "02",
    title: "AI builds your personalized path",
    desc: "Our AI generates a structured roadmap with topics, subtopics and curated free resources organised by week.",
  },
  {
    step: "03",
    title: "Learn, quiz, and progress",
    desc: "Study each topic, take an AI quiz to verify understanding, earn XP and badges as you advance.",
  },
  {
    step: "04",
    title: "Get job-ready",
    desc: "Use Interview Prep mode, code review and daily challenges to sharpen your skills and land your dream role.",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    role: "CS Student → SDE Intern",
    avatar: "AM",
    text: "SkillForge built me a Python + DSA roadmap in seconds. The quiz-based completion made me actually learn, not just click checkboxes. Cracked my first internship!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "BCA Graduate",
    avatar: "PS",
    text: "The AI assistant explained React concepts better than any YouTube video. Having it tied to my roadmap context was a game changer.",
    rating: 5,
  },
  {
    name: "Rohan Verma",
    role: "Working Professional",
    avatar: "RV",
    text: "Switched from manual notes to SkillForge's AI study notes. Saved hours of prep time. The daily challenges keep me consistent.",
    rating: 5,
  },
];

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="fixed top-0 left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/30 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none -z-10" />

      {/* ── Fixed Navbar ────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-surface-900/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Zap size={20} className="text-white fill-white/20" strokeWidth={2} />
            </div>
            <span className="font-bold text-xl text-zinc-100 tracking-tight">SkillForge</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">Features</a>
            <a href="#how" className="text-zinc-400 hover:text-zinc-100 transition-colors">How it works</a>
            <a href="#skills" className="text-zinc-400 hover:text-zinc-100 transition-colors">Skills</a>
          </nav>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-zinc-400 hover:text-zinc-100 font-medium text-sm transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-xs font-medium text-brand-300 mb-8 backdrop-blur-md animate-fade-in">
            <Zap size={14} className="text-brand-400" /> AI-Powered · Quiz-Verified · Free to use
          </div>

          <h1 className="text-[clamp(40px,7vw,72px)] font-bold leading-[1.1] mb-6 tracking-tight animate-slide-up">
            <span className="text-zinc-200">Your personalized</span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-purple-300 bg-clip-text text-transparent">
              learning roadmap
            </span>
            <br />
            <span className="text-zinc-500">starts here</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            SkillForge uses AI to generate a structured, week-by-week learning
            path for any tech skill. Verify your learning with quizzes, get AI
            mentorship, and track real progress.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Build my roadmap <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass-card p-6 text-center group hover:-translate-y-2 transition-transform duration-300">
                <Icon size={24} className="text-brand-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-zinc-100 mb-1">{value}</div>
                <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills strip ───────────────────────── */}
      <section id="skills" className="py-12 border-y border-white/5 bg-surface-900/50 backdrop-blur-sm relative z-10">
        <p className="text-center text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8">
          Skills you can learn
        </p>
        <div className="flex flex-wrap gap-3 justify-center max-w-5xl mx-auto px-6">
          {SKILLS.map((s) => (
            <span key={s} className="px-5 py-2.5 glass-card !rounded-full text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:border-brand-500/50 transition-colors cursor-default">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────── */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
            Everything you need to learn effectively
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Not just a roadmap generator — a complete AI learning companion that
            adapts to you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="glass-card p-8 group">
              <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5`}>
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-zinc-100 mb-3">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────── */}
      <section id="how" className="py-32 px-6 border-y border-white/5 bg-surface-800/20 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
              How SkillForge works
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              From zero to job-ready in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative group">
                <div className="text-6xl font-black text-brand-500/10 mb-6 group-hover:text-brand-500/20 transition-colors">{step}</div>
                <h3 className="text-xl font-bold text-zinc-100 mb-4">{title}</h3>
                <p className="text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────── */}
      <section className="py-32 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight">
            Loved by learners
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Real stories from students who transformed their careers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map(({ name, role, avatar, text, rating }) => (
            <div key={name} className="glass-card p-8 flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-zinc-300 leading-relaxed mb-8 flex-1 italic">"{text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 font-bold text-sm">
                  {avatar}
                </div>
                <div>
                  <p className="font-bold text-zinc-100">{name}</p>
                  <p className="text-xs text-zinc-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────── */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 pointer-events-none" />
          <Flame size={48} className="text-brand-400 mx-auto mb-6 animate-pulse-soft" />
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold text-zinc-100 mb-6 tracking-tight relative z-10">
            Start learning smarter today
          </h2>
          <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto relative z-10">
            Join thousands of students using AI to build real skills, pass
            quizzes, and get job-ready — completely free.
          </p>
          <Link to="/register" className="btn-primary text-lg px-10 py-5 mx-auto w-fit relative z-10">
            Create free account <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6 bg-surface-900/50 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap size={14} className="text-white fill-white/20" strokeWidth={2} />
            </div>
            <span className="font-bold text-zinc-100">SkillForge</span>
          </div>
          <p className="text-sm text-zinc-500">
            AI-Driven Personalized Learning Path Generator · MCA Major Project
          </p>
        </div>
      </footer>
    </div>
  );
}
