import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userAPI, skillAPI } from '../services/api'
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  X, 
  Trophy, 
  Star, 
  Coins, 
  Calendar,
  Award,
  Target,
  BookOpen,
  TrendingUp,
  Settings,
  Shield,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    completedCourses: 0,
    completedLessons: 0,
    streak: 0,
    joinDate: new Date(),
    achievements: []
  })
  const [userSkills, setUserSkills] = useState([])
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    achievements: true
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      })
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [skillsResponse] = await Promise.all([
        userAPI.getUserSkills()
      ])

      setUserSkills(skillsResponse.data || [])

      // Use real user data from backend
      setUserStats({
        totalPoints: user?.xp || 0,
        level: user?.rank || 1,
        completedCourses: 0, // This would need to be calculated from user courses
        completedLessons: 0, // This would need to be calculated from user lessons
        streak: user?.strike || 0,
        joinDate: user?.created_at ? new Date(user.created_at) : new Date(),
        achievements: [
          { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: false },
          { id: 2, title: 'Quick Learner', description: 'Completed 5 lessons in one day', icon: '⚡', earned: false },
          { id: 3, title: 'Consistent', description: 'Maintained a 7-day streak', icon: '🔥', earned: (user?.strike || 0) >= 7 },
          { id: 4, title: 'Course Master', description: 'Completed your first course', icon: '🏆', earned: false },
          { id: 5, title: 'Knowledge Seeker', description: 'Completed 10 courses', icon: '📚', earned: false },
          { id: 6, title: 'Expert', description: 'Reached level 10', icon: '⭐', earned: (user?.rank || 1) >= 10 }
        ]
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    })
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      const response = await userAPI.updateUser(user.id, formData)
      updateUser(formData)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      // In a real app, this would call an API to change password
      console.log('Changing password...')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      alert('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <div className="h-20 w-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.fullname}</h3>
                <p className="text-gray-600">@{user?.username}</p>
                <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                  <div className="flex items-center space-x-1 text-warning-600">
                    <Coins className="h-4 w-4" />
                    <span>{userStats.totalPoints}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-primary-600">
                    <Star className="h-4 w-4" />
                    <span>Level {userStats.level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="space-y-1 p-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn btn-primary"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="btn btn-success"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="btn btn-secondary"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.fullname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">@{user?.username}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {editing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {editing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={3}
                        className="input resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900">{formData.bio || 'No bio added yet.'}</p>
                    )}
                  </div>
                </div>

                {/* Change Password Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="btn btn-primary mt-4"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Points</p>
                        <p className="text-2xl font-bold text-warning-600">{userStats.totalPoints}</p>
                      </div>
                      <Coins className="h-8 w-8 text-warning-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Level</p>
                        <p className="text-2xl font-bold text-primary-600">{userStats.level}</p>
                      </div>
                      <Star className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                        <p className="text-2xl font-bold text-success-600">{userStats.completedCourses}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-success-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Day Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{userStats.streak}</p>
                      </div>
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Lessons Completed</span>
                        <span>{userStats.completedLessons}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Member Since</span>
                        <span>{userStats.joinDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userStats.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned
                          ? 'border-success-200 bg-success-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            achievement.earned ? 'text-success-900' : 'text-gray-600'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-success-700' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <Trophy className="h-5 w-5 text-success-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'pushNotifications' && 'Push Notifications'}
                          {key === 'courseUpdates' && 'Course Updates'}
                          {key === 'achievements' && 'Achievement Notifications'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'pushNotifications' && 'Receive push notifications in browser'}
                          {key === 'courseUpdates' && 'Get notified about new courses and updates'}
                          {key === 'achievements' && 'Get notified when you earn achievements'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage