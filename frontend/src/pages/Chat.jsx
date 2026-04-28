import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
  Sparkles,
  ChevronDown,
  Map,
  Plus,
  MessageSquare,
  Folder,
  FolderOpen,
  X,
  ChevronRight,
  PenSquare,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const SUGGESTIONS = [
  "Explain the difference between SQL and NoSQL",
  "How do I start learning React as a beginner?",
  "What is supervised vs unsupervised learning?",
  "How does JWT authentication work?",
  "Best free resources to learn Python?",
  "Explain REST API vs GraphQL",
];

/* ── Message renderer ─────────────────────────────────────── */
function MessageContent({ text }) {
  const renderLine = (line, key) => {
    const segs = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((s, si) => {
      if (s.startsWith("**") && s.endsWith("**"))
        return (
          <strong key={si} className="font-semibold text-ink-primary">
            {s.slice(2, -2)}
          </strong>
        );
      if (s.startsWith("`") && s.endsWith("`"))
        return (
          <code
            key={si}
            className="bg-surface-2 text-brand-700 px-1.5 py-0.5 rounded text-[13px] font-mono"
          >
            {s.slice(1, -1)}
          </code>
        );
      return s;
    });
    if (line.startsWith("- ") || line.startsWith("• "))
      return (
        <div key={key} className="flex gap-2 my-0.5">
          <span className="text-brand-400 shrink-0">•</span>
          <span>{segs.slice(1)}</span>
        </div>
      );
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)[1];
      return (
        <div key={key} className="flex gap-2 my-0.5">
          <span className="text-brand-500 font-medium w-5 shrink-0">
            {num}.
          </span>
          <span>{segs.slice(1)}</span>
        </div>
      );
    }
    if (/^#{1,3}\s/.test(line))
      return (
        <p key={key} className="font-semibold text-ink-primary mt-3 mb-1">
          {line.replace(/^#+\s/, "")}
        </p>
      );
    if (line.trim() === "") return <div key={key} className="h-1.5" />;
    return (
      <p key={key} className="my-0.5 leading-relaxed">
        {segs}
      </p>
    );
  };

  if (!text.includes("```")) {
    return (
      <div className="text-sm text-ink-secondary">
        {text.split("\n").map((l, i) => renderLine(l, i))}
      </div>
    );
  }
  return (
    <div className="text-sm text-ink-secondary">
      {text.split(/(```[\s\S]*?```)/g).map((seg, i) => {
        if (seg.startsWith("```")) {
          return (
            <pre
              key={i}
              className="bg-[#1e1e2e] text-green-400 rounded-xl p-4 my-3 overflow-x-auto text-xs font-mono leading-relaxed"
            >
              <code>{seg.replace(/^```\w*\n?/, "").replace(/```$/, "")}</code>
            </pre>
          );
        }
        return seg.split("\n").map((l, li) => renderLine(l, `${i}-${li}`));
      })}
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${isUser ? "bg-brand-600" : "bg-surface-2 border border-surface-4"}`}
      >
        {isUser ? (
          <User size={15} className="text-white" />
        ) : (
          <Bot size={15} className="text-brand-600" />
        )}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 ${isUser ? "bg-brand-600 text-white rounded-tr-sm" : "bg-white border border-surface-3 shadow-sm rounded-tl-sm"}`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <MessageContent text={msg.content} />
        )}
      </div>
    </div>
  );
}

/* ── History Sidebar ──────────────────────────────────────── */
function HistorySidebar({
  sessions,
  activeId,
  onSelect,
  onDelete,
  onNew,
  roadmaps,
  loading,
  collapsed,
  onToggle,
}) {
  const [expanded, setExpanded] = useState({});
  const toggle = (k) =>
    setExpanded((p) => ({ ...p, [k]: p[k] === false ? true : false }));

  const grouped = {};
  sessions.forEach((s) => {
    const k = s.roadmap_id || "general";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(s);
  });

  const getRmName = (id) => {
    if (!id) return "General";
    const r = roadmaps.find((r) => r.id === id);
    return r
      ? r.title.length > 20
        ? r.title.slice(0, 20) + "…"
        : r.title
      : "Roadmap";
  };

  return (
    <div
      className={`flex flex-col bg-white border-r border-surface-3 transition-all duration-300 ${collapsed ? "w-12" : "w-64"} shrink-0 h-full overflow-hidden`}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-surface-3 px-3 py-3 gap-2 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-ink-primary">
              Chat History
            </p>
            <p className="text-[11px] text-ink-ghost">Your conversations</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-ghost hover:text-ink-primary transition-colors shrink-0"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* New chat */}
          <button
            onClick={onNew}
            className="flex items-center gap-2 mx-3 mt-3 mb-1 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-medium transition-colors border border-brand-200"
          >
            <Plus size={13} /> New chat
          </button>

          {/* Sessions */}
          <div className="flex-1 overflow-y-auto py-2">
            {loading ? (
              <div className="flex justify-center pt-6">
                <Loader2 size={18} className="text-brand-400 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <MessageSquare
                  size={22}
                  className="text-ink-ghost mx-auto mb-2"
                />
                <p className="text-xs text-ink-ghost">No chats yet</p>
              </div>
            ) : (
              Object.entries(grouped).map(([key, gs]) => {
                const isOpen = expanded[key] !== false;
                const isGeneral = key === "general";
                return (
                  <div key={key} className="mb-1">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-1 transition-colors"
                    >
                      <ChevronRight
                        size={12}
                        className={`text-ink-ghost shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                      {isGeneral ? (
                        <MessageSquare
                          size={12}
                          className="text-ink-ghost shrink-0"
                        />
                      ) : isOpen ? (
                        <FolderOpen
                          size={12}
                          className="text-brand-500 shrink-0"
                        />
                      ) : (
                        <Folder size={12} className="text-brand-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-medium text-ink-secondary truncate flex-1 text-left">
                        {getRmName(isGeneral ? null : key)}
                      </span>
                      <span className="text-[10px] text-ink-ghost bg-surface-2 px-1.5 py-0.5 rounded shrink-0">
                        {gs.length}
                      </span>
                    </button>

                    {isOpen &&
                      gs.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => onSelect(s.id)}
                          className={`group flex items-start gap-2 pl-8 pr-3 py-2 cursor-pointer transition-colors ${activeId === s.id ? "bg-brand-50" : "hover:bg-surface-1"}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[11px] font-medium truncate ${activeId === s.id ? "text-brand-700" : "text-ink-secondary"}`}
                            >
                              {s.title}
                            </p>
                            {s.last_message && (
                              <p className="text-[10px] text-ink-ghost truncate mt-0.5">
                                {s.last_message}
                              </p>
                            )}
                            <p className="text-[10px] text-ink-ghost mt-0.5">
                              {s.message_count} msg
                              {s.message_count !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(s.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-ink-ghost hover:text-red-500 transition-all shrink-0 mt-0.5"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Collapsed: show new chat icon only */}
      {collapsed && (
        <div className="flex flex-col items-center gap-2 pt-3">
          <button
            onClick={onNew}
            className="p-2 rounded-xl hover:bg-surface-2 text-ink-ghost hover:text-brand-600 transition-colors"
            title="New chat"
          >
            <Plus size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Chat Page ───────────────────────────────────────── */
export default function Chat() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState("");
  const [activeRoadmapTitle, setActiveRoadmapTitle] = useState("");
  const [showRmPicker, setShowRmPicker] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const autoSent = useRef(false);

  useEffect(() => {
    Promise.all([api.get("/chat/sessions"), api.get("/roadmaps/")])
      .then(([s, r]) => {
        setSessions(s.data);
        setRoadmaps(r.data);
        setLoadingSessions(false);
      })
      .catch(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (loadingSessions) return;
    const promptParam = searchParams.get("prompt");
    const roadmapParam = searchParams.get("roadmap");
    const sessionParam = searchParams.get("session");

    if (sessionParam && !promptParam) {
      setSearchParams({});
      handleSelectSession(sessionParam);
      return;
    }
    if (promptParam && !autoSent.current) {
      autoSent.current = true;
      setSearchParams({});
      createNewSession(roadmapParam || null).then((sess) => {
        if (sess) {
          setInput(decodeURIComponent(promptParam));
          setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          }, 150);
        }
      });
    }
  }, [loadingSessions, searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const createNewSession = async (roadmapId = null) => {
    try {
      const { data } = await api.post("/chat/session/new", {
        roadmap_id: roadmapId || null,
      });
      setSessions((prev) => [data, ...prev]);
      setActiveSessionId(data.id);
      setMessages([]);
      if (roadmapId) {
        setSelectedRoadmap(roadmapId);
        setActiveRoadmapTitle(
          roadmaps.find((r) => r.id === roadmapId)?.title || "",
        );
      } else {
        setSelectedRoadmap("");
        setActiveRoadmapTitle("");
      }
      return data;
    } catch {
      toast.error("Failed to create chat");
      return null;
    }
  };

  const handleNewChat = () => {
    autoSent.current = false;
    setActiveSessionId(null);
    setMessages([]);
    setInput("");
    setSelectedRoadmap("");
    setActiveRoadmapTitle("");
    inputRef.current?.focus();
  };

  const handleSelectSession = async (id) => {
    if (id === activeSessionId) return;
    setLoadingMessages(true);
    setActiveSessionId(id);
    try {
      const { data } = await api.get(`/chat/session/${id}`);
      setMessages(data.messages || []);
      setSelectedRoadmap(data.roadmap_id || "");
      setActiveRoadmapTitle(
        roadmaps.find((r) => r.id === data.roadmap_id)?.title || "",
      );
    } catch {
      toast.error("Failed to load chat");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteSession = async (id) => {
    await api.delete(`/chat/session/${id}`);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setMessages([]);
    }
    toast.success("Chat deleted");
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");

    let sid = activeSessionId;
    if (!sid) {
      const sess = await createNewSession(selectedRoadmap || null);
      if (!sess) return;
      sid = sess.id;
    }

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat/message", {
        message: userMsg,
        history: messages.slice(-12),
        roadmap_id: selectedRoadmap || null,
        session_id: sid,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      api.get("/chat/sessions").then((r) => setSessions(r.data));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to get response.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMsg);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const isEmpty = messages.length === 0;
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex w-full h-full" style={{ height: "calc(100vh)" }}>
      {/* History sidebar — hidden on mobile by default, shown on md+ */}
      <div className="hidden sm:flex h-full">
        <HistorySidebar
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={handleSelectSession}
          onDelete={handleDeleteSession}
          onNew={handleNewChat}
          roadmaps={roadmaps}
          loading={loadingSessions}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* Chat main */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-1 h-full overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-surface-3 px-4 sm:px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Bot size={18} className="text-brand-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-primary truncate">
                {activeRoadmapTitle || "AI Assistant"}
              </p>
              <p className="text-xs text-ink-ghost truncate hidden sm:block">
                {activeSession?.title || "Start a new conversation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-surface-1 hover:bg-surface-2 border border-surface-4 text-ink-secondary rounded-xl text-xs font-medium transition-all"
            >
              <PenSquare size={13} />{" "}
              <span className="hidden sm:inline">New chat</span>
            </button>

            {/* Roadmap picker */}
            <div className="relative">
              <button
                onClick={() => setShowRmPicker(!showRmPicker)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border text-xs font-medium transition-all ${selectedRoadmap ? "bg-brand-50 border-brand-300 text-brand-700" : "bg-white border-surface-4 text-ink-secondary hover:border-brand-200"}`}
              >
                <Map size={13} />
                <span className="hidden sm:inline truncate max-w-[120px]">
                  {selectedRoadmap
                    ? roadmaps
                        .find((r) => r.id === selectedRoadmap)
                        ?.title?.slice(0, 18) + "…"
                    : "Roadmap context"}
                </span>
                <ChevronDown size={12} />
              </button>
              {showRmPicker && (
                <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-surface-3 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedRoadmap("");
                        setActiveRoadmapTitle("");
                        setShowRmPicker(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-ink-tertiary hover:bg-surface-1 rounded-lg"
                    >
                      No context (general chat)
                    </button>
                    {roadmaps.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedRoadmap(r.id);
                          setActiveRoadmapTitle(r.title);
                          setShowRmPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-surface-1 transition-colors ${selectedRoadmap === r.id ? "text-brand-700 bg-brand-50" : "text-ink-secondary"}`}
                      >
                        <p className="font-medium truncate">{r.title}</p>
                        <p className="text-xs text-ink-ghost">
                          {r.progress_percent}% complete
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 space-y-5">
          {loadingMessages ? (
            <div className="flex justify-center pt-16">
              <Loader2 size={24} className="text-brand-400 animate-spin" />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                <Sparkles size={26} className="text-brand-500" />
              </div>
              <h2 className="text-lg font-semibold text-ink-primary mb-1">
                {activeRoadmapTitle
                  ? `Chatting about ${activeRoadmapTitle}`
                  : "SkillForge AI"}
              </h2>
              <p className="text-sm text-ink-tertiary mb-8 max-w-sm">
                {activeRoadmapTitle
                  ? `Ask me anything about your ${activeRoadmapTitle} roadmap.`
                  : "Ask me anything about programming, career, or learning resources."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-3 py-2.5 bg-white hover:bg-brand-50 hover:border-brand-200 border border-surface-3 rounded-xl text-xs text-ink-secondary transition-all shadow-sm leading-relaxed"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ChatBubble
                msg={{
                  role: "assistant",
                  content: `Hi ${user?.name?.split(" ")[0]}! 👋${activeRoadmapTitle ? ` Let's talk about your **${activeRoadmapTitle}** roadmap.` : " I'm SkillForge AI. Ask me anything!"}`,
                }}
              />
              {messages.map((m, i) => (
                <ChatBubble key={i} msg={m} />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-2 border border-surface-4 flex items-center justify-center shrink-0">
                    <Bot size={15} className="text-brand-600" />
                  </div>
                  <div className="bg-white border border-surface-3 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center h-5">
                      {[0, 150, 300].map((d) => (
                        <div
                          key={d}
                          className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="shrink-0 bg-white border-t border-surface-3 px-4 sm:px-6 lg:px-10 py-4">
          {selectedRoadmap && (
            <p className="text-xs text-brand-600 mb-2 flex items-center gap-1">
              <Map size={11} /> Context: {activeRoadmapTitle}
            </p>
          )}
          <div className="flex gap-2 sm:gap-3 bg-surface-1 border border-surface-3 rounded-2xl p-2 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-ink-primary placeholder-ink-ghost px-2 sm:px-3 py-2 focus:outline-none"
              placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary px-3 sm:px-4 py-2.5 rounded-xl flex items-center gap-2 self-end shrink-0 disabled:opacity-40"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
          <p className="text-xs text-ink-ghost text-center mt-2">
            AI can make mistakes — verify important information
          </p>
        </div>
      </div>
    </div>
  );
}
