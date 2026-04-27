// import { NavLink, useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { LayoutDashboard, Map, PlusCircle, LogOut, Zap, Bot, Code2 } from 'lucide-react'

// export default function AppLayout({ children }) {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     logout()
//     navigate('/')
//   }

//   return (
//     <div className="flex min-h-screen bg-surface-1">
//       {/* Sidebar */}
//       <aside className="w-60 shrink-0 bg-white border-r border-surface-3 flex flex-col py-6 px-3 fixed top-0 left-0 h-full z-30">
//         {/* Logo */}
//         <div className="flex items-center gap-2.5 px-3 mb-8">
//           <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
//             <Zap size={16} className="text-white" strokeWidth={2.5} />
//           </div>
//           <span className="font-semibold text-ink-primary text-base tracking-tight">SkillForge</span>
//         </div>

//         {/* Nav */}
//         <nav className="flex flex-col gap-1 flex-1">
//           <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">Learn</p>
//           <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//             <LayoutDashboard size={18} />
//             Dashboard
//           </NavLink>
//           <NavLink to="/roadmaps" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//             <Map size={18} />
//             My Roadmaps
//           </NavLink>
//           <NavLink to="/onboarding" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//             <PlusCircle size={18} />
//             New Roadmap
//           </NavLink>

//           <div className="h-px bg-surface-3 my-3" />
//           <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">Tools</p>

//           <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//             <Bot size={18} />
//             AI Assistant
//           </NavLink>
//           <NavLink to="/practice" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
//             <Code2 size={18} />
//             Practice
//           </NavLink>
//         </nav>

//         {/* User */}
//         <div className="border-t border-surface-3 pt-4 mt-4">
//           <div className="px-3 mb-3">
//             <p className="text-sm font-medium text-ink-primary truncate">{user?.name}</p>
//             <p className="text-xs text-ink-ghost truncate">{user?.email}</p>
//           </div>
//           <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50">
//             <LogOut size={18} />
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 ml-60 min-h-screen">
//         <div className="max-w-5xl mx-auto px-8 py-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   )
// }

// import { useState, useEffect } from "react";
// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import api from "../utils/api";
// import {
//   LayoutDashboard,
//   Map,
//   PlusCircle,
//   LogOut,
//   Zap,
//   Bot,
//   Code2,
//   ChevronDown,
//   ChevronRight,
//   MessageSquare,
//   Folder,
//   FolderOpen,
//   Plus,
//   X,
// } from "lucide-react";

// function ChatHistoryPanel({ onClose }) {
//   const [sessions, setSessions] = useState([]);
//   const [roadmaps, setRoadmaps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     Promise.all([api.get("/chat/sessions"), api.get("/roadmaps/")])
//       .then(([s, r]) => {
//         setSessions(s.data);
//         setRoadmaps(r.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   const getRoadmapName = (roadmapId) => {
//     if (!roadmapId) return "General";
//     const r = roadmaps.find((r) => r.id === roadmapId);
//     return r
//       ? r.title.length > 22
//         ? r.title.slice(0, 22) + "…"
//         : r.title
//       : "Roadmap";
//   };

//   // Group by roadmap
//   const grouped = {};
//   sessions.forEach((s) => {
//     const key = s.roadmap_id || "general";
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(s);
//   });

//   const [expanded, setExpanded] = useState({});
//   const toggle = (k) => setExpanded((p) => ({ ...p, [k]: !p[k] }));

//   const handleDeleteSession = async (e, id) => {
//     e.stopPropagation();
//     await api.delete(`/chat/session/${id}`);
//     setSessions((prev) => prev.filter((s) => s.id !== id));
//   };

//   const handleNewChat = () => {
//     navigate("/chat");
//     onClose();
//   };

//   const goToSession = (sessionId) => {
//     navigate(`/chat?session=${sessionId}`);
//     onClose();
//   };

//   return (
//     <div className="ml-3 mt-1 mb-2 bg-surface-1 rounded-xl border border-surface-3 overflow-hidden">
//       {/* New chat */}
//       <button
//         onClick={handleNewChat}
//         className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-surface-2 transition-colors border-b border-surface-3"
//       >
//         <Plus size={13} className="text-brand-500 shrink-0" />
//         <span className="text-xs font-medium text-brand-600">New chat</span>
//       </button>

//       {loading ? (
//         <div className="px-3 py-3 text-xs text-ink-ghost">Loading…</div>
//       ) : sessions.length === 0 ? (
//         <div className="px-3 py-3 text-xs text-ink-ghost">No chats yet</div>
//       ) : (
//         <div className="py-1 max-h-60 overflow-y-auto">
//           {Object.entries(grouped).map(([key, groupSessions]) => {
//             const isOpen = expanded[key] !== false;
//             const label = key === "general" ? "General" : getRoadmapName(key);
//             const isGeneral = key === "general";
//             return (
//               <div key={key}>
//                 {/* Folder row */}
//                 <button
//                   onClick={() => toggle(key)}
//                   className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-surface-2 transition-colors"
//                 >
//                   <ChevronRight
//                     size={11}
//                     className={`text-ink-ghost transition-transform shrink-0 ${isOpen ? "rotate-90" : ""}`}
//                   />
//                   {isGeneral ? (
//                     <MessageSquare
//                       size={11}
//                       className="text-ink-ghost shrink-0"
//                     />
//                   ) : isOpen ? (
//                     <FolderOpen size={11} className="text-brand-400 shrink-0" />
//                   ) : (
//                     <Folder size={11} className="text-brand-400 shrink-0" />
//                   )}
//                   <span className="text-[11px] text-ink-secondary truncate flex-1 text-left">
//                     {label}
//                   </span>
//                   <span className="text-[10px] text-ink-ghost shrink-0">
//                     {groupSessions.length}
//                   </span>
//                 </button>

//                 {/* Sessions */}
//                 {isOpen &&
//                   groupSessions.map((s) => (
//                     <div
//                       key={s.id}
//                       onClick={() => goToSession(s.id)}
//                       className="group flex items-center gap-2 pl-7 pr-3 py-1.5 hover:bg-surface-2 cursor-pointer transition-colors"
//                     >
//                       <span className="text-[11px] text-ink-secondary truncate flex-1">
//                         {s.title}
//                       </span>
//                       <button
//                         onClick={(e) => handleDeleteSession(e, s.id)}
//                         className="opacity-0 group-hover:opacity-100 text-ink-ghost hover:text-red-500 transition-all shrink-0"
//                       >
//                         <X size={10} />
//                       </button>
//                     </div>
//                   ))}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function AppLayout({ children }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showChatHistory, setShowChatHistory] = useState(false);

//   // Auto-expand chat history when on chat page
//   useEffect(() => {
//     if (location.pathname === "/chat") setShowChatHistory(true);
//   }, [location.pathname]);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const isChatActive = location.pathname === "/chat";

//   return (
//     <div className="flex min-h-screen bg-surface-1">
//       {/* Sidebar */}
//       <aside className="w-60 shrink-0 bg-white border-r border-surface-3 flex flex-col py-6 px-3 fixed top-0 left-0 h-full z-30 overflow-y-auto">
//         {/* Logo */}
//         <div className="flex items-center gap-2.5 px-3 mb-8">
//           <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
//             <Zap size={16} className="text-white" strokeWidth={2.5} />
//           </div>
//           <span className="font-semibold text-ink-primary text-base tracking-tight">
//             SkillForge
//           </span>
//         </div>

//         {/* Nav */}
//         <nav className="flex flex-col gap-1 flex-1">
//           <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">
//             Learn
//           </p>
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <LayoutDashboard size={18} />
//             Dashboard
//           </NavLink>
//           <NavLink
//             to="/roadmaps"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <Map size={18} />
//             My Roadmaps
//           </NavLink>
//           <NavLink
//             to="/onboarding"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <PlusCircle size={18} />
//             New Roadmap
//           </NavLink>

//           <div className="h-px bg-surface-3 my-3" />
//           <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">
//             Tools
//           </p>

//           {/* AI Assistant with chat history toggle */}
//           <div>
//             <div className="flex items-center gap-1">
//               <NavLink
//                 to="/chat"
//                 className={({ isActive }) =>
//                   `sidebar-link flex-1 ${isActive ? "active" : ""}`
//                 }
//               >
//                 <Bot size={18} />
//                 AI Assistant
//               </NavLink>
//               <button
//                 onClick={() => setShowChatHistory(!showChatHistory)}
//                 title="Toggle chat history"
//                 className={`p-2 rounded-xl transition-all hover:bg-surface-2 ${showChatHistory ? "text-brand-600" : "text-ink-ghost"}`}
//               >
//                 <ChevronDown
//                   size={14}
//                   className={`transition-transform ${showChatHistory ? "rotate-180" : ""}`}
//                 />
//               </button>
//             </div>

//             {/* Chat History Panel */}
//             {showChatHistory && (
//               <ChatHistoryPanel onClose={() => setShowChatHistory(false)} />
//             )}
//           </div>

//           <NavLink
//             to="/practice"
//             className={({ isActive }) =>
//               `sidebar-link ${isActive ? "active" : ""}`
//             }
//           >
//             <Code2 size={18} />
//             Practice
//           </NavLink>
//         </nav>

//         {/* User */}
//         <div className="border-t border-surface-3 pt-4 mt-4">
//           <div className="px-3 mb-3">
//             <p className="text-sm font-medium text-ink-primary truncate">
//               {user?.name}
//             </p>
//             <p className="text-xs text-ink-ghost truncate">{user?.email}</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="sidebar-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50"
//           >
//             <LogOut size={18} />
//             Sign out
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 ml-60 min-h-screen">
//         <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
//       </main>
//     </div>
//   );
// }

import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  LogOut,
  Zap,
  Bot,
  Code2,
  Menu,
  X,
} from "lucide-react";

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-ink-primary text-base tracking-tight">
          SkillForge
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">
          Learn
        </p>
        {[
          { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { to: "/roadmaps", icon: Map, label: "My Roadmaps" },
          { to: "/onboarding", icon: PlusCircle, label: "New Roadmap" },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <div className="h-px bg-surface-3 my-3" />
        <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">
          Tools
        </p>

        <NavLink
          to="/chat"
          onClick={onNavClick}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Bot size={18} />
          AI Assistant
        </NavLink>
        <NavLink
          to="/practice"
          onClick={onNavClick}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Code2 size={18} />
          Practice
        </NavLink>
      </nav>

      <div className="border-t border-surface-3 pt-4 mt-4">
        <div className="px-3 mb-3">
          <p className="text-sm font-medium text-ink-primary truncate">
            {user?.name}
          </p>
          <p className="text-xs text-ink-ghost truncate">{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className="sidebar-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isChatPage = location.pathname === "/chat";
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface-1">
      {/* Desktop sidebar — fixed */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-surface-3 flex-col py-6 px-3 fixed top-0 left-0 h-full z-30 overflow-y-auto">
        <SidebarContent
          user={user}
          onLogout={handleLogout}
          onNavClick={() => {}}
        />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl flex flex-col py-6 px-3 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-ink-ghost hover:text-ink-primary rounded-lg hover:bg-surface-2"
            >
              <X size={18} />
            </button>
            <SidebarContent
              user={user}
              onLogout={handleLogout}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-surface-3 flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-xl text-ink-secondary hover:bg-surface-2 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm text-ink-primary">
              SkillForge
            </span>
          </div>
        </header>

        {/* Page */}
        {isChatPage ? (
          <div className="flex-1 flex overflow-hidden">{children}</div>
        ) : (
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
