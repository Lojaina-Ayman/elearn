import React, { useState } from 'react'
import { 
  X, 
  Save, 
  FileText, 
  Upload, 
  Star, 
  Users,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react'

const SummaryModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  type = 'lesson', // 'lesson' or 'course'
  title,
  existingSummary = null,
  isEditing = false
}) => {
  const [summary, setSummary] = useState(existingSummary?.content || '')
  const [isPublic, setIsPublic] = useState(existingSummary?.isPublic ?? true)
  const [tags, setTags] = useState(existingSummary?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!summary.trim()) return

    setSaving(true)
    try {
      const summaryData = {
        content: summary,
        isPublic,
        tags,
        type,
        createdAt: new Date().toISOString()
      }

      await onSave(summaryData)
      onClose()
      setSummary('')
      setTags([])
      setNewTag('')
    } catch (error) {
      console.error('Error saving summary:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit' : 'Add'} {type === 'lesson' ? 'Lesson' : 'Course'} Summary
              </h3>
              <p className="text-sm text-gray-600">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Summary Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary Content *
              </label>
              <textarea
                className="input min-h-[300px] resize-none"
                placeholder={`Share your key takeaways from this ${type}. Your summary will help other learners understand the main concepts and important points.

Tips for a great summary:
• Highlight the most important concepts
• Include practical examples or use cases
• Mention any challenges you faced
• Add your personal insights or tips`}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Minimum 50 characters recommended</span>
                <span>{summary.length} characters</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-500 hover:text-primary-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Add a tag (e.g., react, javascript, beginner)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="btn btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Visibility Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="text-primary-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-success-600" />
                    <div>
                      <span className="font-medium text-gray-900">Public</span>
                      <p className="text-sm text-gray-600">Other learners can view and benefit from your summary</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="text-primary-600"
                  />
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <div>
                      <span className="font-medium text-gray-900">Private</span>
                      <p className="text-sm text-gray-600">Only you can see this summary</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Preview of existing summaries (if any) */}
            {type === 'lesson' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Summary Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Focus on the main learning objectives</li>
                  <li>• Include practical examples or code snippets</li>
                  <li>• Mention any prerequisites or related topics</li>
                  <li>• Add your personal insights or "aha" moments</li>
                </ul>
              </div>
            )}

            {type === 'course' && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">🎯 Course Summary Tips</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Summarize the overall learning journey</li>
                  <li>• Highlight the most valuable lessons</li>
                  <li>• Mention practical projects or applications</li>
                  <li>• Share your recommendations for future learners</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {isPublic ? (
              <span className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>This summary will be visible to other learners</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>This summary will be private</span>
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !summary.trim()}
              className="btn btn-primary"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Update' : 'Save'} Summary
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryModal