import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import LoginPage      from './pages/Login'
import RegisterPage   from './pages/Register'
import DashboardPage  from './pages/Dashboard'
import BenchmarksPage from './pages/Benchmarks'
import ModelsPage     from './pages/Models'
import ExperimentsPage from './pages/Experiments'
import EvaluationPage from './pages/Evaluation'
import ResultsPage    from './pages/Results'
import ScoresPage     from './pages/Scores'
import UsersPage      from './pages/Users'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated (wrapped in AppLayout) */}
        <Route element={<AppLayout><DashboardPage /></AppLayout>}  path="/dashboard" />
        <Route element={<AppLayout><BenchmarksPage /></AppLayout>} path="/benchmarks" />
        <Route element={<AppLayout><ModelsPage /></AppLayout>}     path="/models" />
        <Route element={<AppLayout><ExperimentsPage /></AppLayout>} path="/experiments" />
        <Route element={<AppLayout><EvaluationPage /></AppLayout>} path="/experiments/:id" />
        <Route element={<AppLayout><ResultsPage /></AppLayout>}    path="/experiments/:id/results" />
        <Route element={<AppLayout><ScoresPage /></AppLayout>}     path="/scores" />
        <Route element={<AppLayout><UsersPage /></AppLayout>}      path="/users" />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
