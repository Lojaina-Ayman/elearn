import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { lessonAPI, userAPI, courseAPI } from '../services/api'
import SummaryModal from '../components/SummaryModal'
import SummaryViewer from '../components/SummaryViewer'
import QuizzesPage from './QuizPage'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Trophy, 
  FileText, 
  Video, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  BookOpen,
  Upload,
  Save,
  X,
  MessageSquare
} from 'lucide-react'

const LessonPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [allLessons, setAllLessons] = useState([])
  const [userLesson, setUserLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [editingSummary, setEditingSummary] = useState(null)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoMuted, setVideoMuted] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [completed, setCompleted] = useState(false)
  const [lessons, setLessons] = useState([])
  const [completedLessons, setCompletedLessons] = useState([])
  const [showQuizzes, setShowQuizzes] = useState(false)

  useEffect(() => {
    setLoading(true);
    fetch(`https://mrpingu-production.up.railway.app/lesson/${lessonId}`)
      .then(res => res.json())
      .then(setLesson)
      .catch(console.error);

    fetch(`https://mrpingu-production.up.railway.app/course/${courseId}`)
      .then(res => res.json())
      .then(setCourse)
      .catch(console.error);

    fetch(`https://mrpingu-production.up.railway.app/lesson?course_id=${courseId}`)
      .then(res => res.json())
      .then(setAllLessons)
      .catch(console.error);

    const token = localStorage.getItem('token');
    if (token) {
      fetch(`https://mrpingu-production.up.railway.app/user/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(setUserLesson)
        .catch(console.error);
    }
    setLoading(false);
  }, [courseId, lessonId])

  useEffect(() => {
    fetch(`https://mrpingu-production.up.railway.app/lesson?course_id=${courseId}`)
      .then(res => res.json())
      .then(setLessons)
      .catch(console.error);

    fetch('https://mrpingu-production.up.railway.app/user/lessons')
      .then(res => res.json())
      .then(setCompletedLessons)
      .catch(console.error);
  }, [courseId]);

  const fetchLessonData = async () => {
    try {
      const [lessonResponse, courseResponse, lessonsResponse, userLessonResponse] = await Promise.all([
        lessonAPI.getLesson(lessonId),
        courseAPI.getCourse(courseId),
        lessonAPI.getLessons(),
        userAPI.getUserLesson(lessonId)
      ])

      setLesson(lessonResponse.data)
      setCourse(courseResponse.data)

      // Filter lessons for this course and sort by order
      const courseLessons = lessonsResponse.data
        ?.filter(l => l.course_id === courseId)
        ?.sort((a, b) => (a.order || 0) - (b.order || 0)) || []
      setAllLessons(courseLessons)

      setUserLesson(userLessonResponse.data)

    } catch (error) {
      console.error('Error fetching lesson data:', error)

      setLesson(null)
      setCourse(null)
      setAllLessons([])
      setUserLesson(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteLesson = async () => {
    setCompleting(true)
    try {
      if (!userLesson) {
        await userAPI.addUserLesson(lessonId)
      }
      await userAPI.updateUserLesson(lessonId, { completed: true })
      setUserLesson({ ...userLesson, completed: true })
      setCompleted(true)

      // Award 10 points for lesson completion
      // Assuming setUserPoints is available in this scope
      setUserPoints(prev => prev + 10)

      // Navigate to quiz if available
      navigate(`/course/${courseId}/lesson/${lessonId}/quiz`)
    } catch (error) {
      console.error('Error completing lesson:', error)
    } finally {
      setCompleting(false)
    }
  }

  const handleSaveSummary = async (summaryData) => {
    try {
      // In a real app, this would save to the backend
      console.log('Saving summary:', summaryData)
      setShowSummaryModal(false)
      setEditingSummary(null)
    } catch (error) {
      console.error('Error saving summary:', error)
    }
  }

  const handleAddSummary = (existingSummary = null) => {
    setEditingSummary(existingSummary)
    setShowSummaryModal(true)
  }

  const handleEditSummary = (summary) => {
    setEditingSummary(summary)
    setShowSummaryModal(true)
  }

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lessonId)
  }

  const getNextLesson = () => {
    const currentIndex = getCurrentLessonIndex()
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  }

  const getPreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex()
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null
  }

  function completeLesson(lessonId, xp) {
    fetch(`https://mrpingu-production.up.railway.app/user/lessons/${lessonId}`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setCompletedLessons(prev => [...prev, { id: lessonId }]);
        // Add points logic here, e.g. update user points state
        if (lessons.length === completedLessons.length + 1) setShowQuizzes(true);
      })
      .catch(console.error);
  }

  function isCompleted(lessonId) {
    return Array.isArray(completedLessons) && completedLessons.some(l => l.id === lessonId);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson not found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <Link to={`/course/${courseId}`} className="btn btn-primary">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to={`/course/${courseId}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Course</span>
            </Link>
            <div className="text-sm text-gray-500">
              {course?.title} • Lesson {getCurrentLessonIndex() + 1} of {allLessons.length}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {userLesson?.completed ? (
              <div className="flex items-center space-x-2 text-success-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : (
              <button
                onClick={handleCompleteLesson}
                disabled={completing}
                className="btn btn-success text-sm"
              >
                {completing ? 'Completing...' : 'Mark Complete'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration || '30 min'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>{lesson.xp} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video className="h-4 w-4" />
                  <span>Video Lesson</span>
                </div>
              </div>
            </div>

            {/* Video Player */}
            {lesson.type === 'video' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
                <div className="relative bg-gray-900 aspect-video">
                  {/* Mock Video Player */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="bg-black bg-opacity-50 rounded-lg p-8">
                        <Video className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Video Content</h3>
                        <p className="text-gray-300">Interactive video player would be here</p>
                      </div>
                    </div>
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setVideoPlaying(!videoPlaying)}
                          className="hover:text-primary-400"
                        >
                          {videoPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </button>
                        <button
                          onClick={() => setVideoMuted(!videoMuted)}
                          className="hover:text-primary-400"
                        >
                          {videoMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <span className="text-sm">0:00 / 30:00</span>
                      </div>
                      <button className="hover:text-primary-400">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className="h-4 w-4 inline mr-2" />
                    Lesson Content
                  </button>
                  <button
                    onClick={() => setActiveTab('summaries')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'summaries'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    Summaries
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'content' && (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {lesson.content_documented}
                    </div>
                  </div>
                )}

                {activeTab === 'summaries' && (
                  <SummaryViewer
                    type="lesson"
                    itemId={lessonId}
                    onAddSummary={handleAddSummary}
                    onEditSummary={handleEditSummary}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Lesson Progress</span>
                  <span className="text-primary-600 font-medium">
                    {userLesson?.completed ? '100%' : '0%'}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: userLesson?.completed ? '100%' : '0%' }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {userLesson?.completed ? 'Lesson completed!' : 'Complete the lesson to earn XP'}
                </div>
              </div>
            </div>

            {/* Course Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {allLessons.map((courseLesson, index) => (
                  <Link
                    key={courseLesson.id}
                    to={`/course/${courseId}/lesson/${courseLesson.id}`}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      courseLesson.id === lessonId
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {courseLesson.id === lessonId ? (
                        <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-xs font-medium text-white">{index + 1}</span>
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">{courseLesson.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              {previousLesson && (
                <Link
                  to={`/course/${courseId}/lesson/${previousLesson.id}`}
                  className="btn btn-secondary w-full flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Link>
              )}

              {nextLesson && userLesson?.completed && (
                <Link
                  to={`/course/${courseId}/lesson/${nextLesson.id}`}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Summary Modal */}
        {showSummaryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Add Lesson Summary</h3>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Share your key takeaways from this lesson. Your summary will be available to other learners.
                </p>
                <textarea
                  className="input min-h-[200px] resize-none"
                  placeholder="Write your lesson summary here..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSummary}
                  disabled={!summary.trim()}
                  className="btn btn-primary"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Summary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Page */}
        {showQuizzes && <QuizzesPage courseId={courseId} />}
      </div>
    </div>
  )
}

export default LessonPage