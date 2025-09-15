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

  useEffect(() => {
    // Check if user is logged in on app start
    const userData = localStorage.getItem('user')

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.signin({ email, password })

      if (response.data.success) {
        const userData = response.data.user
        // If backend returns a token, store it
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
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
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
        }
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
      // Remove user data from localStorage (JWT cookie is cleared by backend)
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