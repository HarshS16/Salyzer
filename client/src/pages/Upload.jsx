import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload as UploadIcon,
  FileAudio,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const stages = [
  { key: 'uploading', label: 'Uploading audio file...' },
  { key: 'transcribing', label: 'Transcribing with Whisper AI...' },
  { key: 'analyzing', label: 'Analyzing conversation with AI...' },
  { key: 'scoring', label: 'Generating performance scores...' },
  { key: 'complete', label: 'Analysis complete!' },
]

export default function Upload() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStage, setCurrentStage] = useState(-1)
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/x-wav': ['.wav'],
      'audio/webm': ['.webm'],
      'audio/ogg': ['.ogg'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: processing,
  })

  const removeFile = () => {
    setFile(null)
  }

  const handleUpload = async () => {
    if (!file) return
    setProcessing(true)
    setCurrentStage(0)

    try {
      const formData = new FormData()
      formData.append('audio', file)

      // Simulate stage progress for better UX
      const stageInterval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev < 3) return prev + 1
          return prev
        })
      }, 3000)

      const res = await axios.post('/api/calls/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 min timeout for large files
      })

      clearInterval(stageInterval)
      setCurrentStage(4)
      toast.success('Call analyzed successfully!')

      setTimeout(() => {
        navigate(`/analysis/${res.data.callId}`)
      }, 1500)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.')
      setProcessing(false)
      setCurrentStage(-1)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-dashboard-text-main tracking-tight">Upload Sales Call</h1>
        <p className="text-dashboard-text-sub font-medium mt-1">Upload an audio recording for AI-powered analysis</p>
      </div>

      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!processing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-[32px] p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-dashboard-primary bg-dashboard-primary-light'
                  : file
                  ? 'border-accent-500/50 bg-accent-500/5'
                  : 'border-dashboard-border hover:border-dashboard-primary/30 bg-white shadow-sm'
              }`}
            >
              <input {...getInputProps()} id="audio-upload-input" />

              {!file ? (
                <>
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-300 ${
                      isDragActive
                        ? 'bg-primary-500/20 scale-110'
                        : 'bg-surface-800'
                    }`}
                  >
                    <UploadIcon
                      className={`w-7 h-7 transition-colors ${
                        isDragActive ? 'text-primary-400' : 'text-surface-500'
                      }`}
                    />
                  </div>
                  <p className="text-dashboard-text-main font-bold mb-1 text-lg">
                    {isDragActive ? 'Drop your audio file here' : 'Drag & drop your audio file'}
                  </p>
                  <p className="text-surface-500 text-sm mb-4">or click to browse files</p>
                  <p className="text-xs text-surface-600">
                    Supports MP3, WAV, WebM, OGG • Max 100MB
                  </p>
                </>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent-500/15 flex items-center justify-center">
                    <FileAudio className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-dashboard-text-main font-bold truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-dashboard-text-sub font-medium">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile()
                    }}
                    className="p-2 rounded-lg hover:bg-surface-800 transition-colors text-surface-400 hover:text-danger-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {file && (
              <motion.button
                id="analyze-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleUpload}
                className="w-full mt-6 py-3.5 px-6 bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze with AI
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-dashboard-border rounded-[40px] p-10 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-xl bg-dashboard-primary-light flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-dashboard-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-dashboard-text-main leading-tight">Analyzing your call</h3>
                <p className="text-sm font-medium text-dashboard-text-sub">This may take a minute...</p>
              </div>
            </div>

            <div className="space-y-4">
              {stages.map((stage, i) => (
                <div
                  key={stage.key}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    i <= currentStage ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {i < currentStage ? (
                    <CheckCircle2 className="w-5 h-5 text-accent-400 flex-shrink-0" />
                  ) : i === currentStage ? (
                    <Loader2 className="w-5 h-5 text-primary-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-surface-700 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-bold ${
                      i <= currentStage ? 'text-dashboard-text-main' : 'text-dashboard-text-sub opacity-50'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-10 h-2 bg-dashboard-bg rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="bg-white border border-dashboard-border rounded-[32px] p-8 shadow-sm">
        <h3 className="text-lg font-extrabold text-dashboard-text-main mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-dashboard-primary" />
          Tips for best results
        </h3>
        <ul className="space-y-3 text-sm text-dashboard-text-sub font-medium">
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Use clear audio recordings with minimal background noise
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Ensure both caller and customer are audible
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Longer calls provide more detailed analysis
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Supported formats: MP3, WAV, WebM, OGG (max 100MB)
          </li>
        </ul>
      </div>
    </div>
  )
}
