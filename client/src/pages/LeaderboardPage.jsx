import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userAPI } from '../services/api'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Coins, 
  TrendingUp, 
  Calendar,
  Filter,
  Search,
  Award,
  Target,
  Flame,
  Users
} from 'lucide-react'

const LeaderboardPage = () => {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('points')
  const [timeFilter, setTimeFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [userRank, setUserRank] = useState(null)

  const tabs = [
    { id: 'points', label: 'Points', icon: Coins },
    { id: 'level', label: 'Level', icon: Star },
    { id: 'streak', label: 'Streak', icon: Flame },
    { id: 'courses', label: 'Courses', icon: Trophy }
  ]

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
    { value: 'today', label: 'Today' }
  ]

  useEffect(() => {
    fetchLeaderboardData()
  }, [activeTab, timeFilter])

  const fetchLeaderboardData = async () => {
    setLoading(true)
    try {
      // For now, we'll use a simple approach since there's no specific leaderboard API
      // In a real implementation, you'd create a leaderboard endpoint in the backend
      const response = await userAPI.getUsers()
      const users = response.data || []

      // Sort users based on the active tab
      const sortedUsers = users.sort((a, b) => {
        switch (activeTab) {
          case 'points': return (b.xp || 0) - (a.xp || 0)
          case 'level': return (b.rank || 0) - (a.rank || 0)
          case 'streak': return (b.strike || 0) - (a.strike || 0)
          case 'courses': return 0 // Would need course completion data
          default: return (b.xp || 0) - (a.xp || 0)
        }
      })

      // Transform data for leaderboard display
      const leaderboardData = sortedUsers.map((userData, index) => ({
        id: userData.user_id,
        fullname: userData.fullname,
        username: userData.username,
        avatar: userData.fullname?.charAt(0)?.toUpperCase() || 'U',
        points: userData.xp || 0,
        level: userData.rank || 1,
        streak: userData.strike || 0,
        courses: 0, // Would need to be calculated from user courses
        change: 0, // Would need historical data
        isCurrentUser: userData.user_id === user?.id
      }))

      setLeaderboardData(leaderboardData)

      // Find current user's rank
      const currentUserRank = leaderboardData.findIndex(item => item.isCurrentUser) + 1
      setUserRank(currentUserRank > 0 ? currentUserRank : null)

    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setLeaderboardData([])
      setUserRank(null)
    } finally {
      setLoading(false)
    }
  }

  const generateMockLeaderboard = (type) => {
    const names = [
      'Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Emma Wilson', 'David Kim',
      'Lisa Thompson', 'James Brown', 'Maria Garcia', 'Chris Lee', 'Anna Davis',
      'Tom Wilson', 'Jessica Miller', 'Ryan Taylor', 'Sophie Anderson', 'Mark Johnson',
      'Rachel Green', 'Kevin Zhang', 'Amy Liu', 'Daniel Smith', 'Grace Wang'
    ]

    const avatars = ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨']

    return names.map((name, index) => {
      const basePoints = Math.max(2000 - (index * 100) + Math.random() * 200, 100)

      return {
        id: index === 0 ? user?.id : `user-${index}`,
        fullname: index === 0 ? user?.fullname || name : name,
        username: index === 0 ? user?.username || name.toLowerCase().replace(' ', '') : name.toLowerCase().replace(' ', ''),
        avatar: avatars[index % avatars.length],
        points: type === 'points' ? Math.round(basePoints) : Math.round(basePoints * 0.8),
        level: type === 'level' ? Math.max(Math.floor(basePoints / 200), 1) : Math.max(Math.floor(basePoints / 250), 1),
        streak: type === 'streak' ? Math.max(Math.floor(basePoints / 100), 1) : Math.max(Math.floor(basePoints / 150), 1),
        courses: type === 'courses' ? Math.max(Math.floor(basePoints / 300), 1) : Math.max(Math.floor(basePoints / 400), 1),
        change: Math.floor(Math.random() * 10) - 5, // -5 to +5 change
        isCurrentUser: index === 0
      }
    }).sort((a, b) => {
      switch (type) {
        case 'points': return b.points - a.points
        case 'level': return b.level - a.level
        case 'streak': return b.streak - a.streak
        case 'courses': return b.courses - a.courses
        default: return b.points - a.points
      }
    })
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Medal className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default: return 'bg-white border border-gray-200 text-gray-700'
    }
  }

  const getMetricValue = (item, metric) => {
    switch (metric) {
      case 'points': return item.points.toLocaleString()
      case 'level': return item.level
      case 'streak': return `${item.streak} days`
      case 'courses': return item.courses
      default: return item.points.toLocaleString()
    }
  }

  const getMetricIcon = (metric) => {
    switch (metric) {
      case 'points': return <Coins className="h-4 w-4 text-warning-600" />
      case 'level': return <Star className="h-4 w-4 text-primary-600" />
      case 'streak': return <Flame className="h-4 w-4 text-orange-600" />
      case 'courses': return <Trophy className="h-4 w-4 text-success-600" />
      default: return <Coins className="h-4 w-4 text-warning-600" />
    }
  }

  const filteredData = leaderboardData.filter(item =>
    item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other learners</p>
        </div>

        {/* User's Current Rank Card */}
        {userRank && (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Your Current Rank</h3>
                  <p className="text-primary-100">Keep learning to climb higher!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">#{userRank}</div>
                <div className="text-primary-100">out of {leaderboardData.length}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Filter */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="input"
              >
                {timeFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filteredData.slice(0, 3).map((item, index) => {
            const rank = index + 1
            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-lg shadow-sm border-2 p-6 text-center ${
                  rank === 1 ? 'border-yellow-300 bg-gradient-to-b from-yellow-50 to-yellow-100' :
                  rank === 2 ? 'border-gray-300 bg-gradient-to-b from-gray-50 to-gray-100' :
                  'border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100'
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 right-4">
                  {getRankIcon(rank)}
                </div>

                {/* Avatar */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl mb-4 ${
                  rank === 1 ? 'bg-yellow-200' :
                  rank === 2 ? 'bg-gray-200' :
                  'bg-amber-200'
                }`}>
                  {item.avatar}
                </div>

                {/* User Info */}
                <h3 className="font-semibold text-gray-900 mb-1">{item.fullname}</h3>
                <p className="text-sm text-gray-600 mb-3">@{item.username}</p>

                {/* Metric */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {getMetricIcon(activeTab)}
                  <span className="text-2xl font-bold text-gray-900">
                    {getMetricValue(item, activeTab)}
                  </span>
                </div>

                {/* Change Indicator */}
                {item.change !== 0 && (
                  <div className={`inline-flex items-center space-x-1 text-xs ${
                    item.change > 0 ? 'text-success-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${item.change < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(item.change)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Full Rankings</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredData.slice(3).map((item, index) => {
              const rank = index + 4
              return (
                <div
                  key={item.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    item.isCurrentUser ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="w-12 text-center">
                        <span className="text-lg font-bold text-gray-600">#{rank}</span>
                      </div>

                      {/* Avatar */}
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {item.avatar}
                      </div>

                      {/* User Info */}
                      <div>
                        <h4 className="font-medium text-gray-900">{item.fullname}</h4>
                        <p className="text-sm text-gray-600">@{item.username}</p>
                      </div>

                      {/* Current User Badge */}
                      {item.isCurrentUser && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Metric Value */}
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(activeTab)}
                        <span className="text-lg font-semibold text-gray-900">
                          {getMetricValue(item, activeTab)}
                        </span>
                      </div>

                      {/* Change Indicator */}
                      {item.change !== 0 && (
                        <div className={`flex items-center space-x-1 text-sm ${
                          item.change > 0 ? 'text-success-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 ${item.change < 0 ? 'rotate-180' : ''}`} />
                          <span>{Math.abs(item.change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {leaderboardData.length}
              </div>
              <div className="text-gray-600">Total Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600 mb-1">
                {leaderboardData.reduce((sum, item) => sum + item.points, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600 mb-1">
                {Math.max(...leaderboardData.map(item => item.level))}
              </div>
              <div className="text-gray-600">Highest Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {Math.max(...leaderboardData.map(item => item.streak))}
              </div>
              <div className="text-gray-600">Longest Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage