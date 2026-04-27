// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import api from '../utils/api'
// import toast from 'react-hot-toast'
// import {
//   CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
//   ExternalLink, Youtube, BookOpen, Code2, PlayCircle,
//   Loader2, Trash2, ArrowLeft, MapPin, RefreshCw, Star
// } from 'lucide-react'

// const RESOURCE_ICONS = {
//   youtube: { icon: Youtube, color: 'text-red-500 bg-red-50' },
//   docs: { icon: BookOpen, color: 'text-blue-500 bg-blue-50' },
//   course: { icon: PlayCircle, color: 'text-purple-500 bg-purple-50' },
//   practice: { icon: Code2, color: 'text-green-500 bg-green-50' },
// }

// const DIFFICULTY_COLORS = {
//   Beginner: 'bg-green-50 text-green-700',
//   Intermediate: 'bg-yellow-50 text-yellow-700',
//   Advanced: 'bg-red-50 text-red-700',
// }

// function ResourceChip({ resource }) {
//   const meta = RESOURCE_ICONS[resource.type] || RESOURCE_ICONS.docs
//   const Icon = meta.icon
//   return (
//     <a href={resource.url} target="_blank" rel="noopener noreferrer"
//       className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${meta.color} hover:opacity-80 transition-opacity`}>
//       <Icon size={12} />
//       {resource.title}
//       <ExternalLink size={10} />
//     </a>
//   )
// }

// function TopicCard({ topic, index, isCurrent, onToggle, updating }) {
//   const [open, setOpen] = useState(isCurrent)

//   useEffect(() => { if (isCurrent) setOpen(true) }, [isCurrent])

//   return (
//     <div className={`rounded-2xl border transition-all duration-200 ${
//       isCurrent
//         ? 'border-brand-400 shadow-md shadow-brand-100 bg-white'
//         : topic.completed
//         ? 'border-surface-3 bg-surface-1'
//         : 'border-surface-3 bg-white hover:border-surface-4'
//     }`}>
//       {/* You are here banner */}
//       {isCurrent && (
//         <div className="bg-brand-600 text-white px-4 py-2 rounded-t-2xl flex items-center gap-2 text-xs font-medium">
//           <MapPin size={13} />
//           You are here
//           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft ml-1" />
//         </div>
//       )}

//       <div className="p-5">
//         <div className="flex items-start gap-4">
//           {/* Checkbox */}
//           <button onClick={() => onToggle(topic.id, !topic.completed)} disabled={updating}
//             className="shrink-0 mt-0.5 transition-transform hover:scale-110">
//             {updating ? (
//               <Loader2 size={22} className="text-brand-400 animate-spin" />
//             ) : topic.completed ? (
//               <CheckCircle2 size={22} className="text-green-500" />
//             ) : (
//               <Circle size={22} className="text-ink-ghost" />
//             )}
//           </button>

//           {/* Content */}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <div className="flex items-center gap-2 flex-wrap mb-1">
//                   <span className="text-xs font-mono text-ink-ghost">Week {topic.week} · {topic.day_range}</span>
//                   <span className={`badge text-[10px] ${DIFFICULTY_COLORS[topic.difficulty] || 'bg-surface-2 text-ink-tertiary'}`}>
//                     {topic.difficulty}
//                   </span>
//                 </div>
//                 <h3 className={`font-semibold text-base transition-colors ${
//                   topic.completed ? 'text-ink-ghost line-through' : isCurrent ? 'text-brand-700' : 'text-ink-primary'
//                 }`}>{topic.name}</h3>
//               </div>
//               <div className="flex items-center gap-2 shrink-0">
//                 <span className="flex items-center gap-1 text-xs text-ink-ghost">
//                   <Clock size={12} /> {topic.estimated_hours}h
//                 </span>
//                 <button onClick={() => setOpen(!open)} className="text-ink-ghost hover:text-ink-secondary p-1">
//                   {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                 </button>
//               </div>
//             </div>

//             {/* Expanded */}
//             {open && (
//               <div className="mt-4 animate-slide-up space-y-4">
//                 <p className="text-sm text-ink-tertiary leading-relaxed">{topic.description}</p>

//                 {/* Subtopics */}
//                 {topic.subtopics?.length > 0 && (
//                   <div>
//                     <p className="text-xs font-semibold text-ink-ghost uppercase tracking-wide mb-2">Subtopics</p>
//                     <ul className="space-y-1">
//                       {topic.subtopics.map((s, i) => (
//                         <li key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
//                           <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
//                           {s}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Resources */}
//                 {topic.resources?.length > 0 && (
//                   <div>
//                     <p className="text-xs font-semibold text-ink-ghost uppercase tracking-wide mb-2">Resources</p>
//                     <div className="flex flex-wrap gap-2">
//                       {topic.resources.map((r, i) => <ResourceChip key={i} resource={r} />)}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function RoadmapView() {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [roadmap, setRoadmap] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [updatingTopic, setUpdatingTopic] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   useEffect(() => {
//     api.get(`/roadmaps/${id}`).then(r => { setRoadmap(r.data); setLoading(false) }).catch(() => {
//       toast.error('Roadmap not found')
//       navigate('/roadmaps')
//     })
//   }, [id])

//   const handleToggle = async (topicId, completed) => {
//     setUpdatingTopic(topicId)
//     try {
//       const { data } = await api.post('/progress/topic', { roadmap_id: id, topic_id: topicId, completed })
//       setRoadmap(prev => ({
//         ...prev,
//         topics: prev.topics.map(t => t.id === topicId ? { ...t, completed } : t),
//         completed_topics: data.completed_topics,
//         progress_percent: data.progress_percent,
//         current_topic_index: data.current_topic_index,
//       }))
//       if (completed) toast.success('+10 XP earned! 🎉', { icon: '⭐' })
//     } catch {
//       toast.error('Failed to update progress')
//     } finally {
//       setUpdatingTopic(null)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirm('Delete this roadmap? This cannot be undone.')) return
//     setDeleting(true)
//     try {
//       await api.delete(`/roadmaps/${id}`)
//       toast.success('Roadmap deleted')
//       navigate('/roadmaps')
//     } catch {
//       toast.error('Delete failed')
//       setDeleting(false)
//     }
//   }

//   if (loading) return (
//     <div className="flex items-center justify-center h-64">
//       <Loader2 size={28} className="text-brand-500 animate-spin" />
//     </div>
//   )

//   if (!roadmap) return null

//   const weeks = [...new Set(roadmap.topics.map(t => t.week))].sort((a, b) => a - b)

//   return (
//     <div className="max-w-3xl mx-auto animate-fade-in">
//       {/* Back */}
//       <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 text-sm mb-6 -ml-2">
//         <ArrowLeft size={16} /> Back
//       </button>

//       {/* Header */}
//       <div className="card p-6 mb-6">
//         <div className="flex items-start justify-between gap-4 mb-4">
//           <div>
//             <div className="flex items-center gap-2 flex-wrap mb-2">
//               <span className="badge bg-brand-50 text-brand-700">{roadmap.skill_level}</span>
//               <span className="badge bg-surface-2 text-ink-tertiary">{roadmap.timeline}</span>
//               {roadmap.progress_percent >= 100 && (
//                 <span className="badge bg-green-50 text-green-700">✓ Completed</span>
//               )}
//             </div>
//             <h1 className="text-xl font-semibold text-ink-primary">{roadmap.title}</h1>
//             <p className="text-sm text-ink-tertiary mt-1">Goal: {roadmap.learning_goal}</p>
//           </div>
//           <button onClick={handleDelete} disabled={deleting} className="text-ink-ghost hover:text-red-500 p-2 transition-colors">
//             {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
//           </button>
//         </div>

//         {/* Progress */}
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-ink-secondary font-medium">
//               {roadmap.completed_topics} / {roadmap.total_topics} topics completed
//             </span>
//             <span className="text-sm font-semibold text-brand-600">{roadmap.progress_percent}%</span>
//           </div>
//           <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
//             <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700"
//               style={{ width: `${roadmap.progress_percent}%` }} />
//           </div>
//         </div>
//       </div>

//       {/* Topics by week */}
//       {weeks.map(week => (
//         <div key={week} className="mb-8">
//           <div className="flex items-center gap-3 mb-4">
//             <span className="text-xs font-semibold text-ink-ghost uppercase tracking-wider">Week {week}</span>
//             <div className="flex-1 h-px bg-surface-3" />
//           </div>
//           <div className="space-y-3">
//             {roadmap.topics
//               .filter(t => t.week === week)
//               .map((topic, i) => {
//                 const globalIndex = roadmap.topics.findIndex(t => t.id === topic.id)
//                 const isCurrent = globalIndex === roadmap.current_topic_index && roadmap.progress_percent < 100
//                 return (
//                   <TopicCard key={topic.id} topic={topic} index={globalIndex}
//                     isCurrent={isCurrent}
//                     onToggle={handleToggle}
//                     updating={updatingTopic === topic.id} />
//                 )
//               })}
//           </div>
//         </div>
//       ))}

//       {roadmap.progress_percent >= 100 && (
//         <div className="card p-8 text-center mt-4">
//           <div className="text-4xl mb-3">🎉</div>
//           <h2 className="text-lg font-semibold text-ink-primary mb-1">Roadmap complete!</h2>
//           <p className="text-sm text-ink-tertiary mb-4">You've finished all topics. Ready for the next challenge?</p>
//           <button onClick={() => navigate('/onboarding')} className="btn-primary inline-flex items-center gap-2">
//             <Star size={16} /> Create a new roadmap
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Youtube,
  BookOpen,
  Code2,
  PlayCircle,
  Loader2,
  Trash2,
  ArrowLeft,
  MapPin,
  Star,
  Bot,
} from "lucide-react";

const RESOURCE_ICONS = {
  youtube: { icon: Youtube, color: "text-red-500 bg-red-50" },
  docs: { icon: BookOpen, color: "text-blue-500 bg-blue-50" },
  course: { icon: PlayCircle, color: "text-purple-500 bg-purple-50" },
  practice: { icon: Code2, color: "text-green-500 bg-green-50" },
};

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-50 text-green-700",
  Intermediate: "bg-yellow-50 text-yellow-700",
  Advanced: "bg-red-50 text-red-700",
};

function ResourceChip({ resource }) {
  const meta = RESOURCE_ICONS[resource.type] || RESOURCE_ICONS.docs;
  const Icon = meta.icon;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${meta.color} hover:opacity-80 transition-opacity`}
    >
      <Icon size={12} />
      {resource.title}
      <ExternalLink size={10} />
    </a>
  );
}

function TopicCard({
  topic,
  index,
  isCurrent,
  onToggle,
  updating,
  roadmapId,
  onAskAI,
}) {
  const [open, setOpen] = useState(isCurrent);

  useEffect(() => {
    if (isCurrent) setOpen(true);
  }, [isCurrent]);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isCurrent
          ? "border-brand-400 shadow-md shadow-brand-100 bg-white"
          : topic.completed
            ? "border-surface-3 bg-surface-1"
            : "border-surface-3 bg-white hover:border-surface-4"
      }`}
    >
      {/* You are here banner */}
      {isCurrent && (
        <div className="bg-brand-600 text-white px-4 py-2 rounded-t-2xl flex items-center gap-2 text-xs font-medium">
          <MapPin size={13} />
          You are here
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-soft ml-1" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(topic.id, !topic.completed)}
            disabled={updating}
            className="shrink-0 mt-0.5 transition-transform hover:scale-110"
          >
            {updating ? (
              <Loader2 size={22} className="text-brand-400 animate-spin" />
            ) : topic.completed ? (
              <CheckCircle2 size={22} className="text-green-500" />
            ) : (
              <Circle size={22} className="text-ink-ghost" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono text-ink-ghost">
                    Week {topic.week} · {topic.day_range}
                  </span>
                  <span
                    className={`badge text-[10px] ${DIFFICULTY_COLORS[topic.difficulty] || "bg-surface-2 text-ink-tertiary"}`}
                  >
                    {topic.difficulty}
                  </span>
                </div>
                <h3
                  className={`font-semibold text-base transition-colors ${
                    topic.completed
                      ? "text-ink-ghost line-through"
                      : isCurrent
                        ? "text-brand-700"
                        : "text-ink-primary"
                  }`}
                >
                  {topic.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-xs text-ink-ghost">
                  <Clock size={12} /> {topic.estimated_hours}h
                </span>
                <button
                  onClick={() => setOpen(!open)}
                  className="text-ink-ghost hover:text-ink-secondary p-1"
                >
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Expanded */}
            {open && (
              <div className="mt-4 animate-slide-up space-y-4">
                <p className="text-sm text-ink-tertiary leading-relaxed">
                  {topic.description}
                </p>

                {/* Subtopics */}
                {topic.subtopics?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-ghost uppercase tracking-wide mb-2">
                      Subtopics
                    </p>
                    <ul className="space-y-1">
                      {topic.subtopics.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-ink-secondary"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {topic.resources?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-ghost uppercase tracking-wide mb-2">
                      Resources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topic.resources.map((r, i) => (
                        <ResourceChip key={i} resource={r} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ask AI button */}
                <div className="pt-1 border-t border-surface-3">
                  <button
                    onClick={() => onAskAI(topic, roadmapId)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 rounded-xl text-sm font-medium transition-all group"
                  >
                    <Bot size={15} className="group-hover:animate-pulse" />
                    Ask AI about "{topic.name}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTopic, setUpdatingTopic] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .get(`/roadmaps/${id}`)
      .then((r) => {
        setRoadmap(r.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Roadmap not found");
        navigate("/roadmaps");
      });
  }, [id]);

  const handleToggle = async (topicId, completed) => {
    setUpdatingTopic(topicId);
    try {
      const { data } = await api.post("/progress/topic", {
        roadmap_id: id,
        topic_id: topicId,
        completed,
      });
      setRoadmap((prev) => ({
        ...prev,
        topics: prev.topics.map((t) =>
          t.id === topicId ? { ...t, completed } : t,
        ),
        completed_topics: data.completed_topics,
        progress_percent: data.progress_percent,
        current_topic_index: data.current_topic_index,
      }));
      if (completed) toast.success("+10 XP earned! 🎉", { icon: "⭐" });
    } catch {
      toast.error("Failed to update progress");
    } finally {
      setUpdatingTopic(null);
    }
  };

  // Navigate to AI chat with pre-filled prompt about this topic
  const handleAskAI = (topic, roadmapId) => {
    const prompt = `Explain the topic "${topic.name}" to me in detail. Cover the following subtopics: ${topic.subtopics?.join(", ") || "the key concepts"}. I'm currently learning this as part of my roadmap and I'm at ${topic.difficulty} level. Please give examples and practical tips.`;
    const encodedPrompt = encodeURIComponent(prompt);
    navigate(`/chat?prompt=${encodedPrompt}&roadmap=${roadmapId}`);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this roadmap? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/roadmaps/${id}`);
      toast.success("Roadmap deleted");
      navigate("/roadmaps");
    } catch {
      toast.error("Delete failed");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  if (!roadmap) return null;

  const weeks = [...new Set(roadmap.topics.map((t) => t.week))].sort(
    (a, b) => a - b,
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost flex items-center gap-2 text-sm mb-6 -ml-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="badge bg-brand-50 text-brand-700">
                {roadmap.skill_level}
              </span>
              <span className="badge bg-surface-2 text-ink-tertiary">
                {roadmap.timeline}
              </span>
              {roadmap.progress_percent >= 100 && (
                <span className="badge bg-green-50 text-green-700">
                  ✓ Completed
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-ink-primary">
              {roadmap.title}
            </h1>
            <p className="text-sm text-ink-tertiary mt-1">
              Goal: {roadmap.learning_goal}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-ink-ghost hover:text-red-500 p-2 transition-colors"
          >
            {deleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-secondary font-medium">
              {roadmap.completed_topics} / {roadmap.total_topics} topics
              completed
            </span>
            <span className="text-sm font-semibold text-brand-600">
              {roadmap.progress_percent}%
            </span>
          </div>
          <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-700"
              style={{ width: `${roadmap.progress_percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics by week */}
      {weeks.map((week) => (
        <div key={week} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-ink-ghost uppercase tracking-wider">
              Week {week}
            </span>
            <div className="flex-1 h-px bg-surface-3" />
          </div>
          <div className="space-y-3">
            {roadmap.topics
              .filter((t) => t.week === week)
              .map((topic) => {
                const globalIndex = roadmap.topics.findIndex(
                  (t) => t.id === topic.id,
                );
                const isCurrent =
                  globalIndex === roadmap.current_topic_index &&
                  roadmap.progress_percent < 100;
                return (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={globalIndex}
                    isCurrent={isCurrent}
                    onToggle={handleToggle}
                    updating={updatingTopic === topic.id}
                    roadmapId={id}
                    onAskAI={handleAskAI}
                  />
                );
              })}
          </div>
        </div>
      ))}

      {roadmap.progress_percent >= 100 && (
        <div className="card p-8 text-center mt-4">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-lg font-semibold text-ink-primary mb-1">
            Roadmap complete!
          </h2>
          <p className="text-sm text-ink-tertiary mb-4">
            You've finished all topics. Ready for the next challenge?
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Star size={16} /> Create a new roadmap
          </button>
        </div>
      )}
    </div>
  );
}
