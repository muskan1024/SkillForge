import { useState } from 'react'
import { NavLink,useNavigate,useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard,PlusCircle,LogOut,Zap,Bot,Code2,Menu,X,Award,Route,MessagesSquare } from 'lucide-react'
import SkillForge_Logo_BG from '../assets/SkillForge_Logo_BG.png'


function SidebarContent({ user,onLogout,onNavClick }) {
  return (
    <>
      <div className="flex items-center gap-3 px-4 mb-5">
        {/* <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
          <Zap size={18} className="text-white fill-white/20" strokeWidth={2} />
        </div> */}
        <img src={SkillForge_Logo_BG} className='h-8' alt="SkillForge_Logo" srcset="" />
        <span className="font-bold text-zinc-100 text-lg tracking-tight">SkillForge</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1 px-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-3 mb-2">Learn</p>
        {[
          { to: '/dashboard',icon: LayoutDashboard,label: 'Dashboard' },
          { to: '/roadmaps',icon: Route,label: 'My Roadmaps' },
          { to: '/onboarding',icon: PlusCircle,label: 'New Roadmap' },
        ].map(({ to,icon: Icon,label }) => (
          <NavLink key={to} to={to} onClick={onNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}

        <div className="h-px bg-white/5 my-2 mx-2" />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-3 mb-2">Tools</p>

        <NavLink to="/chat" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Bot size={18} className="shrink-0" /><span className="truncate">AI Assistant</span>
        </NavLink>
        <NavLink to="/practice" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Code2 size={18} className="shrink-0" /><span className="truncate">Practice IDE</span>
        </NavLink>
        <NavLink to="/interview" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <MessagesSquare size={18} className="shrink-0" /><span className="truncate">Interview Prep</span>
        </NavLink>

        <div className="h-px bg-white/5 my-2 mx-2" />
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-3 mb-2">Progress</p>
        <NavLink to="/badges" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Award size={18} className="shrink-0" /><span className="truncate">Badges</span>
        </NavLink>
      </nav>

      <div className="mt-6 p-4 mx-2 rounded-2xl bg-surface-800/30 border border-white/5 backdrop-blur-md">
        <div className="mb-4">
          <p className="text-sm font-semibold text-zinc-200 truncate">{user?.name}</p>
          <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300">
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  )
}

export default function AppLayout({ children }) {
  const { user,logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen,setMobileOpen] = useState(false)

  const isChatPage = location.pathname === '/chat'
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Decorative background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/30 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none" />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col py-6 fixed top-0 left-0 h-full z-30 overflow-y-auto bg-surface-900/50 backdrop-blur-2xl border-r border-white/5">
        <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => { }} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
          <aside className="absolute left-0 top-0 h-full w-72 shadow-2xl flex flex-col py-6 overflow-y-auto bg-surface-900/90 backdrop-blur-2xl border-r border-white/10"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-200 rounded-xl hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Right of sidebar — scrolls only for non-chat pages */}
      <div className="flex-1 flex flex-col h-full md:ml-64 relative z-10 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex-shrink-0 flex items-center gap-3 px-4 py-4 bg-surface-900/70 backdrop-blur-xl border-b border-white/5">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div> */}
            <img src={SkillForge_Logo_BG} className='h-7' alt="SkillForge_Logo" srcset="" />
            <span className="font-bold text-base text-zinc-100 tracking-tight">SkillForge</span>
          </div>
        </header>

        {isChatPage ? (
          /* Chat: fixed height, internal scroll only */
          <div className="flex-1 flex overflow-hidden min-h-0 p-4 lg:p-6">{children}</div>
        ) : (
          /* All other pages: normal vertical scroll */
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  )
}
