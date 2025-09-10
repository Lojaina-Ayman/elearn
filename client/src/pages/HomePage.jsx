import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userAPI, courseAPI } from '../services/api'
import { 
  BookOpen, 
  Trophy, 
  Star, 
  Coins, 
  Play, 
  Clock, 
  Target,
  TrendingUp,
  Award,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react'

const HomePage = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    completedLessons: 0,
    streak: 0,
    rank: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const [coursesResponse] = await Promise.all([
        userAPI.getEnrolledCourses(),
      ])

      setEnrolledCourses(coursesResponse.data || [])

      // Mock user stats - in real app, this would come from API
      setUserStats({
        totalPoints: user?.points || 1250,
        level: user?.level || 5,
        completedLessons: 23,
        streak: 7,
        rank: 42
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (course) => {
    // Mock progress calculation
    return Math.floor(Math.random() * 100)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.fullname?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-warning-600">{userStats.totalPoints}</p>
              </div>
              <div className="bg-warning-100 rounded-full p-3">
                <Coins className="h-6 w-6 text-warning-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Level</p>
                <p className="text-2xl font-bold text-primary-600">{userStats.level}</p>
              </div>
              <div className="bg-primary-100 rounded-full p-3">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-success-600">{userStats.completedLessons}</p>
              </div>
              <div className="bg-success-100 rounded-full p-3">
                <Target className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Day Streak</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.streak}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Learning Path</h2>
                  <Link 
                    to="/courses" 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => {
                      const progress = calculateProgress(course)
                      return (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-primary-100 rounded-lg p-2">
                                <BookOpen className="h-5 w-5 text-primary-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{course.title}</h3>
                                <p className="text-sm text-gray-600">{course.category}</p>
                              </div>
                            </div>
                            <Link
                              to={`/course/${course.id}`}
                              className="btn btn-primary text-sm"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Continue
                            </Link>
                          </div>

                          <div className="mb-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                    <Link to="/courses" className="btn btn-primary">
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/courses" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Browse Courses</span>
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Trophy className="h-5 w-5 text-warning-600" />
                  <span className="text-gray-700">View Leaderboard</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-5 w-5 text-success-600" />
                  <span className="text-gray-700">Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Achievement */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Your Rank</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">#{userStats.rank}</div>
                <p className="text-primary-100">Global Ranking</p>
              </div>
            </div>

            {/* Daily Goal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-5 w-5 text-success-600" />
                <h3 className="text-lg font-semibold text-gray-900">Daily Goal</h3>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Lessons completed today</span>
                  <span>2/3</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-success-600" style={{ width: '66%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Complete 1 more lesson to reach your daily goal!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage