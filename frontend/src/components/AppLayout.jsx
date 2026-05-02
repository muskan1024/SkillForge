import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Map, PlusCircle, LogOut, Zap,
  Bot, Code2, Menu, X, Brain, Award, Target
} from 'lucide-react'

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-ink-primary text-base tracking-tight">SkillForge</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">Learn</p>
        {[
          { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/roadmaps',   icon: Map,             label: 'My Roadmaps' },
          { to: '/onboarding', icon: PlusCircle,      label: 'New Roadmap' },
        ].map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />{label}
          </NavLink>
        ))}

        <div className="h-px bg-surface-3 my-3" />
        <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">Tools</p>

        <NavLink to="/chat" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Bot size={18} />AI Assistant
        </NavLink>
        <NavLink to="/practice" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Code2 size={18} />Practice
        </NavLink>
        <NavLink to="/interview" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Brain size={18} />Interview Prep
        </NavLink>

        <div className="h-px bg-surface-3 my-3" />
        <p className="text-[10px] font-semibold text-ink-ghost uppercase tracking-widest px-3 mb-1">Progress</p>

        <NavLink to="/badges" onClick={onNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Award size={18} />Badges
        </NavLink>
      </nav>

      <div className="border-t border-surface-3 pt-4 mt-4">
        <div className="px-3 mb-3">
          <p className="text-sm font-medium text-ink-primary truncate">{user?.name}</p>
          <p className="text-xs text-ink-ghost truncate">{user?.email}</p>
        </div>
        <button onClick={onLogout}
          className="sidebar-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut size={18} />Sign out
        </button>
      </div>
    </>
  )
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isChatPage = location.pathname === '/chat'
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen bg-surface-1">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-surface-3 flex-col py-6 px-3 fixed top-0 left-0 h-full z-30 overflow-y-auto">
        <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl flex flex-col py-6 px-3 overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-ink-ghost hover:text-ink-primary rounded-lg hover:bg-surface-2">
              <X size={18} />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavClick={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-surface-3 flex items-center gap-3 px-4 py-3">
          <button onClick={() => setMobileOpen(true)}
            className="p-2 -ml-1 rounded-xl text-ink-secondary hover:bg-surface-2 transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm text-ink-primary">SkillForge</span>
          </div>
        </header>

        {isChatPage ? (
          <div className="flex-1 flex overflow-hidden">{children}</div>
        ) : (
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
          </main>
        )}
      </div>
    </div>
  )
}
