import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  FileText, 
  User, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  Star,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
  Search,
  Plus
} from 'lucide-react'

const SummaryViewer = ({ 
  type = 'lesson', // 'lesson' or 'course'
  itemId,
  onAddSummary,
  onEditSummary
}) => {
  const { user } = useAuth()
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'mine', 'public'
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'popular'

  useEffect(() => {
    fetchSummaries()
  }, [itemId, filter, sortBy])

  const fetchSummaries = async () => {
    setLoading(true)
    try {
      // In a real app, this would fetch from the API
      // const response = await summaryAPI.getSummaries(type, itemId, filter, sortBy)

      // Mock data for demonstration
      const mockSummaries = [
        {
          id: '1',
          content: `# React Fundamentals - Key Takeaways

This lesson provided an excellent introduction to React. Here are the main points I learned:

## What is React?
- A JavaScript library for building user interfaces
- Developed by Facebook (now Meta)
- Uses a component-based architecture
- Implements a Virtual DOM for better performance

## Key Benefits:
1. **Reusable Components**: Write once, use everywhere
2. **Declarative**: Easier to understand and debug
3. **Large Ecosystem**: Tons of libraries and tools
4. **Strong Community**: Great support and resources

## My Personal Insights:
- The concept of components really clicked for me when I thought of them as custom HTML elements
- Virtual DOM was confusing at first, but the performance benefits are clear
- JSX syntax feels weird initially but becomes natural quickly

## Next Steps:
- Practice creating simple components
- Learn about props and state management
- Explore React developer tools

Overall, this was a solid foundation lesson that sets up the rest of the course well!`,
          author: {
            id: user?.id,
            fullname: user?.fullname || 'You',
            username: user?.username || 'you'
          },
          isPublic: true,
          tags: ['react', 'javascript', 'beginner', 'components'],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          likes: 12,
          comments: 3,
          isLiked: false,
          isOwner: true
        },
        {
          id: '2',
          content: `Great lesson! Here's what I found most helpful:

**Virtual DOM Explanation**: The analogy of React keeping a "blueprint" of the page in memory really helped me understand why it's faster.

**Component Thinking**: Breaking down UI into components is like organizing code into functions - it just makes sense!

**JSX Tips**: 
- Remember that className, not class
- Always close self-closing tags
- Use camelCase for attributes

The examples were clear and the progression was logical. Looking forward to the next lesson on components!`,
          author: {
            id: '2',
            fullname: 'Sarah Chen',
            username: 'sarahc'
          },
          isPublic: true,
          tags: ['react', 'jsx', 'tips'],
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T15:45:00Z',
          likes: 8,
          comments: 1,
          isLiked: true,
          isOwner: false
        },
        {
          id: '3',
          content: `Quick summary for my own reference:

- React = library for UIs
- Components = reusable pieces
- Virtual DOM = performance optimization
- JSX = HTML-like syntax in JS

Need to review: How exactly does the Virtual DOM work under the hood?`,
          author: {
            id: '3',
            fullname: 'Mike Rodriguez',
            username: 'miker'
          },
          isPublic: false,
          tags: ['notes', 'review'],
          createdAt: '2024-01-13T09:20:00Z',
          updatedAt: '2024-01-13T09:20:00Z',
          likes: 0,
          comments: 0,
          isLiked: false,
          isOwner: false
        }
      ]

      // Apply filters
      let filteredSummaries = mockSummaries

      if (filter === 'mine') {
        filteredSummaries = mockSummaries.filter(s => s.isOwner)
      } else if (filter === 'public') {
        filteredSummaries = mockSummaries.filter(s => s.isPublic)
      }

      // Apply search
      if (searchTerm) {
        filteredSummaries = filteredSummaries.filter(s => 
          s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      }

      // Apply sorting
      filteredSummaries.sort((a, b) => {
        switch (sortBy) {
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'popular':
            return b.likes - a.likes
          default: // newest
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })

      setSummaries(filteredSummaries)
    } catch (error) {
      console.error('Error fetching summaries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (summaryId) => {
    try {
      // In a real app, this would call the API
      setSummaries(prev => prev.map(summary => 
        summary.id === summaryId 
          ? { 
              ...summary, 
              isLiked: !summary.isLiked,
              likes: summary.isLiked ? summary.likes - 1 : summary.likes + 1
            }
          : summary
      ))
    } catch (error) {
      console.error('Error liking summary:', error)
    }
  }

  const handleDelete = async (summaryId) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) return

    try {
      // In a real app, this would call the API
      setSummaries(prev => prev.filter(summary => summary.id !== summaryId))
    } catch (error) {
      console.error('Error deleting summary:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUserSummary = () => {
    return summaries.find(s => s.isOwner)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const userSummary = getUserSummary()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {type === 'lesson' ? 'Lesson' : 'Course'} Summaries
          </h3>
          <p className="text-gray-600">
            Share and discover key insights from other learners
          </p>
        </div>

        <button
          onClick={() => onAddSummary(userSummary)}
          className="btn btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          {userSummary ? 'Edit My Summary' : 'Add Summary'}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input text-sm"
            >
              <option value="all">All Summaries</option>
              <option value="mine">My Summaries</option>
              <option value="public">Public Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search summaries..."
              className="input pl-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summaries List */}
      <div className="space-y-4">
        {summaries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to share your insights from this {type}!
            </p>
            <button
              onClick={() => onAddSummary()}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Summary
            </button>
          </div>
        ) : (
          summaries.map((summary) => (
            <div
              key={summary.id}
              className={`bg-white rounded-lg border border-gray-200 p-6 ${
                summary.isOwner ? 'ring-2 ring-primary-100' : ''
              }`}
            >
              {/* Summary Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {summary.author.fullname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {summary.author.fullname}
                      </h4>
                      {summary.isOwner && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          You
                        </span>
                      )}
                      <div className="flex items-center space-x-1 text-gray-500">
                        {summary.isPublic ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span className="text-xs">
                          {summary.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>@{summary.author.username}</span>
                      <span>•</span>
                      <span>{formatDate(summary.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {summary.isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditSummary(summary)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(summary.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Content */}
              <div className="prose max-w-none mb-4">
                <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                  {summary.content}
                </div>
              </div>

              {/* Tags */}
              {summary.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {summary.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <button
                  onClick={() => handleLike(summary.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    summary.isLiked 
                      ? 'text-red-600' 
                      : 'hover:text-red-600'
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${summary.isLiked ? 'fill-current' : ''}`} />
                  <span>{summary.likes}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{summary.comments}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SummaryViewer