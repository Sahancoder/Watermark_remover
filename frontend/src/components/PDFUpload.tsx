import { useCallback } from 'react'
import { useAppStore } from '../store/appStore'
import { translations, Language } from '../i18n/translations'

interface PDFUploadProps {
  language: Language
}

export default function PDFUpload({ language }: PDFUploadProps) {
  const { setPdfFile, setError } = useAppStore()
  const t = translations[language]

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    if (!file.type.includes('pdf')) {
      setError(t.errorInvalidPdf)
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      setError(t.errorTooLarge)
      return
    }

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      setPdfFile(file, arrayBuffer)
    } catch (error) {
      console.error('File read error:', error)
      setError(t.errorInvalidPdf)
    }
  }, [setPdfFile, setError, t])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }, [handleFileSelect])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-280px)] px-4">
      <div className="w-full max-w-3xl">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="group card-elevated hover:border-primary-400 border-2 border-dashed border-primary-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center cursor-pointer transition-all duration-300 bg-white/90 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center">
            {/* Upload Icon with animation */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-primary-300 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-strong transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 sm:mb-3">
              {t.uploadTitle}
            </h2>
            
            {/* Subtitle */}
            <p className="text-text-muted mb-6 sm:mb-8 text-base sm:text-lg font-medium px-4">
              {t.uploadSubtitle}
            </p>

            {/* File Input */}
            <label className="cursor-pointer group/btn">
              <span className="inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl shadow-strong hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <span className="flex items-center space-x-2 sm:space-x-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{t.uploadButton}</span>
                </span>
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>

            {/* Hint */}
            <p className="text-xs sm:text-sm text-text-muted mt-4 sm:mt-6 font-medium">
              {t.uploadHint}
            </p>
          </div>
        </div>

        {/* Privacy Features Grid */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="card hover-lift text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-success-400 to-success-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">No File Storage</h3>
            <p className="text-xs sm:text-sm text-text-muted">Your files are never saved on our servers</p>
          </div>

          <div className="card hover-lift text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">100% Open Source</h3>
            <p className="text-xs sm:text-sm text-text-muted">Fully transparent and auditable code</p>
          </div>

          <div className="card hover-lift text-center p-4 sm:p-6 sm:col-span-1 col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-warning-400 to-warning-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-bold text-text-primary mb-1 sm:mb-2 text-sm sm:text-base">RAM Only Processing</h3>
            <p className="text-xs sm:text-sm text-text-muted">Everything processed in memory</p>
          </div>
        </div>
      </div>
    </div>
  )
}
