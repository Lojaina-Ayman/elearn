// Mock data for testing the application before backend integration

export const mockUsers = [
  {
    id: 'demo-user-1',
    email: 'demo@learnhub.com',
    password: 'demo123',
    fullname: 'Alex Johnson',
    username: 'alexj',
    points: 1250,
    level: 5,
    role: 'student',
    bio: 'Passionate learner exploring web development and data science.',
    joinDate: '2024-01-15',
    streak: 7,
    completedCourses: 3,
    completedLessons: 23
  },
  {
    id: 'demo-user-2',
    email: 'sarah@learnhub.com',
    password: 'sarah123',
    fullname: 'Sarah Chen',
    username: 'sarahc',
    points: 2100,
    level: 7,
    role: 'student',
    bio: 'Frontend developer learning React and modern web technologies.',
    joinDate: '2023-11-20',
    streak: 12,
    completedCourses: 5,
    completedLessons: 45
  },
  {
    id: 'demo-user-3',
    email: 'admin@learnhub.com',
    password: 'admin123',
    fullname: 'John Instructor',
    username: 'johni',
    points: 5000,
    level: 15,
    role: 'admin',
    bio: 'Senior developer and course instructor with 10+ years experience.',
    joinDate: '2023-08-10',
    streak: 30,
    completedCourses: 12,
    completedLessons: 120
  }
]

export const mockCourses = [
  {
    id: 'course-1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, state, and props',
    category: 'Frontend',
    difficulty: 'Beginner',
    duration: '8 hours',
    lessons: 12,
    students: 1250,
    rating: 4.8,
    price: 0,
    instructor: 'John Instructor',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: true,
    progress: 75
  },
  {
    id: 'course-2',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts and ES6+ features',
    category: 'Frontend',
    difficulty: 'Advanced',
    duration: '15 hours',
    lessons: 20,
    students: 890,
    rating: 4.9,
    price: 100,
    instructor: 'Sarah Chen',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'course-3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express',
    category: 'Backend',
    difficulty: 'Intermediate',
    duration: '12 hours',
    lessons: 16,
    students: 750,
    rating: 4.7,
    price: 150,
    instructor: 'Mike Rodriguez',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: true,
    progress: 25
  },
  {
    id: 'course-4',
    title: 'Python for Data Science',
    description: 'Learn Python programming for data analysis and machine learning',
    category: 'Data Science',
    difficulty: 'Beginner',
    duration: '20 hours',
    lessons: 25,
    students: 2100,
    rating: 4.6,
    price: 200,
    instructor: 'Dr. Emily Watson',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'course-5',
    title: 'React Native Mobile Apps',
    description: 'Build cross-platform mobile applications with React Native',
    category: 'Mobile',
    difficulty: 'Intermediate',
    duration: '18 hours',
    lessons: 22,
    students: 650,
    rating: 4.5,
    price: 180,
    instructor: 'Alex Johnson',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: false,
    progress: 0
  },
  {
    id: 'course-6',
    title: 'Docker & Kubernetes',
    description: 'Master containerization and orchestration with Docker and Kubernetes',
    category: 'DevOps',
    difficulty: 'Advanced',
    duration: '14 hours',
    lessons: 18,
    students: 420,
    rating: 4.8,
    price: 250,
    instructor: 'David Kim',
    thumbnail: '/api/placeholder/300/200',
    isEnrolled: false,
    progress: 0
  }
]

export const mockLessons = [
  {
    id: 'lesson-1',
    title: 'Introduction to React',
    content_documented: `# Introduction to React

React is a popular JavaScript library for building user interfaces, particularly web applications. It was developed by Facebook and is now maintained by Facebook and the community.

## What is React?

React is a **declarative**, **efficient**, and **flexible** JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

### Key Features:

1. **Component-Based**: Build encapsulated components that manage their own state
2. **Declarative**: React makes it painless to create interactive UIs
3. **Learn Once, Write Anywhere**: You can develop new features without rewriting existing code

## Why Use React?

- **Virtual DOM**: React uses a virtual DOM which makes it faster
- **Reusable Components**: Write once, use everywhere
- **Strong Community**: Large ecosystem and community support
- **Backed by Facebook**: Continuous development and support

## Getting Started

To start with React, you need to understand:

- JavaScript ES6+ features
- HTML and CSS
- Basic understanding of DOM manipulation

Let's dive deeper into these concepts in the upcoming lessons!`,
    course_id: 'course-1',
    quiz_id: 'quiz-1',
    xp: 50,
    order: 1,
    duration: '30 min',
    type: 'video',
    isCompleted: true
  },
  {
    id: 'lesson-2',
    title: 'Setting up Development Environment',
    content_documented: `# Setting up Development Environment

Before we start building React applications, we need to set up our development environment properly.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Code editor (VS Code recommended)

## Installation Steps

1. **Install Node.js**
   - Download from nodejs.org
   - Verify installation: \`node --version\`

2. **Create React App**
   \`\`\`bash
   npx create-react-app my-app
   cd my-app
   npm start
   \`\`\`

3. **Project Structure**
   - src/ - Source code
   - public/ - Static files
   - package.json - Dependencies

## Development Tools

- React Developer Tools (browser extension)
- ESLint for code quality
- Prettier for code formatting

Now you're ready to start building React applications!`,
    course_id: 'course-1',
    quiz_id: 'quiz-2',
    xp: 75,
    order: 2,
    duration: '45 min',
    type: 'video',
    isCompleted: true
  },
  {
    id: 'lesson-3',
    title: 'Understanding Components',
    content_documented: `# Understanding Components

Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces.

## Types of Components

### 1. Functional Components
\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

### 2. Class Components
\`\`\`jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
\`\`\`

## Component Rules

1. Always start component names with a capital letter
2. Components must return a single element
3. Use JSX to describe the UI

## Best Practices

- Keep components small and focused
- Use descriptive names
- Extract reusable logic into custom hooks

Components make your code more organized and maintainable!`,
    course_id: 'course-1',
    quiz_id: 'quiz-3',
    xp: 100,
    order: 3,
    duration: '60 min',
    type: 'video',
    isCompleted: false
  }
]

export const mockQuizzes = [
  {
    id: 'quiz-1',
    title: 'React Fundamentals Quiz',
    passing_score: 70,
    total_score: 100,
    xp_reward: 100,
    time_limit: 10,
    questions: [
      {
        id: 'q1',
        title: 'What is React?',
        difficulty: 'beginner',
        options: [
          { id: 'opt1', optionText: 'A JavaScript library for building user interfaces', isCorrect: true },
          { id: 'opt2', optionText: 'A database management system', isCorrect: false },
          { id: 'opt3', optionText: 'A CSS framework', isCorrect: false },
          { id: 'opt4', optionText: 'A server-side language', isCorrect: false }
        ]
      },
      {
        id: 'q2',
        title: 'Which company developed React?',
        difficulty: 'beginner',
        options: [
          { id: 'opt5', optionText: 'Google', isCorrect: false },
          { id: 'opt6', optionText: 'Facebook', isCorrect: true },
          { id: 'opt7', optionText: 'Microsoft', isCorrect: false },
          { id: 'opt8', optionText: 'Apple', isCorrect: false }
        ]
      }
    ]
  }
]

export const mockAchievements = [
  { id: 1, title: 'First Steps', description: 'Completed your first lesson', icon: '🎯', earned: true },
  { id: 2, title: 'Quick Learner', description: 'Completed 5 lessons in one day', icon: '⚡', earned: true },
  { id: 3, title: 'Consistent', description: 'Maintained a 7-day streak', icon: '🔥', earned: true },
  { id: 4, title: 'Course Master', description: 'Completed your first course', icon: '🏆', earned: true },
  { id: 5, title: 'Knowledge Seeker', description: 'Completed 10 courses', icon: '📚', earned: false },
  { id: 6, title: 'Expert', description: 'Reached level 10', icon: '⭐', earned: false }
]

export const mockLeaderboard = [
  { id: 'demo-user-3', fullname: 'John Instructor', username: 'johni', points: 5000, level: 15, streak: 30, courses: 12, avatar: '👨‍🏫' },
  { id: 'demo-user-2', fullname: 'Sarah Chen', username: 'sarahc', points: 2100, level: 7, streak: 12, courses: 5, avatar: '👩‍💻' },
  { id: 'demo-user-1', fullname: 'Alex Johnson', username: 'alexj', points: 1250, level: 5, streak: 7, courses: 3, avatar: '👨‍💻' },
  { id: 'user-4', fullname: 'Emma Wilson', username: 'emmaw', points: 980, level: 4, streak: 5, courses: 2, avatar: '👩‍🎓' },
  { id: 'user-5', fullname: 'Mike Rodriguez', username: 'miker', points: 750, level: 3, streak: 3, courses: 1, avatar: '👨‍🎓' }
]

// Helper functions for mock API responses
export const getMockUser = (email, password) => {
  return mockUsers.find(user => user.email === email && user.password === password)
}

export const getMockCourses = () => {
  return mockCourses
}

export const getMockEnrolledCourses = (userId) => {
  return mockCourses.filter(course => course.isEnrolled)
}

export const getMockLessons = (courseId) => {
  return mockLessons.filter(lesson => lesson.course_id === courseId)
}

export const getMockQuiz = (quizId) => {
  return mockQuizzes.find(quiz => quiz.id === quizId)
}