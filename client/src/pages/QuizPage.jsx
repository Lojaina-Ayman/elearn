import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { quizAPI, userAPI, lessonAPI } from '../services/api'
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star,
  ArrowRight,
  RotateCcw,
  Target,
  Award
} from 'lucide-react'

const QuizPage = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuizData()
  }, [lessonId])

  useEffect(() => {
    let timer
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, quizCompleted])

  const fetchQuizData = async () => {
    try {
      const lessonResponse = await lessonAPI.getLesson(lessonId)
      const lesson = lessonResponse.data

      if (lesson.quiz_id) {
        const [quizResponse, questionsResponse] = await Promise.all([
          quizAPI.getQuiz(lesson.quiz_id),
          quizAPI.getQuizQuestions(lesson.quiz_id)
        ])

        setQuiz(quizResponse.data)
        setQuestions(questionsResponse.data || [])
        setTimeLeft(quizResponse.data.time_limit * 60) // Convert minutes to seconds
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error)

      // Mock data for demonstration
      setQuiz({
        id: 'quiz-1',
        title: 'React Fundamentals Quiz',
        passing_score: 70,
        total_score: 100,
        xp_reward: 100,
        time_limit: 10 // 10 minutes
      })

      setQuestions([
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
        },
        {
          id: 'q3',
          title: 'What is JSX?',
          difficulty: 'intermediate',
          options: [
            { id: 'opt9', optionText: 'A syntax extension for JavaScript', isCorrect: true },
            { id: 'opt10', optionText: 'A new programming language', isCorrect: false },
            { id: 'opt11', optionText: 'A CSS preprocessor', isCorrect: false },
            { id: 'opt12', optionText: 'A database query language', isCorrect: false }
          ]
        },
        {
          id: 'q4',
          title: 'What is the Virtual DOM?',
          difficulty: 'intermediate',
          options: [
            { id: 'opt13', optionText: 'A real DOM element', isCorrect: false },
            { id: 'opt14', optionText: 'A JavaScript representation of the real DOM', isCorrect: true },
            { id: 'opt15', optionText: 'A CSS framework', isCorrect: false },
            { id: 'opt16', optionText: 'A server technology', isCorrect: false }
          ]
        },
        {
          id: 'q5',
          title: 'How do you create a React component?',
          difficulty: 'beginner',
          options: [
            { id: 'opt17', optionText: 'Using a function or class', isCorrect: true },
            { id: 'opt18', optionText: 'Only using classes', isCorrect: false },
            { id: 'opt19', optionText: 'Only using functions', isCorrect: false },
            { id: 'opt20', optionText: 'Using HTML only', isCorrect: false }
          ]
        }
      ])

      setTimeLeft(10 * 60) // 10 minutes in seconds
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    questions.forEach(question => {
      const selectedOptionId = answers[question.id]
      const correctOption = question.options.find(opt => opt.isCorrect)
      if (selectedOptionId === correctOption?.id) {
        correctAnswers++
      }
    })

    return Math.round((correctAnswers / questions.length) * 100)
  }

  const handleSubmitQuiz = async () => {
    setSubmitting(true)
    try {
      const score = calculateScore()
      const passed = score >= quiz.passing_score

      // Submit quiz attempt
      await userAPI.createQuizAttempt(quiz.id, score)

      setResults({
        score,
        passed,
        correctAnswers: questions.filter(q => {
          const selectedOptionId = answers[q.id]
          const correctOption = q.options.find(opt => opt.isCorrect)
          return selectedOptionId === correctOption?.id
        }).length,
        totalQuestions: questions.length,
        xpEarned: passed ? quiz.xp_reward : Math.floor(quiz.xp_reward * 0.5)
      })

      setQuizCompleted(true)
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetakeQuiz = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
    setResults(null)
    setTimeLeft(quiz.time_limit * 60)
    setQuizStarted(true)
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimeColor = () => {
    if (timeLeft > 300) return 'text-green-600' // > 5 minutes
    if (timeLeft > 60) return 'text-yellow-600'  // > 1 minute
    return 'text-red-600' // < 1 minute
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No quiz available</h2>
          <p className="text-gray-600 mb-4">This lesson doesn't have a quiz.</p>
          <Link to={`/course/${courseId}/lesson/${lessonId}`} className="btn btn-primary">
            Back to Lesson
          </Link>
        </div>
      </div>
    )
  }

  // Quiz Results Screen
  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.passed ? 'bg-success-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <Trophy className="h-10 w-10 text-success-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {results.passed ? 'Congratulations!' : 'Keep Trying!'}
            </h1>
            <p className="text-gray-600">
              {results.passed 
                ? 'You passed the quiz and earned XP!' 
                : 'You can retake the quiz to improve your score.'
              }
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-2">{results.score}%</div>
                <div className="text-gray-600">Your Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning-600 mb-2">+{results.xpEarned}</div>
                <div className="text-gray-600">XP Earned</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!results.passed && (
              <button
                onClick={handleRetakeQuiz}
                className="btn btn-primary"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </button>
            )}

            <Link
              to={`/course/${courseId}`}
              className="btn btn-secondary"
            >
              Back to Course
            </Link>

            {results.passed && (
              <Link
                to={`/course/${courseId}`}
                className="btn btn-success"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue Learning
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to={`/course/${courseId}/lesson/${lessonId}`}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Lesson</span>
          </Link>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">Test your knowledge and earn XP!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{questions.length}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{quiz.time_limit}</div>
                <div className="text-gray-600">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">{quiz.passing_score}%</div>
                <div className="text-gray-600">Passing Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-600 mb-1">{quiz.xp_reward}</div>
                <div className="text-gray-600">XP Reward</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Quiz Instructions:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• You have {quiz.time_limit} minutes to complete the quiz</li>
                <li>• You need {quiz.passing_score}% to pass</li>
                <li>• You can navigate between questions</li>
                <li>• Your progress is saved automatically</li>
                <li>• You can retake the quiz if you don't pass</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartQuiz}
                className="btn btn-primary text-lg px-8 py-3"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Questions Screen
  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion?.id]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <span className="text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className={`flex items-center space-x-2 ${getTimeColor()}`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg font-semibold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'beginner' ? 'text-green-600 bg-green-100' :
                currentQuestion.difficulty === 'intermediate' ? 'text-yellow-600 bg-yellow-100' :
                'text-red-600 bg-red-100'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQuestion.title}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswer === option.id
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option.optionText}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-3">
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting || Object.keys(answers).length !== questions.length}
                className="btn btn-success"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Question Overview</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary-600 text-white'
                    : answers[questions[index].id]
                    ? 'bg-success-100 text-success-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success-100 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Not answered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-600 rounded"></div>
              <span>Current</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage