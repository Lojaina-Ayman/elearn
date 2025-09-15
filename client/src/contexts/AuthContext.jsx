import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Function to check auth status with the backend
  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      // In a real app, you would have a GET endpoint to verify the JWT cookie
      // For now, we simulate this by trying to fetch user data
      const response = await userAPI.getUserById(localStorage.getItem('userId'))
      if (response.data.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        throw new Error('Auth check failed')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('userId')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check for user on app start, but also verify with the backend
    const userData = localStorage.getItem('user')
    const userId = localStorage.getItem('userId')

    if (userData && userId) {
      checkAuthStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.signin({ email, password })

      if (response.data.success) {
        const userData = response.data.user
        // Store user ID and data in localStorage for persistence
        localStorage.setItem('userId', userData.user_id)
        localStorage.setItem('user', JSON.stringify(userData))

        setUser(userData)
        setIsAuthenticated(true)

        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)

      if (response.data.success) {
        const newUser = response.data.user
        localStorage.setItem('userId', newUser.user_id)
        localStorage.setItem('user', JSON.stringify(newUser))

        setUser(newUser)
        setIsAuthenticated(true)

        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Signup failed' 
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.signout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Remove user data from localStorage and reset state
      localStorage.removeItem('userId')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    setUser(newUserData)
    localStorage.setItem('user', JSON.stringify(newUserData))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}