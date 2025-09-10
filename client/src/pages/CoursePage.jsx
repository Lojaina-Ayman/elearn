import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { courseAPI, lessonAPI, userAPI } from '../services/api'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Play, 
  Lock,
  CheckCircle,
  ArrowLeft,
  Trophy,
  Target,
  FileText,
  Video,
  Award,
  Coins
} from 'lucide-react'

const CoursePage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [userLessons, setUserLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      const [courseResponse, lessonsResponse, userLessonsResponse, enrolledCoursesResponse] = await Promise.all([
        courseAPI.getCourse(courseId),
        lessonAPI.getLessons(),
        userAPI.getUserLessons(),
        userAPI.getEnrolledCourses()
      ])

      setCourse(courseResponse.data)

      // Filter lessons for this course
      const courseLessons = lessonsResponse.data?.filter(lesson => lesson.course_id === courseId) || []
      setLessons(courseLessons)

      setUserLessons(userLessonsResponse.data || [])

      // Check if user is enrolled
      const enrolled = enrolledCoursesResponse.data?.some(enrolledCourse => enrolledCourse.id === courseId)
      setIsEnrolled(enrolled)

    } catch (error) {
      console.error('Error fetching course data:', error)

      // Mock data for demonstration
      setCourse({
        id: courseId,
        title: 'React Fundamentals',
        description: 'Learn the basics of React including components, state, and props. This comprehensive course will take you from beginner to intermediate level in React development.',
        category: 'Frontend',
        difficulty: 'Beginner',
        duration: '8 hours',
        students: 1250,
        rating: 4.8,
        price: 0,
        instructor: 'John Doe',
        thumbnail: '/api/placeholder/400/250'
      })

      setLessons([
        {
          id: '1',
          title: 'Introduction to React',
          content_documented: 'Learn what React is and why it\'s popular',
          course_id: courseId,
          xp: 50,
          order: 1,
          duration: '30 min',
          type: 'video'
        },
        {
          id: '2',
          title: 'Setting up Development Environment',
          content_documented: 'Install Node.js, npm, and create your first React app',
          course_id: courseId,
          xp: 75,
          order: 2,
          duration: '45 min',
          type: 'video'
        },
        {
          id: '3',
          title: 'Understanding Components',
          content_documented: 'Learn about functional and class components',
          course_id: courseId,
          xp: 100,
          order: 3,
          duration: '60 min',
          type: 'video'
        },
        {
          id: '4',
          title: 'Props and State',
          content_documented: 'Master the concepts of props and state management',
          course_id: courseId,
          xp: 125,
          order: 4,
          duration: '75 min',
          type: 'video'
        },
        {
          id: '5',
          title: 'Event Handling',
          content_documented: 'Learn how to handle user interactions in React',
          course_id: courseId,
          xp: 100,
          order: 5,
          duration: '50 min',
          type: 'video'
        }
      ])

      setUserLessons([
        { lesson_id: '1', completed: true },
        { lesson_id: '2', completed: true }
      ])

      setIsEnrolled(true)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await userAPI.enrollInCourse(courseId)
      setIsEnrolled(true)
    } catch (error) {
      console.error('Error enrolling in course:', error)
    } finally {
      setEnrolling(false)
    }
  }

  const isLessonCompleted = (lessonId) => {
    return userLessons.some(userLesson => userLesson.lesson_id === lessonId && userLesson.completed)
  }

  const isLessonUnlocked = (lessonIndex) => {
    if (lessonIndex === 0) return true
    return isLessonCompleted(lessons[lessonIndex - 1]?.id)
  }

  const getCompletedLessonsCount = () => {
    return lessons.filter(lesson => isLessonCompleted(lesson.id)).length
  }

  const getProgressPercentage = () => {
    if (lessons.length === 0) return 0
    return Math.round((getCompletedLessonsCount() / lessons.length) * 100)
  }

  const getTotalXP = () => {
    return lessons.reduce((total, lesson) => total + (lesson.xp || 0), 0)
  }

  const getEarnedXP = () => {
    return lessons
      .filter(lesson => isLessonCompleted(lesson.id))
      .reduce((total, lesson) => total + (lesson.xp || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/courses" className="btn btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                  <p className="text-gray-600 mb-4">{course.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{lessons.length} lessons</span>
                    </div>
                  </div>
                </div>
              </div>

              {isEnrolled && (
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-900">Course Progress</span>
                    <span className="text-sm font-medium text-primary-900">{getProgressPercentage()}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-primary-700 mt-2">
                    <span>{getCompletedLessonsCount()} of {lessons.length} lessons completed</span>
                    <span>{getEarnedXP()} / {getTotalXP()} XP earned</span>
                  </div>
                </div>
              )}

              {!isEnrolled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {course.price === 0 ? (
                      <span className="text-lg font-bold text-success-600">Free</span>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Coins className="h-5 w-5 text-warning-600" />
                        <span className="text-lg font-bold text-gray-900">{course.price} points</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-primary"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              )}
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {lessons.map((lesson, index) => {
                  const completed = isLessonCompleted(lesson.id)
                  const unlocked = isLessonUnlocked(index)

                  return (
                    <div key={lesson.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex-shrink-0">
                            {completed ? (
                              <CheckCircle className="h-6 w-6 text-success-600" />
                            ) : unlocked ? (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                              </div>
                            ) : (
                              <Lock className="h-6 w-6 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className={`font-medium ${completed ? 'text-success-600' : unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                              {lesson.title}
                            </h3>
                            <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {lesson.content_documented}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Video className="h-3 w-3" />
                                <span>{lesson.duration || '30 min'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-3 w-3" />
                                <span>{lesson.xp} XP</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isEnrolled && unlocked && (
                            <Link
                              to={`/course/${courseId}/lesson/${lesson.id}`}
                              className={`btn text-sm ${completed ? 'btn-success' : 'btn-primary'}`}
                            >
                              {completed ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </>
                              )}
                            </Link>
                          )}
                          {!unlocked && (
                            <span className="text-sm text-gray-400">Complete previous lesson</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.difficulty === 'Beginner' ? 'text-green-600 bg-green-100' :
                    course.difficulty === 'Intermediate' ? 'text-yellow-600 bg-yellow-100' :
                    'text-red-600 bg-red-100'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="text-gray-900 font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total XP</span>
                  <span className="text-gray-900 font-medium">{getTotalXP()}</span>
                </div>
                {isEnrolled && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Earned XP</span>
                    <span className="text-success-600 font-medium">{getEarnedXP()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {course.instructor?.charAt(0)?.toUpperCase() || 'I'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{course.instructor || 'Course Instructor'}</p>
                  <p className="text-sm text-gray-600">Expert Developer</p>
                </div>
              </div>
            </div>

            {/* Certificate */}
            {isEnrolled && getProgressPercentage() === 100 && (
              <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg shadow-sm p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Certificate Ready!</h3>
                </div>
                <p className="text-warning-100 mb-4">
                  Congratulations! You've completed the course and earned your certificate.
                </p>
                <button className="btn bg-white text-warning-600 hover:bg-gray-100 w-full">
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage