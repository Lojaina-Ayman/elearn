import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  BookOpen, 
  Home, 
  Trophy, 
  User, 
  LogOut, 
  Menu, 
  X,
  Star,
  Coins
} from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-warning-600">
                <Coins className="h-4 w-4" />
                <span className="font-medium">{user?.points || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-primary-600">
                <Star className="h-4 w-4" />
                <span className="font-medium">Level {user?.level || 1}</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-200">
                <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.fullname}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
              </div>

              {/* User Stats */}
              <div className="flex justify-around py-2 border-b border-gray-200">
                <div className="flex items-center space-x-1 text-warning-600">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.points || 0} Points</span>
                </div>
                <div className="flex items-center space-x-1 text-primary-600">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Level {user?.level || 1}</span>
                </div>
              </div>

              {/* Navigation Links */}
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'text-primary-600 bg-primary-100'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar