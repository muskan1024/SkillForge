import { Routes,Route,Navigate } from 'react-router-dom'
import { AuthProvider,useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import RoadmapView from './pages/RoadmapView'
import MyRoadmaps from './pages/MyRoadmaps'
import Chat from './pages/Chat'
import Practice from './pages/Practice'
import InterviewPrep from './pages/InterviewPrep'
import Badges from './pages/Badges'
import AppLayout from './components/AppLayout'
import LessonView from './pages/LessonView'

function ProtectedRoute({ children }) {
  const { user,loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user,loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><AppLayout><Onboarding /></AppLayout></ProtectedRoute>} />
        <Route path="/roadmaps" element={<ProtectedRoute><AppLayout><MyRoadmaps /></AppLayout></ProtectedRoute>} />
        <Route path="/roadmaps/:id" element={<ProtectedRoute><AppLayout><RoadmapView /></AppLayout></ProtectedRoute>} />
        <Route path="/learn/:roadmapId/:topicIndex" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AppLayout><Chat /></AppLayout></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><AppLayout><Practice /></AppLayout></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><AppLayout><InterviewPrep /></AppLayout></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><AppLayout><Badges /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
