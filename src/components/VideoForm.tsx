'use client'

import { useState } from 'react'
import VideoInfo from './VideoInfo'
import { isValidYouTubeUrl } from '@/utils/validation'

interface VideoData {
  formats: Array<{
    formatId: string;
    quality: string;
    extension: string;
    filesize: number;
    downloadUrl: string;
  }>;
  videoInfo: {
    title: string;
    thumbnail: string;
    duration: string;
    author: string;
  };
}

export default function VideoForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      if (!isValidYouTubeUrl(url)) {
        throw new Error('Please enter a valid YouTube URL')
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to analyze video')
      }

      const data = await response.json()
      setVideoData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <input
            type="url"
            id="video-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? 'Analyzing...' : 'Analyze Video'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {videoData && (
        <VideoInfo
          {...videoData.videoInfo}
          formats={videoData.formats}
          onDownload={handleDownload}
        />
      )}
    </div>
  )
} 