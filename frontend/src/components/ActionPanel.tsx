import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { translations, Language } from '../i18n/translations'
import { applyWatermarkRemoval } from '../services/api'

interface ActionPanelProps {
  language: Language
}

export default function ActionPanel({ language }: ActionPanelProps) {
  const { 
    selections, 
    pdfFile, 
    clearSelections, 
    clearPdf, 
    isProcessing, 
    setProcessing,
    setError 
  } = useAppStore()
  const t = translations[language]
  const [method, setMethod] = useState<'cover' | 'delete' | 'inpaint'>('cover')
  const [coverColor, setCoverColor] = useState('#FFFFFF')

  const handleProcess = async () => {
    if (!pdfFile || selections.length === 0) return

    setProcessing(true)
    setError(null)

    try {
      // Prepare actions with current method
      const actions = selections.map(sel => ({
        page: sel.page,
        bbox: sel.bbox,
        method: method,
        color: method === 'cover' ? coverColor : undefined
      }))

      // Call API
      const blob = await applyWatermarkRemoval(pdfFile, actions, false)

      // Download file
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${pdfFile.name.replace('.pdf', '')}.cleaned.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Success feedback
      alert(t.downloadSuccess)
      
    } catch (error: any) {
      console.error('Processing error:', error)
      setError(error.message || t.errorProcessing)
    } finally {
      setProcessing(false)
    }
  }

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? All selections will be lost.')) {
      clearPdf()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 border border-primary-100">
      {/* Title */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">{t.actionTitle}</h2>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          {selections.length} {selections.length === 1 ? 'selection' : 'selections'}
        </p>
      </div>

      {/* Drawing Hint */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-2.5 sm:p-3">
        <p className="text-xs sm:text-sm text-primary-800 flex items-start space-x-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{t.drawHint}</span>
        </p>
      </div>

      {/* Auto-Detect (v2 feature) */}
      <div>
        <button
          disabled
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-surface-100 text-text-muted text-sm sm:text-base rounded-lg border-2 border-dashed border-primary-200 cursor-not-allowed"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>{t.autoDetect}</span>
            <span className="text-xs bg-surface-200 px-1.5 py-0.5 sm:px-2 rounded">v2</span>
          </div>
        </button>
        <p className="text-xs text-text-muted mt-2">{t.autoDetectHint}</p>
      </div>

      <hr className="border-primary-200" />

      {/* Removal Method */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {t.method}
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 p-3 border border-primary-200 rounded-lg cursor-pointer hover:bg-primary-50">
            <input
              type="radio"
              name="method"
              value="cover"
              checked={method === 'cover'}
              onChange={(e) => setMethod(e.target.value as any)}
              className="text-primary-500"
            />
            <div className="flex-1">
              <span className="font-medium text-text-primary">{t.methodCover}</span>
              <p className="text-xs text-text-muted">Draw opaque rectangle (recommended)</p>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 border border-primary-200 rounded-lg cursor-not-allowed opacity-50">
            <input
              type="radio"
              name="method"
              value="delete"
              disabled
              className="text-primary-500"
            />
            <div className="flex-1">
              <span className="font-medium text-text-primary">{t.methodDelete}</span>
              <span className="text-xs bg-surface-200 px-2 py-0.5 rounded ml-2">v2</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-3 border border-primary-200 rounded-lg cursor-not-allowed opacity-50">
            <input
              type="radio"
              name="method"
              value="inpaint"
              disabled
              className="text-primary-500"
            />
            <div className="flex-1">
              <span className="font-medium text-text-primary">{t.methodInpaint}</span>
              <span className="text-xs bg-surface-200 px-2 py-0.5 rounded ml-2">v3</span>
            </div>
          </label>
        </div>
      </div>

      {/* Cover Color (only for cover method) */}
      {method === 'cover' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t.coverColor}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={coverColor}
              onChange={(e) => setCoverColor(e.target.value)}
              className="h-10 w-20 rounded border border-primary-300 cursor-pointer"
            />
            <input
              type="text"
              value={coverColor}
              onChange={(e) => setCoverColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-primary-200 rounded-lg focus:border-primary-400 focus:ring-2 focus:ring-primary-200"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      )}

      <hr className="border-primary-200" />

      {/* Process Button */}
      <div className="space-y-2 sm:space-y-3">
        <button
          onClick={handleProcess}
          disabled={selections.length === 0 || isProcessing}
          className="w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-primary-500 text-white text-sm sm:text-base rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="spinner w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{t.processing}</span>
            </div>
          ) : (
            t.processButton
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={clearSelections}
            disabled={selections.length === 0}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-100 text-text-primary text-xs sm:text-sm rounded-lg hover:bg-surface-200 disabled:opacity-50 disabled:cursor-not-allowed border border-primary-200"
          >
            Clear Selections
          </button>
          <button
            onClick={handleStartOver}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-surface-100 text-text-primary text-xs sm:text-sm rounded-lg hover:bg-surface-200 border border-primary-200"
          >
            {t.startOver}
          </button>
        </div>
      </div>

      {/* Selections List */}
      {selections.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-text-primary mb-2">
            {t.selectionsTitle}
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selections.map((sel, index) => (
              <div
                key={sel.id}
                className="flex items-center justify-between p-2 bg-surface-50 rounded text-xs sm:text-sm border border-primary-100"
              >
                <span className="text-text-primary">
                  Page {sel.page + 1} - Selection {index + 1}
                </span>
                <button
                  onClick={() => useAppStore.getState().removeSelection(sel.id)}
                  className="text-warning-700 hover:text-warning-800 p-1"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
