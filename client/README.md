# LearnHub - E-Learning Platform

A comprehensive e-learning platform built with React, Vite, and Tailwind CSS. Features gamified learning with points, levels, achievements, and community-driven content.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing with Demo Accounts

The application includes mock authentication for testing purposes. Use these demo accounts to explore different user roles and features:

### Demo Accounts

| Role | Email | Password | Features |
|------|-------|----------|----------|
| **Student** | `demo@learnhub.com` | `demo123` | Basic student account with moderate progress |
| **Advanced Student** | `sarah@learnhub.com` | `sarah123` | Advanced student with higher level and more courses |
| **Admin/Instructor** | `admin@learnhub.com` | `admin123` | High-level account with instructor privileges |

### Testing Features

1. **Authentication**
   - Login with any demo account
   - Sign up with new credentials (creates mock account)
   - Logout functionality

2. **Dashboard & Navigation**
   - View personalized dashboard with stats
   - Navigate between different sections
   - Responsive design on mobile/desktop

3. **Course Management**
   - Browse available courses
   - Enroll in free courses
   - View course progress and lessons

4. **Learning Experience**
   - Complete lessons and earn XP
   - Take quizzes with timer and scoring
   - Track progress through courses

5. **Community Features**
   - Add lesson summaries (public/private)
   - View summaries from other learners
   - Like and interact with content

6. **Gamification**
   - Earn points and level up
   - View achievements and progress
   - Check leaderboard rankings

7. **Profile Management**
   - Edit profile information
   - Change password
   - View learning statistics

## 🎯 Key Features

### 🎮 Gamified Learning
- **Points System**: Earn points for completing lessons and quizzes
- **Levels**: Progress through levels based on accumulated XP
- **Streaks**: Maintain daily learning streaks
- **Achievements**: Unlock badges for various milestones
- **Leaderboard**: Compete with other learners

### 📚 Course Management
- **Progressive Learning**: Unlock lessons sequentially
- **Multiple Formats**: Video lessons with interactive content
- **Quizzes**: Timed assessments with immediate feedback
- **Certificates**: Earn completion certificates

### 👥 Community Features
- **Lesson Summaries**: Share and discover key insights
- **Public/Private Content**: Control visibility of your contributions
- **Social Interactions**: Like and comment on summaries
- **Search & Filter**: Find relevant content easily

### 📱 Modern UI/UX
- **Responsive Design**: Works on all device sizes
- **Tailwind CSS**: Modern, utility-first styling
- **Lucide Icons**: Beautiful, consistent iconography
- **Smooth Animations**: Enhanced user experience

## 🛠 Technical Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS v3.4.0
- **Routing**: React Router v6
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── SummaryModal.jsx
│   └── SummaryViewer.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx
├── data/              # Mock data for testing
│   └── mockData.js
├── pages/             # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── CoursesPage.jsx
│   ├── CoursePage.jsx
│   ├── LessonPage.jsx
│   ├── QuizPage.jsx
│   ├── ProfilePage.jsx
│   └── LeaderboardPage.jsx
├── services/          # API integration
│   └── api.js
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🔗 API Integration

The application is ready for backend integration with a complete API service layer (`src/services/api.js`) that maps to your backend endpoints:

- **Authentication**: Login, signup, logout
- **Users**: Profile management, progress tracking
- **Courses**: Course CRUD, enrollment
- **Lessons**: Content delivery, completion tracking
- **Quizzes**: Assessment system, scoring
- **Skills**: Skill management and tracking

## 🎨 Design System

The application uses a consistent design system with:

- **Primary Colors**: Blue theme for main actions
- **Success Colors**: Green for achievements and completion
- **Warning Colors**: Orange/yellow for points and rewards
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins
- **Components**: Reusable button, input, and card styles

## 🚀 Deployment

To deploy the application:

```bash
# Build for production
npm run build

# The dist/ folder contains the built application
# Deploy to your preferred hosting service
```

## 🔄 Backend Integration

To connect with your backend:

1. Update the `API_BASE_URL` in `src/services/api.js`
2. Replace mock authentication in `src/contexts/AuthContext.jsx`
3. Remove mock data imports and use real API calls
4. Update error handling for production use

## 📝 Notes

- All components are built with JSX (not JS) as requested
- The application uses React Router for single-page navigation
- Mock data provides realistic testing scenarios
- All pages are responsive and mobile-friendly
- The codebase follows React best practices and conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with demo accounts
5. Submit a pull request

---

**Happy Learning! 🎓**