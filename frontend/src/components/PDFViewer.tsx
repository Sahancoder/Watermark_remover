import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { translations, Language } from '../i18n/translations'
import OverlayCanvas from './OverlayCanvas'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PDFViewerProps {
  language: Language
}

export default function PDFViewer({ language }: PDFViewerProps) {
  const { pdfData, currentPage, setCurrentPage } = useAppStore()
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [pageData, setPageData] = useState<ImageData | null>(null)
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const t = translations[language]

  // Load PDF document
  useEffect(() => {
    if (!pdfData) return

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfData })
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        
        // Store total pages in app store
        useAppStore.setState({ totalPages: pdf.numPages })
      } catch (error) {
        console.error('PDF load error:', error)
        useAppStore.getState().setError('Failed to load PDF')
      }
    }

    loadPdf()
  }, [pdfData])

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage + 1) // PDF.js uses 1-based indexing
        
        const canvas = canvasRef.current!
        const context = canvas.getContext('2d')!
        const container = canvas.parentElement! // wrapper div
        
        // Fit to container width, never upscale
        const baseViewport = page.getViewport({ scale: 1 }) // unscaled size
        const fitScale = Math.min(container.clientWidth / baseViewport.width, 1) // fit-to-width, never up-scale
        const viewport = page.getViewport({ scale: fitScale })
        
        canvas.width = viewport.width
        canvas.height = viewport.height
        
        setPageSize({ width: viewport.width, height: viewport.height })

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise
        
        // Extract image data for overlay
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        setPageData(imageData)
      } catch (error) {
        console.error('Page render error:', error)
      }
    }

    renderPage()
  }, [pdfDoc, currentPage])

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pdfDoc && currentPage < pdfDoc.numPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (!pdfDoc) {
    return (
      <div className="card-elevated flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="spinner w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            <div className="absolute inset-0 rounded-full bg-primary-300 opacity-20 blur-xl"></div>
          </div>
          <p className="mt-6 text-text-muted font-medium">Loading PDF...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-elevated overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-surface-100 to-surface-200 border-b border-primary-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
        {/* Page Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm border border-primary-200">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-1.5 sm:p-2 hover:bg-primary-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t.previousPage}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs sm:text-sm font-semibold text-text-primary min-w-[80px] sm:min-w-[100px] text-center">
            {t.pageOf
              .replace('{current}', String(currentPage + 1))
              .replace('{total}', String(pdfDoc.numPages))}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pdfDoc.numPages - 1}
            className="p-1.5 sm:p-2 hover:bg-primary-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title={t.nextPage}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Canvas with Overlay */}
      <div 
        ref={containerRef}
        className="canvas-wrap relative overflow-auto bg-gradient-to-br from-surface-100 to-surface-200 p-4 sm:p-8"
        style={{ maxHeight: '80vh' }}
      >
        <div className="relative inline-block shadow-strong rounded-lg overflow-hidden mx-auto">
          {/* PDF Canvas (background) */}
          <canvas
            ref={canvasRef}
            className="block bg-white"
          />
          
          {/* Interactive Overlay Canvas */}
          <div className="absolute top-0 left-0" style={{ width: pageSize.width, height: pageSize.height }}>
            <OverlayCanvas
              width={pageSize.width}
              height={pageSize.height}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
