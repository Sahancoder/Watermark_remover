import { useState, useRef } from 'react'
import { Stage, Layer, Rect, Transformer } from 'react-konva'
import { useAppStore } from '../store/appStore'
import type { KonvaEventObject } from 'konva/lib/Node'

interface OverlayCanvasProps {
  width: number
  height: number
  currentPage: number
}

export default function OverlayCanvas({ width, height, currentPage }: OverlayCanvasProps) {
  const { selections, addSelection, removeSelection } = useAppStore()
  const [isDrawing, setIsDrawing] = useState(false)
  const [newRect, setNewRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const stageRef = useRef<any>(null)

  // Filter selections for current page
  const pageSelections = selections.filter(s => s.page === currentPage)

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // Only draw on background click
    if (e.target !== e.target.getStage()) return

    const stage = e.target.getStage()
    const point = stage?.getPointerPosition()
    if (!point) return

    setIsDrawing(true)
    setNewRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0
    })
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !newRect) return

    const stage = e.target.getStage()
    const point = stage?.getPointerPosition()
    if (!point) return

    setNewRect({
      ...newRect,
      width: point.x - newRect.x,
      height: point.y - newRect.y
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !newRect) return

    // Only add if rectangle has meaningful size
    if (Math.abs(newRect.width) > 10 && Math.abs(newRect.height) > 10) {
      // Normalize negative width/height
      const normalizedRect = {
        x: newRect.width < 0 ? newRect.x + newRect.width : newRect.x,
        y: newRect.height < 0 ? newRect.y + newRect.height : newRect.y,
        width: Math.abs(newRect.width),
        height: Math.abs(newRect.height)
      }

      addSelection({
        page: currentPage,
        bbox: [normalizedRect.x, normalizedRect.y, normalizedRect.width, normalizedRect.height],
        method: 'cover',
        color: '#FFFFFF'
      })
    }

    setIsDrawing(false)
    setNewRect(null)
  }

  const handleSelectShape = (id: string) => {
    setSelectedId(id)
  }

  const handleDelete = (id: string) => {
    removeSelection(id)
    setSelectedId(null)
  }

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="cursor-crosshair"
      >
        <Layer>
          {/* Existing selections */}
          {pageSelections.map(selection => {
            const [x, y, w, h] = selection.bbox
            return (
              <Rect
                key={selection.id}
                x={x}
                y={y}
                width={w}
                height={h}
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="rgba(14, 165, 233, 0.2)"
                onClick={() => handleSelectShape(selection.id)}
                onTap={() => handleSelectShape(selection.id)}
                draggable={false}
              />
            )
          })}

          {/* New rectangle being drawn */}
          {newRect && (
            <Rect
              x={newRect.x}
              y={newRect.y}
              width={newRect.width}
              height={newRect.height}
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="rgba(14, 165, 233, 0.2)"
              dash={[5, 5]}
            />
          )}
        </Layer>
      </Stage>

      {/* Selection info tooltip */}
      {selectedId && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 glass rounded-xl sm:rounded-2xl shadow-strong p-2.5 sm:p-4 border border-primary-200 bg-white/90 backdrop-blur-lg min-w-[160px] sm:min-w-[200px]">
          <div className="flex items-center justify-between space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-500 rounded-full"></div>
              <span className="text-xs sm:text-sm font-semibold text-text-primary">Selected Area</span>
            </div>
            <button
              onClick={() => handleDelete(selectedId)}
              className="p-1 sm:p-2 text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
              title="Delete selection"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Drawing hint */}
      {pageSelections.length === 0 && !isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="glass rounded-xl sm:rounded-2xl px-4 py-3 sm:px-8 sm:py-4 shadow-strong max-w-md bg-white/90 backdrop-blur-lg border border-primary-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-text-primary">Draw to Select</p>
                <p className="text-xs text-text-muted mt-0.5 sm:mt-1">Click and drag to mark watermark areas</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
