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

const BG = "#0f1117";
const SIDEBAR = "#12141c";
const CARD = "#16181f";
const BORDER = "rgba(255,255,255,0.06)";
const INPUT_BG = "#1e2130";
const TEXT1 = "#e8eaf0";
const TEXT2 = "#94a3b8";
const TEXT3 = "#475569";
const BRAND = "#6366f1";

/* ── Message renderer ─────────────────────────────────────── */
function MessageContent({ text }) {
  const renderLine = (line, key) => {
    const segs = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((s, si) => {
      if (s.startsWith("**") && s.endsWith("**"))
        return (
          <strong key={si} style={{ fontWeight: 600, color: TEXT1 }}>
            {s.slice(2, -2)}
          </strong>
        );
      if (s.startsWith("`") && s.endsWith("`"))
        return (
          <code
            key={si}
            style={{
              background: "#1e2130",
              color: "#818cf8",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {s.slice(1, -1)}
          </code>
        );
      return s;
    });
    if (line.startsWith("- ") || line.startsWith("• "))
      return (
        <div key={key} style={{ display: "flex", gap: 8, margin: "2px 0" }}>
          <span style={{ color: BRAND, flexShrink: 0 }}>•</span>
          <span>{segs.slice(1)}</span>
        </div>
      );
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)[1];
      return (
        <div key={key} style={{ display: "flex", gap: 8, margin: "2px 0" }}>
          <span style={{ color: BRAND, width: 20, flexShrink: 0 }}>{num}.</span>
          <span>{segs.slice(1)}</span>
        </div>
      );
    }
    if (/^#{1,3}\s/.test(line))
      return (
        <p
          key={key}
          style={{ fontWeight: 600, color: TEXT1, margin: "12px 0 4px" }}
        >
          {line.replace(/^#+\s/, "")}
        </p>
      );
    if (line.trim() === "") return <div key={key} style={{ height: 6 }} />;
    return (
      <p key={key} style={{ margin: "2px 0", lineHeight: 1.65 }}>
        {segs}
      </p>
    );
  };

  if (!text.includes("```")) {
    return (
      <div style={{ fontSize: 14, color: TEXT2 }}>
        {text.split("\n").map((l, i) => renderLine(l, i))}
      </div>
    );
  }
  return (
    <div style={{ fontSize: 14, color: TEXT2 }}>
      {text.split(/(```[\s\S]*?```)/g).map((seg, i) => {
        if (seg.startsWith("```")) {
          return (
            <pre
              key={i}
              style={{
                background: "#0d0f14",
                color: "#4ade80",
                borderRadius: 12,
                padding: 16,
                margin: "12px 0",
                overflowX: "auto",
                fontSize: 12,
                fontFamily: "JetBrains Mono, monospace",
                lineHeight: 1.6,
              }}
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
    <div
      style={{
        display: "flex",
        gap: 12,
        flexDirection: isUser ? "row-reverse" : "row",
        animationName: "slideUp",
        animationDuration: "0.3s",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: isUser ? BRAND : INPUT_BG,
          border: isUser ? "none" : `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {isUser ? (
          <User size={15} color="#fff" />
        ) : (
          <Bot size={15} color={BRAND} />
        )}
      </div>
      <div
        style={{
          maxWidth: "76%",
          borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          padding: "12px 16px",
          background: isUser ? BRAND : CARD,
          border: isUser ? "none" : `1px solid ${BORDER}`,
        }}
      >
        {isUser ? (
          <p
            style={{ fontSize: 14, color: "#fff", lineHeight: 1.6, margin: 0 }}
          >
            {msg.content}
          </p>
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
  const toggle = (k) => setExpanded((p) => ({ ...p, [k]: p[k] === false }));

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
      style={{
        width: collapsed ? 48 : 256,
        flexShrink: 0,
        background: SIDEBAR,
        borderRight: `1px solid ${BORDER}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        transition: "width 0.25s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "14px 0" : "14px 16px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {!collapsed && (
          <div>
            <p
              style={{ fontSize: 13, fontWeight: 600, color: TEXT1, margin: 0 }}
            >
              Chat History
            </p>
            <p style={{ fontSize: 11, color: TEXT3, margin: 0 }}>
              Your conversations
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 8,
            color: TEXT3,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
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
          <button
            onClick={onNew}
            style={{
              margin: "10px 12px 4px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              color: "#818cf8",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(99,102,241,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(99,102,241,0.1)")
            }
          >
            <Plus size={13} /> New chat
          </button>

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 24,
                }}
              >
                <Loader2
                  size={18}
                  color={BRAND}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>
            ) : sessions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <MessageSquare
                  size={22}
                  color={TEXT3}
                  style={{ margin: "0 auto 8px" }}
                />
                <p style={{ fontSize: 12, color: TEXT3 }}>No chats yet</p>
              </div>
            ) : (
              Object.entries(grouped).map(([key, gs]) => {
                const isOpen = expanded[key] !== false;
                const isGeneral = key === "general";
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggle(key)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: TEXT2,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <ChevronRight
                        size={11}
                        color={TEXT3}
                        style={{
                          transform: isOpen ? "rotate(90deg)" : "none",
                          transition: "transform 0.2s",
                          flexShrink: 0,
                        }}
                      />
                      {isGeneral ? (
                        <MessageSquare size={11} color={TEXT3} />
                      ) : isOpen ? (
                        <FolderOpen size={11} color={BRAND} />
                      ) : (
                        <Folder size={11} color="#818cf8" />
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          flex: 1,
                          textAlign: "left",
                          color: TEXT2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getRmName(isGeneral ? null : key)}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: TEXT3,
                          background: "rgba(255,255,255,0.05)",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {gs.length}
                      </span>
                    </button>
                    {isOpen &&
                      gs.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => onSelect(s.id)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            paddingLeft: 28,
                            paddingRight: 12,
                            paddingTop: 8,
                            paddingBottom: 8,
                            cursor: "pointer",
                            background:
                              activeId === s.id
                                ? "rgba(99,102,241,0.08)"
                                : "transparent",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (activeId !== s.id)
                              e.currentTarget.style.background =
                                "rgba(255,255,255,0.03)";
                          }}
                          onMouseLeave={(e) => {
                            if (activeId !== s.id)
                              e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: activeId === s.id ? "#818cf8" : TEXT2,
                                margin: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {s.title}
                            </p>
                            {s.last_message && (
                              <p
                                style={{
                                  fontSize: 10,
                                  color: TEXT3,
                                  margin: "2px 0 0",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {s.last_message}
                              </p>
                            )}
                            <p
                              style={{
                                fontSize: 10,
                                color: TEXT3,
                                margin: "2px 0 0",
                              }}
                            >
                              {s.message_count} msg
                              {s.message_count !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(s.id);
                            }}
                            style={{
                              opacity: 0,
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 4,
                              borderRadius: 4,
                              color: TEXT3,
                              transition: "all 0.15s",
                              flexShrink: 0,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.color = "#f87171";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                            className="delete-btn"
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

      {collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            paddingTop: 12,
          }}
        >
          <button
            onClick={onNew}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              color: TEXT3,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            title="New chat"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      <style>{`.delete-btn:hover { opacity: 1 !important; }`}</style>
    </div>
  );
}

/* ── Main Chat ────────────────────────────────────────────── */
export default function Chat() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSess] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadSess] = useState(true);
  const [loadingMsgs, setLoadMsgs] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRM, setSelectedRM] = useState("");
  const [rmTitle, setRmTitle] = useState("");
  const [showRmPicker, setShowRmPicker] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const autoSent = useRef(false);

  useEffect(() => {
    Promise.all([api.get("/chat/sessions"), api.get("/roadmaps/")])
      .then(([s, r]) => {
        setSessions(s.data);
        setRoadmaps(r.data);
        setLoadSess(false);
      })
      .catch(() => setLoadSess(false));
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
      setActiveSess(data.id);
      setMessages([]);
      if (roadmapId) {
        setSelectedRM(roadmapId);
        setRmTitle(roadmaps.find((r) => r.id === roadmapId)?.title || "");
      } else {
        setSelectedRM("");
        setRmTitle("");
      }
      return data;
    } catch {
      toast.error("Failed to create chat");
      return null;
    }
  };

  const handleNewChat = () => {
    autoSent.current = false;
    setActiveSess(null);
    setMessages([]);
    setInput("");
    setSelectedRM("");
    setRmTitle("");
    inputRef.current?.focus();
  };

  const handleSelectSession = async (id) => {
    if (id === activeSessionId) return;
    setLoadMsgs(true);
    setActiveSess(id);
    try {
      const { data } = await api.get(`/chat/session/${id}`);
      setMessages(data.messages || []);
      setSelectedRM(data.roadmap_id || "");
      setRmTitle(roadmaps.find((r) => r.id === data.roadmap_id)?.title || "");
    } catch {
      toast.error("Failed to load chat");
    } finally {
      setLoadMsgs(false);
    }
  };

  const handleDeleteSession = async (id) => {
    await api.delete(`/chat/session/${id}`);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSess(null);
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
      const sess = await createNewSession(selectedRM || null);
      if (!sess) return;
      sid = sess.id;
    }
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat/message", {
        message: userMsg,
        history: messages.slice(-12),
        roadmap_id: selectedRM || null,
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
    <div
      style={{ display: "flex", width: "100%", height: "100%", background: BG }}
    >
      {/* History sidebar */}
      <HistorySidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={handleSelectSession}
        onDelete={handleDeleteSession}
        onNew={handleNewChat}
        roadmaps={roadmaps}
        loading={loadingSessions}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      {/* Chat main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            background: SIDEBAR,
            borderBottom: `1px solid ${BORDER}`,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 0,
            }}
          >
            <Bot size={18} color={BRAND} />
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT1,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {rmTitle || "AI Assistant"}
              </p>
              <p style={{ fontSize: 11, color: TEXT3, margin: 0 }}>
                {activeSession?.title || "Start a new conversation"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleNewChat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: INPUT_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                color: TEXT2,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
            >
              <PenSquare size={13} /> New chat
            </button>

            {/* Roadmap picker */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowRmPicker(!showRmPicker)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  background: selectedRM ? "rgba(99,102,241,0.12)" : INPUT_BG,
                  border: `1px solid ${selectedRM ? "rgba(99,102,241,0.3)" : BORDER}`,
                  borderRadius: 10,
                  color: selectedRM ? "#818cf8" : TEXT2,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Map size={13} />
                <span
                  style={{
                    maxWidth: 130,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedRM
                    ? roadmaps
                        .find((r) => r.id === selectedRM)
                        ?.title?.slice(0, 18) + "…"
                    : "Roadmap context"}
                </span>
                <ChevronDown size={12} />
              </button>
              {showRmPicker && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 6px)",
                    width: 280,
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 14,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: 8 }}>
                    <button
                      onClick={() => {
                        setSelectedRM("");
                        setRmTitle("");
                        setShowRmPicker(false);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        borderRadius: 8,
                        color: TEXT3,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      No context (general chat)
                    </button>
                    {roadmaps.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedRM(r.id);
                          setRmTitle(r.title);
                          setShowRmPicker(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          background:
                            selectedRM === r.id
                              ? "rgba(99,102,241,0.1)"
                              : "transparent",
                          border: "none",
                          borderRadius: 8,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRM !== r.id)
                            e.currentTarget.style.background =
                              "rgba(255,255,255,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRM !== r.id)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: selectedRM === r.id ? "#818cf8" : TEXT2,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {r.title}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: TEXT3,
                            margin: "2px 0 0",
                          }}
                        >
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
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 40px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {loadingMsgs ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 60,
              }}
            >
              <Loader2
                size={24}
                color={BRAND}
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          ) : isEmpty ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                paddingBottom: 40,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Sparkles size={28} color={BRAND} />
              </div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: TEXT1,
                  marginBottom: 8,
                }}
              >
                {rmTitle ? `Chatting about ${rmTitle}` : "SkillForge AI"}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: TEXT3,
                  marginBottom: 32,
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                {rmTitle
                  ? `Ask me anything about your ${rmTitle} roadmap.`
                  : "Ask me anything about programming, career, or learning resources."}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  width: "100%",
                  maxWidth: 560,
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 14,
                      fontSize: 13,
                      color: TEXT2,
                      cursor: "pointer",
                      lineHeight: 1.5,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(99,102,241,0.3)";
                      e.currentTarget.style.color = TEXT1;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.color = TEXT2;
                    }}
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
                  content: `Hi ${user?.name?.split(" ")[0]}! 👋${rmTitle ? ` Let's talk about your **${rmTitle}** roadmap.` : " I'm SkillForge AI. Ask me anything!"}`,
                }}
              />
              {messages.map((m, i) => (
                <ChatBubble key={i} msg={m} />
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: INPUT_BG,
                      border: `1px solid ${BORDER}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={15} color={BRAND} />
                  </div>
                  <div
                    style={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: "4px 18px 18px 18px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      {[0, 150, 300].map((d) => (
                        <div
                          key={d}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: BRAND,
                            animation: `bounce 1s infinite`,
                            animationDelay: `${d}ms`,
                          }}
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

        {/* Input */}
        <div
          style={{
            background: SIDEBAR,
            borderTop: `1px solid ${BORDER}`,
            padding: "16px 24px",
          }}
        >
          {selectedRM && (
            <p
              style={{
                fontSize: 11,
                color: "#818cf8",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Map size={11} /> Context: {rmTitle}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: 10,
              background: INPUT_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: "8px 8px 8px 16px",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")
            }
            onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: TEXT1,
                fontSize: 14,
                fontFamily: "DM Sans, system-ui, sans-serif",
                resize: "none",
                lineHeight: 1.5,
                paddingTop: 8,
                maxHeight: 120,
              }}
              placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: input.trim() && !loading ? BRAND : "#1e2130",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
                alignSelf: "flex-end",
              }}
            >
              {loading ? (
                <Loader2
                  size={16}
                  color="#fff"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : (
                <Send size={16} color={input.trim() ? "#fff" : TEXT3} />
              )}
            </button>
          </div>
          <p
            style={{
              fontSize: 11,
              color: TEXT3,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            AI can make mistakes — verify important information
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
