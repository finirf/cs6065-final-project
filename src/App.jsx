import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DataPull from './pages/DataPull'
import Search from './pages/Search'
import DataLoading from './pages/DataLoading'
import { Home, BarChart3, Search as SearchIcon, Upload, Database } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/'

  if (isLoginPage) return null

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">Retail Analytics</span>
          </div>
          <div className="flex items-center space-x-1">
            <NavLink to="/dashboard" icon={<BarChart3 className="w-4 h-4" />}>
              Dashboard
            </NavLink>
            <NavLink to="/datapull" icon={<Database className="w-4 h-4" />}>
              Data Pull
            </NavLink>
            <NavLink to="/search" icon={<SearchIcon className="w-4 h-4" />}>
              Search
            </NavLink>
            <NavLink to="/dataloading" icon={<Upload className="w-4 h-4" />}>
              Data Loading
            </NavLink>
            <Link to="/" className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, children, icon }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/datapull" element={<DataPull />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dataloading" element={<DataLoading />} />
      </Routes>
    </Router>
  )
}

export default App
