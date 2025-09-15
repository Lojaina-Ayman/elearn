import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI, userAPI } from '../services/api'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Play, 
  Lock,
  Search,
  Filter,
  Grid,
  List,
  Coins,
  Trophy,
  CheckCircle
} from 'lucide-react'
import LessonsPage from './LessonPage';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const categories = [
    { value: 'all', label: 'All Courses' },
    { value: 'Programming', label: 'Programming' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Security', label: 'Security' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Database', label: 'Database' },
    { value: 'Backend Development', label: 'Backend Development' },
    { value: 'Design', label: 'Design' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' }

  ]

  useEffect(() => {
    fetch('https://mrpingu-production.up.railway.app/course')
      .then(res => res.json())
      .then(data => {
        let coursesArr = Array.isArray(data) ? data : (Array.isArray(data.courses) ? data.courses : []);
        coursesArr = coursesArr.map(course => ({
          ...course,
          id: course.course_id
        }));
        setCourses(coursesArr);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    fetch('https://mrpingu-production.up.railway.app/user/courses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          return [];
        }
        return res.json();
      })
      .then(data => {
        let enrolledArr = Array.isArray(data) ? data : [];
        enrolledArr = enrolledArr.map(course => ({
          ...course,
          id: course.course_id
        }));
        setEnrolledCourses(enrolledArr);
      })
      .catch(console.error);

  }, []);

  function enrollCourse(courseId) {
    const token = localStorage.getItem('token');
    fetch(`https://mrpingu-production.up.railway.app/user/courses/${courseId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(() => {
        fetch('https://mrpingu-production.up.railway.app/user/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            let enrolledArr = Array.isArray(data) ? data : [];
            enrolledArr = enrolledArr.map(course => ({
              ...course,
              id: course.course_id
            }));
            setEnrolledCourses(enrolledArr);
          });
        setSelectedCourseId(courseId);
      })
      .catch(console.error);
  }

  function isEnrolled(courseId) {
    return Array.isArray(enrolledCourses) && enrolledCourses.some(c => c.id === courseId);
  }

  // Ensure courses is always an array before filtering
  const coursesArray = Array.isArray(courses) ? courses : []
  console.log('Courses for filtering:', coursesArray)
  console.log('Type of courses:', typeof courses)
  console.log('Is courses an array:', Array.isArray(courses))

  const filteredCourses = coursesArray.filter(course => {
    if (!course) return false
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100'
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'Advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
          <p className="text-gray-600">Discover new skills and advance your career</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCourses.map((course) => (
            <div key={course.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
              {/* Course Thumbnail */}
              <div className={`bg-gradient-to-br from-primary-100 to-primary-200 ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} flex items-center justify-center`}>
                <BookOpen className="h-12 w-12 text-primary-600" />
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Course Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  </div>
                  {isEnrolled(course.id) && (
                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 ml-2" />
                  )}
                </div>

                {/* Course Meta */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium text-primary-600 bg-primary-100">
                    {course.category}
                  </span>
                </div>

                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {course.price === 0 ? (
                      <span className="text-sm font-medium text-success-600">Free</span>
                    ) : (
                      <>
                        <Coins className="h-4 w-4 text-warning-600" />
                        <span className="text-sm font-medium text-gray-900">{course.price} points</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex space-x-2">
                  {isEnrolled(course.id) ? (
                    <Link
                      to={`/course/${course.id}`}
                      className="btn btn-primary flex-1 text-center"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={() => enrollCourse(course.id)}
                      className="btn btn-primary flex-1"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
        {selectedCourseId && <LessonsPage courseId={selectedCourseId} />}
      </div>
    </div>
  )
}

export default CoursesPage

