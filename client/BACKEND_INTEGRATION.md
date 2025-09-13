# Backend Integration Guide

This document outlines the changes made to integrate the frontend with the real backend API.

## 🔄 Changes Made

### 1. **Authentication System Updated**
- **File**: `src/contexts/AuthContext.jsx`
- **Changes**:
  - Removed mock authentication
  - Updated to use real backend API endpoints
  - Changed from localStorage token to httpOnly cookie authentication
  - Updated user data fields to match backend schema

### 2. **API Configuration Updated**
- **File**: `src/services/api.js`
- **Changes**:
  - Added `withCredentials: true` for cookie-based authentication
  - Removed Authorization header interceptor (using cookies now)
  - Kept all existing API endpoint mappings

### 3. **User Data Field Mapping**
Backend user schema fields mapped to frontend:
- `user.xp` → Points/XP display
- `user.rank` → User level
- `user.strike` → Learning streak
- `user.user_id` → User ID
- `user.fullname` → Display name
- `user.username` → Username
- `user.email` → Email address

### 4. **Pages Updated for Real Data**

#### **HomePage** (`src/pages/HomePage.jsx`)
- Updated user stats to use real backend fields
- Removed mock data fallbacks
- Uses `user.xp`, `user.rank`, `user.strike`

#### **CoursesPage** (`src/pages/CoursesPage.jsx`)
- Removed mock course data
- Uses real API calls for courses and enrollment

#### **CoursePage** (`src/pages/CoursePage.jsx`)
- Removed mock course and lesson data
- Uses real API calls for course details and lessons

#### **LessonPage** (`src/pages/LessonPage.jsx`)
- Removed mock lesson content
- Uses real API calls for lesson data

#### **QuizPage** (`src/pages/QuizPage.jsx`)
- Removed mock quiz data
- Uses real API calls for quiz and questions

#### **ProfilePage** (`src/pages/ProfilePage.jsx`)
- Updated user stats to use real backend fields
- Achievement logic updated based on real data

#### **LeaderboardPage** (`src/pages/LeaderboardPage.jsx`)
- Updated to fetch real user data for leaderboard
- Sorts users based on real backend fields

### 5. **Navigation Components Updated**
- **File**: `src/components/Navbar.jsx`
- **Changes**:
  - Updated to display `user.xp` instead of `user.points`
  - Updated to display `user.rank` instead of `user.level`

### 6. **Login Page Cleaned**
- **File**: `src/pages/LoginPage.jsx`
- **Changes**:
  - Removed demo account credentials display
  - Now uses real authentication only

## 🔗 Backend API Endpoints Used

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout

### User Management
- `GET /user` - Get all users (for leaderboard)
- `GET /user/:id` - Get user by ID
- `PATCH /user/:id` - Update user
- `GET /user/skills` - Get user skills
- `POST /user/skills/:skillId` - Add user skill
- `DELETE /user/skills/:skillId` - Remove user skill
- `GET /user/courses` - Get enrolled courses
- `POST /user/courses/:courseId` - Enroll in course
- `GET /user/lessons` - Get user lesson progress
- `GET /user/lessons/:lessonId` - Get specific lesson progress
- `POST /user/lessons/:lessonId` - Create lesson progress
- `PATCH /user/lessons/:lessonId` - Update lesson progress
- `GET /user/quizAttempts` - Get quiz attempts
- `POST /user/quizAttempts/:quizId` - Create quiz attempt

### Course Management
- `GET /course` - Get all courses
- `GET /course/:courseId` - Get specific course
- `GET /course/:courseId/users` - Get course users

### Lesson Management
- `GET /lesson` - Get all lessons
- `GET /lesson/:lessonId` - Get specific lesson

### Quiz Management
- `GET /quiz` - Get all quizzes
- `GET /quiz/:quizId` - Get specific quiz
- `GET /quiz/:quizId/questions` - Get quiz questions

### Question Management
- `GET /question` - Get all questions
- `GET /question/:questionId/options` - Get question options

### Skill Management
- `GET /skill` - Get all skills

## 🔐 Authentication Flow

1. **Login**: User submits credentials → Backend validates → Sets httpOnly JWT cookie → Frontend stores user data in localStorage
2. **API Requests**: All requests automatically include JWT cookie → Backend validates → Returns data
3. **Logout**: Frontend calls logout endpoint → Backend clears cookie → Frontend clears localStorage

## 🚀 How to Test

1. **Start Backend Server**:
   ```bash
   cd server
   npm start
   ```

2. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

3. **Create Account**: Use the signup form to create a new account
4. **Login**: Use your credentials to login
5. **Test Features**: All features now use real backend data

## 📝 Notes

### Current Limitations
- Some features require additional backend endpoints for full functionality:
  - Course completion tracking
  - Lesson completion statistics
  - Achievement system
  - Leaderboard with historical data

### Future Enhancements
- Add course progress calculation endpoints
- Add achievement tracking system
- Add leaderboard-specific endpoints with time filters
- Add summary/notes system endpoints

### Error Handling
- All API calls include proper error handling
- Failed requests show appropriate error messages
- Authentication errors redirect to login page

## 🔧 Development Notes

- The frontend is now fully integrated with the backend
- All mock data has been removed
- Cookie-based authentication is properly implemented
- User data fields are correctly mapped
- Error handling is in place for all API calls

The application is now ready for production use with the real backend!