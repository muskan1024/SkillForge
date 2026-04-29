import { Link } from "react-router-dom";
import {
  Zap,
  Map,
  TrendingUp,
  Brain,
  Award,
  Code2,
  MessageSquare,
  Target,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Users,
  BookOpen,
  Flame,
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
    color: "bg-brand-50 text-brand-600",
    title: "AI-Generated Roadmaps",
    desc: "Tell us your skill, level, and timeline. Our Gemini-powered AI creates a detailed week-by-week learning plan with curated free resources in seconds.",
  },
  {
    icon: Brain,
    color: "bg-purple-50 text-purple-600",
    title: "Quiz-Based Progress",
    desc: "No manual checkboxes. Complete a short AI-generated quiz after each topic. Pass with 60%+ and the topic auto-completes. Real learning verified.",
  },
  {
    icon: MessageSquare,
    color: "bg-green-50 text-green-600",
    title: "AI Learning Assistant",
    desc: 'Ask anything — from "explain recursion" to "review my code". Our AI remembers your roadmap context and gives personalized answers.',
  },
  {
    icon: Award,
    color: "bg-yellow-50 text-yellow-600",
    title: "Badges & Achievements",
    desc: "Earn badges as you progress — Pathfinder, Topic Master, Week Warrior, and more. Gamified learning keeps you motivated every day.",
  },
  {
    icon: Target,
    color: "bg-red-50 text-red-600",
    title: "Daily Challenges",
    desc: "A fresh coding challenge every day tailored to your current roadmap topic. Stay sharp, build consistency, earn bonus XP.",
  },
  {
    icon: Code2,
    color: "bg-teal-50 text-teal-600",
    title: "Code Review & Practice",
    desc: "Paste your code for instant AI review. Get feedback on bugs, best practices, and improvements. Plus 10 embedded online IDEs for hands-on practice.",
  },
  {
    icon: BookOpen,
    color: "bg-orange-50 text-orange-600",
    title: "AI Study Notes",
    desc: "One click generates comprehensive study notes for any topic — key concepts, code examples, common mistakes, and a cheat sheet. Download as PDF.",
  },
  {
    icon: Map,
    color: "bg-cyan-50 text-cyan-600",
    title: "Visual Roadmap",
    desc: "See your entire learning journey as a beautiful visual timeline with week-by-week progression, difficulty indicators, and resource cards.",
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
    desc: "Select your skills, current level, learning goal, and available timeline through a guided 5-step form.",
  },
  {
    step: "02",
    title: "AI builds your personalized path",
    desc: "Our AI generates a structured roadmap with topics, subtopics, and curated free resources — all organized by week.",
  },
  {
    step: "03",
    title: "Learn, quiz, and progress",
    desc: "Study each topic, take an AI quiz to verify understanding, earn XP and badges as you advance.",
  },
  {
    step: "04",
    title: "Get job-ready",
    desc: "Use Interview Prep mode, code review, and daily challenges to sharpen your skills and land your dream role.",
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
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-surface-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
              <Zap size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-ink-primary">SkillForge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-tertiary">
            <a
              href="#features"
              className="hover:text-ink-primary transition-colors"
            >
              Features
            </a>
            <a href="#how" className="hover:text-ink-primary transition-colors">
              How it works
            </a>
            <a
              href="#skills"
              className="hover:text-ink-primary transition-colors"
            >
              Skills
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm hidden sm:block">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-purple-50 pt-16 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-brand-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 border border-brand-200 rounded-full text-sm text-brand-700 font-medium mb-8">
            <Zap size={14} /> AI-Powered · Quiz-Verified · Free to use
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary leading-tight mb-6 tracking-tight">
            Your personalized
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
              learning roadmap
            </span>
            <br />
            starts here
          </h1>
          <p className="text-lg sm:text-xl text-ink-tertiary mb-10 max-w-2xl mx-auto leading-relaxed">
            SkillForge uses AI to generate a structured, week-by-week learning
            path for any tech skill. Verify your learning with quizzes, get AI
            mentorship, and track real progress.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="btn-primary flex items-center gap-2 text-base px-8 py-3.5 w-full sm:w-auto justify-center"
            >
              Build my roadmap <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto justify-center text-center"
            >
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-surface-3 shadow-sm p-4 text-center"
              >
                <Icon size={20} className="text-brand-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-ink-primary">{value}</p>
                <p className="text-xs text-ink-ghost mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills marquee */}
      <section
        id="skills"
        className="py-10 bg-surface-1 overflow-hidden border-y border-surface-3"
      >
        <p className="text-center text-xs font-semibold text-ink-ghost uppercase tracking-widest mb-6">
          Skills you can learn
        </p>
        <div className="flex gap-3 flex-wrap justify-center px-4">
          {SKILLS.map((s) => (
            <span
              key={s}
              className="px-4 py-2 bg-white border border-surface-3 rounded-full text-sm font-medium text-ink-secondary shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-4">
              Everything you need to learn effectively
            </h2>
            <p className="text-lg text-ink-tertiary max-w-2xl mx-auto">
              Not just a roadmap generator — a complete AI learning companion
              that adapts to you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-surface-3 p-6 hover:shadow-md hover:border-brand-200 transition-all group"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-ink-primary mb-2 group-hover:text-brand-700 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-ink-tertiary leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="py-20 px-4 bg-gradient-to-br from-brand-600 to-brand-800"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How SkillForge works
            </h2>
            <p className="text-brand-200 text-lg max-w-xl mx-auto">
              From zero to job-ready in four simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20"
              >
                <div className="text-4xl font-black text-white/20 mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-brand-200 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-surface-1">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-4">
              Loved by learners
            </h2>
            <p className="text-ink-tertiary text-lg">
              Real stories from students who transformed their careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, text, rating }) => (
              <div
                key={name}
                className="bg-white rounded-2xl border border-surface-3 p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed mb-5">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">
                      {name}
                    </p>
                    <p className="text-xs text-ink-ghost">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-brand-50 to-purple-50 border border-brand-200 rounded-3xl p-10 sm:p-14">
            <Flame size={40} className="text-brand-500 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-primary mb-4">
              Start learning smarter today
            </h2>
            <p className="text-ink-tertiary text-lg mb-8 max-w-lg mx-auto">
              Join thousands of students using AI to build real skills, pass
              quizzes, and get job-ready — completely free.
            </p>
            <Link
              to="/register"
              className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4"
            >
              Create free account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-3 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-ink-primary text-sm">
              SkillForge
            </span>
          </div>
          <p className="text-xs text-ink-ghost">
            AI-Driven Personalized Learning Path Generator · MCA Major Project
          </p>
        </div>
      </footer>
    </div>
  );
}
