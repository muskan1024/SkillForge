import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import {
  Flame,
  Map,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Loader2,
  Star,
  Brain,
  Target,
  Award,
  BookOpen,
  Code2,
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 sm:p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
      >
        <Icon size={20} />
      </div>
      <p className="text-xl sm:text-2xl font-semibold text-ink-primary">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-ink-tertiary mt-0.5">{label}</p>
    </div>
  );
}

function StreakCalendar({ dates }) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });
  return (
    <div className="flex gap-1 flex-wrap">
      {days.map((day) => (
        <div
          key={day}
          title={day}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md transition-colors ${dates.includes(day) ? "bg-brand-500" : "bg-surface-3"}`}
        />
      ))}
    </div>
  );
}

function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoad] = useState(true);
  const [showHints, setHints] = useState(false);

  useEffect(() => {
    api
      .get("/features/daily-challenge")
      .then((r) => {
        setChallenge(r.data);
        setLoad(false);
      })
      .catch(() => setLoad(false));
  }, []);

  const DIFF_COLORS = {
    Easy: "bg-green-50 text-green-700 border-green-200",
    Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Hard: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="card p-5 sm:p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-orange-500" />
        <h2 className="font-semibold text-ink-primary">Daily Challenge</h2>
        <span className="text-xs text-ink-ghost ml-auto">Resets daily</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="text-brand-400 animate-spin" />
        </div>
      ) : !challenge ? (
        <p className="text-sm text-ink-tertiary">
          No challenge available. Generate a roadmap first!
        </p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`badge border ${DIFF_COLORS[challenge.difficulty] || "bg-surface-2 text-ink-tertiary border-surface-3"}`}
            >
              {challenge.difficulty}
            </span>
            <span className="badge bg-surface-2 text-ink-tertiary border border-surface-3">
              {challenge.category}
            </span>
          </div>

          <h3 className="font-semibold text-ink-primary">{challenge.title}</h3>
          <p className="text-sm text-ink-tertiary leading-relaxed">
            {challenge.description}
          </p>

          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-brand-700 mb-1">
              📝 Your Task
            </p>
            <p className="text-sm text-brand-800 leading-relaxed">
              {challenge.task}
            </p>
          </div>

          {challenge.example_input && (
            <div className="bg-[#1e1e2e] rounded-xl p-3 font-mono text-xs">
              <p className="text-gray-400 mb-1">
                Input:{" "}
                <span className="text-green-400">
                  {challenge.example_input}
                </span>
              </p>
              <p className="text-gray-400">
                Output:{" "}
                <span className="text-green-400">
                  {challenge.example_output}
                </span>
              </p>
            </div>
          )}

          {challenge.learning_objective && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-purple-700 mb-1">
                🎯 Learning Objective
              </p>
              <p className="text-xs text-purple-600">
                {challenge.learning_objective}
              </p>
            </div>
          )}

          {challenge.hints?.length > 0 && (
            <div>
              <button
                onClick={() => setHints(!showHints)}
                className="text-xs text-brand-600 hover:underline flex items-center gap-1"
              >
                💡 {showHints ? "Hide" : "Show"} hints ({challenge.hints.length}
                )
              </button>
              {showHints && (
                <ul className="mt-2 space-y-1 bg-surface-1 rounded-xl p-3">
                  {challenge.hints.map((h, i) => (
                    <li
                      key={i}
                      className="text-xs text-ink-tertiary flex items-start gap-1.5"
                    >
                      <span className="text-brand-400 shrink-0">•</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {challenge.roadmap_title && (
            <p className="text-[11px] text-ink-ghost border-t border-surface-3 pt-2 mt-2">
              Based on: {challenge.roadmap_title}
            </p>
          )}

          <Link
            to="/practice"
            className="inline-flex items-center gap-2 text-xs text-brand-600 font-medium hover:underline"
          >
            <Code2 size={13} /> Open Practice IDE to solve this →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/")
      .then((r) => {
        setData(r.data);
        setL(false);
      })
      .catch(() => setL(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-brand-500 animate-spin" />
      </div>
    );

  const stats = data?.stats || {};
  const dashUser = data?.user || user;
  const activeRoadmap = data?.active_roadmap;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink-primary">
            {new Date().getHours() < 12
              ? "Good morning"
              : new Date().getHours() < 17
                ? "Good afternoon"
                : "Good evening"}
            , {dashUser?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-ink-tertiary mt-1 text-sm">
            Here's your learning summary
          </p>
        </div>
        <Link
          to="/onboarding"
          className="btn-primary flex items-center gap-2 text-sm shrink-0"
        >
          <PlusCircle size={16} /> New roadmap
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={Flame}
          label="Day streak"
          value={dashUser?.streak_days || 0}
          color="bg-orange-50 text-orange-500"
        />
        <StatCard
          icon={Star}
          label="XP points"
          value={dashUser?.xp_points || 0}
          color="bg-yellow-50 text-yellow-500"
        />
        <StatCard
          icon={Map}
          label="Roadmaps"
          value={stats.total_roadmaps || 0}
          color="bg-brand-50 text-brand-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Topics done"
          value={stats.total_topics_completed || 0}
          color="bg-green-50 text-green-600"
        />
      </div>

      {/* Active Roadmap */}
      {activeRoadmap ? (
        <div className="card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <span className="badge bg-brand-50 text-brand-700 mb-2">
                Currently learning
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
                {activeRoadmap.title}
              </h2>
              <p className="text-sm text-ink-tertiary mt-0.5">
                {activeRoadmap.completed_topics} of {activeRoadmap.total_topics}{" "}
                topics completed
              </p>
            </div>
            <Link
              to={`/roadmaps/${activeRoadmap.id}`}
              className="btn-primary flex items-center gap-2 text-sm shrink-0"
            >
              Continue <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-ink-ghost">Progress</span>
            <span className="text-xs font-medium text-ink-secondary">
              {activeRoadmap.progress_percent}%
            </span>
          </div>
          <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${activeRoadmap.progress_percent}%` }}
            />
          </div>
          {activeRoadmap.topics?.[activeRoadmap.current_topic_index] && (
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 animate-pulse-soft shrink-0" />
              <div>
                <p className="text-xs text-brand-600 font-medium mb-0.5">
                  You are here
                </p>
                <p className="text-sm font-medium text-ink-primary">
                  {activeRoadmap.topics[activeRoadmap.current_topic_index].name}
                </p>
                <p className="text-xs text-ink-tertiary mt-0.5">
                  {
                    activeRoadmap.topics[activeRoadmap.current_topic_index]
                      .day_range
                  }{" "}
                  ·{" "}
                  {
                    activeRoadmap.topics[activeRoadmap.current_topic_index]
                      .estimated_hours
                  }
                  h
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card p-8 sm:p-10 text-center">
          <BookOpen size={36} className="text-ink-ghost mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-ink-primary mb-2">
            No active roadmap
          </h2>
          <p className="text-sm text-ink-tertiary mb-6">
            Create your first AI-powered learning path to get started
          </p>
          <Link
            to="/onboarding"
            className="btn-primary inline-flex items-center gap-2"
          >
            <PlusCircle size={16} /> Create roadmap
          </Link>
        </div>
      )}

      {/* Daily Challenge + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DailyChallenge />

        <div className="space-y-4">
          {/* Quick access tools */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink-primary mb-3">
              Quick Access
            </h2>
            <div className="space-y-2">
              {[
                {
                  to: "/interview",
                  icon: Brain,
                  label: "Interview Prep",
                  color: "text-purple-600 bg-purple-50",
                  desc: "Practice mock interviews",
                },
                {
                  to: "/badges",
                  icon: Award,
                  label: "Badges & Achievements",
                  color: "text-yellow-600 bg-yellow-50",
                  desc: "View your earned badges",
                },
                {
                  to: "/practice",
                  icon: Code2,
                  label: "Practice IDE",
                  color: "text-green-600 bg-green-50",
                  desc: "Write and run code",
                },
                {
                  to: "/chat",
                  icon: Brain,
                  label: "AI Assistant",
                  color: "text-brand-600 bg-brand-50",
                  desc: "Ask learning questions",
                },
              ].map(({ to, icon: Icon, label, color, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-1 border border-transparent hover:border-surface-3 transition-all group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                  >
                    <Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-primary group-hover:text-brand-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-ink-ghost">{desc}</p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-ink-ghost group-hover:text-brand-500 transition-colors shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-orange-500" />
          <h2 className="font-semibold text-ink-primary">
            Activity — last 30 days
          </h2>
        </div>
        <StreakCalendar dates={data?.streak_dates || []} />
        <p className="text-xs text-ink-ghost mt-3">
          Each square = a day you logged in and practiced
        </p>
      </div>

      {/* Roadmaps list */}
      {data?.all_roadmaps?.length > 0 && (
        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink-primary">All roadmaps</h2>
            <Link
              to="/roadmaps"
              className="text-sm text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data.all_roadmaps.slice(0, 4).map((r) => (
              <Link
                key={r.id}
                to={`/roadmaps/${r.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-1 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-primary truncate">
                    {r.title}
                  </p>
                  <p className="text-xs text-ink-ghost">
                    {r.skill_level} · {r.timeline}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 ml-4 shrink-0">
                  <div className="hidden sm:block w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${r.progress_percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-ink-ghost">
                    {r.progress_percent}%
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-ink-ghost group-hover:text-brand-500 transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
